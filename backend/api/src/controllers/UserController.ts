import { db } from "../db";
import { Request, Response } from "express";
import { generateAccessToken } from "../middleware/auth";
import { PoolConnection } from "mysql2/promise";
import { SMPTSendEmail } from "../shared/email/email";

const USER_TABLE = 'user'
const USER_STATISTICS = 'global_statistic'
const ERR_MISSING_USER_FIELD = "Missing `username`"
const ERR_MISSING_EMAIL_FIELD = "Missing `email`"
const ERR_INVALID_EMAIL = "email is invalid: "
const ERR_INVALID_USERNAME_LENGTH = "username length is too short"
const emailRegex = new RegExp(/^\S+@\S+\.\S\S+$/);

/**
 * Creates an unverified user, sends an email with a activation token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const RegisterUser = async (req : Request, res: Response) : Promise<void> =>  {
  
  // Get request json body
  const username : string | null = req.body?.username
  const email : string | null = req.body?.email

  // Return error if user field is missing
  if (username === null) {
    res.status(400).json({
      message : ERR_MISSING_USER_FIELD
    })

    return
  }

  // Return error if email field is missing
  if (email === null) {
    res.status(400).json({
      message : ERR_MISSING_EMAIL_FIELD
    })

    return
  }

  // Validate that the user has a minimun length of 5 characters.
  if (username?.length < 5) {
    res.status(400).json({
      message : ERR_INVALID_USERNAME_LENGTH + ": " + username.length
    })

    return
  }

  // Validate that the email contains an '@' and characters before and after and a TLD of at least two characters.
  if (!emailRegex.test(email)) {

    res.status(400).json({
      message : ERR_INVALID_EMAIL + email
    })

    return
  }

  let query = `insert into ${USER_TABLE} (username,email) values (?, ?);`
  let values = [username, email]

  // define user_id as we will be returning it at the end.
  let user_id : string | undefined;

  // Declare poolConnection so we can close it in case something goes wrong.
  let poolConnection : PoolConnection | undefined;
  
  try {
    // Get pool connection from the database and create a user.
    poolConnection =  await db.getConnection()
    const [data, ] = await poolConnection.query(
      query,
      values
    )
    
    // We query the id of the newly created user.
    query = `select BIN_TO_UUID(user_id) as  user_id from ${USER_TABLE} where username=?;`
    values = [ username ]

    // The query method automatically escapes user input.
    const [user_id_raw, ] = await poolConnection.query(
      query,
      values
    )

    // We parse the user_id
    // TODO: Ensure nothing can go wrong
    user_id = user_id_raw[0]["user_id"]
    
  } catch (error) {
    // The user is a duplicated entry, either the email or username is taken.
    if (error?.code  == 'ER_DUP_ENTRY') {
      res.status(400).json({
        message: `ERROR: ${error?.sqlMessage}`
      })

      return
    }
    
    // An unknown error happened while performing a database operation.
    res.status(500).json({
      message: "An error has occured."
    })

    return
  } finally {
    // We close the connection to the database, so other instances can use it.
    poolConnection?.release()
  }

  // TODO: Temporal because we dont have a login endpoint
  // Generate access token with the user_id
  const jwt = generateAccessToken({ user_id: user_id})

  // Return jwt so the user can access protected endpoints, 201 as it was created.
  res.status(201).json(
    {
      "token" :  `${jwt}`
    }
  )
  return
}  


/**
 * Tries to login a verified user with its credentials, and returns a jwt token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
 export const LoginUser = async (req : Request, res: Response) : Promise<void> => {
  const info = await SMPTSendEmail({
    subject : "string",
    type : "html" ,
    to: [],
    message: "token.html"
})

  console.log("Info: " + info)

  res.json(info)
}

/**
 * Get the user statistics of a player.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const GetUserStatistics = async (req : Request, res: Response) : Promise<void> =>  {

  const query = `SELECT * FROM ${USER_STATISTICS} where user_id=?;`

  const user_id = req.params.id

   // Declare poolConnection so we can close it in case something goes wrong.
  let poolConnection : PoolConnection | undefined;

  try {
      // Get pool connection from the database and create a user.
      poolConnection =  await db.getConnection()
      const [data, _] = await poolConnection.query(
        query,
        [ user_id ]
      )
      
      // Return Ok (200) and return fetched data
      res.status(200).json(
          data
      )
      return

    } catch (error) {  
      // An Unkown Error happened in the database.
      res.status(500).json({
        message: "An error has occured."
      })
    } finally {
        // We close the connection to the database, so other instances can use it.
        poolConnection?.release()
    }

}

