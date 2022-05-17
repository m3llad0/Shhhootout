import nodemailer, { Transporter } from "nodemailer"
import SMTPTransport, { SentMessageInfo } from "nodemailer/lib/smtp-transport"
import fs from "fs"
import path from "path"
type EmailContentType = "text" | "html"
type EmailRecipientType = "to" | "bcc" | "cc"

interface Recipient {
    email: string
    name?: string
    type: EmailRecipientType
}

interface SendEmailRequest {
    subject : string
    type : EmailContentType 
    to: Recipient[]
    message: string
}

type SendEmailType = (email: SendEmailRequest) => Promise<string>

const BASE_MAILCHIMP_URL =  "https://mandrillapp.com/api/1.0"
const SENDER = "Shoout <no-reply@shouut.io>"

const  createTestTransport = async () : Promise<nodemailer.Transporter<SMTPTransport.SentMessageInfo>> => {
    let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  return transporter
}

const transport : SMTPTransport.Options = {
    host: process.env.SMPT_HOST,
    port: Number(process.env.SMPT_PORT) ,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMPT_USER, // generated ethereal user
      pass: process.env.MAILCHIMP_APIKEY, // generated ethereal password
    },
}

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(transport);

export const SMPTSendEmail : SendEmailType = async (request) : Promise<string> => {
    let htmlstream : fs.ReadStream | undefined;
    const transport = await createTestTransport()
   

    const sendOptions = {
        from: SENDER, // sender address
        to: "stephan.guingor04@gmail.com", // list of receivers
        subject: request.subject, // Subject line
        
      }

    if (request.type === "text") {
        sendOptions["text"] = request.message
    }

    if (request.type === "html") {
        
        htmlstream = fs.createReadStream(path.resolve(__dirname, "./templates/" + request.message));

        sendOptions["html"] = htmlstream
    }

    try {
        // send mail with defined transport object
        let info = await transport.sendMail(sendOptions);
        return nodemailer.getTestMessageUrl(info) as string

    } catch (e) {
        return e.message
    } finally {
        htmlstream?.close()
    }
  
}

export const MailChimpSendEmail :  SendEmailType = async (request) : Promise<string> => {

    const mess = {}
    mess[request.type] = request.message

    const data = {
        key : process.env.MAILCHIMP_APIKEY,
        message: {
            subject: request.subject,
            to: request.to,
            from_email: "stephan@gmail.com",
            ...mess
        }
    }

    const r = await fetch(BASE_MAILCHIMP_URL + "/messages/send", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    console.log("data" + r)
    const rj = await r.json()
    console.log(rj)

    return rj
}