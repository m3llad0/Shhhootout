import {db} from "../db";
import { Request, Response } from "express";

const USER_TABLE = 'user'
const ERR_INVALID_EMAIL = "email is invalid: "

const emailRegex = new RegExp(/^\S+@\S+\.\S\S+$/);



interface CreateUserResponse {
  message: string
}



  export const CreateUser = async (req : Request, res: Response) : Promise<CreateUserResponse> =>  {
    
    //  validate 
    const username : string | null = req.body?.username
    const email : string | null = req.body?.email
    if (!emailRegex.test(email)) {
      // invalid email address
      res.json({
        message : ERR_INVALID_EMAIL + email // verify
      })

      return
    }

    

    // create user
    const query = `
      INSERT INTO ${USER_TABLE} (username, email) VALUES (? ?)"
    `

    const values = [username, email]

    try {
      const poolConnection =  await db.getConnection()
      console.log(poolConnection)
      const r = await poolConnection.query(
        query,
        values
      )
      
    } catch (error) {
      console.log(error)
    }
  


     
    
   
  


    // we create an account and link to email. We would expect email verification eventually.
    // validate with oath or email

    // 

 }  
