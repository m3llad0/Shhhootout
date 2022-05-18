import { db } from "../db";
import { Request, Response } from "express";
import { generateAccessToken } from "../middleware/auth";
import { PoolConnection } from "mysql2/promise";
import { hashPassword, isStrongPassword, verifyPassword } from "../shared/utils/crypto";

const USER_TABLE = 'user'
const USER_STATISTICS = 'global_statistic'
const ERR_MISSING_USER_FIELD = "Missing `username`"
const ERR_MISSING_ACCOUNT_FIELD = "Missing `account`"
const ERR_MISSING_PASSWORD_FIELD = "Missing `password`"
const ERR_ACCOUNT_NOT_FOUND = "Account not found"
const ERR_MISSING_EMAIL_FIELD = "Missing `email`"
const ERR_INVALID_EMAIL = "email is invalid: "
const ERR_INVALID_USERNAME_LENGTH = "username length is too short"
const ERR_WRONG_PASSWORD = "wrong password"
const ERR_PASSWORD_WEAK = "password is weak"
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
  const password : string = req.body?.password

  // Return error if user field is missing
  if (!username) {
    res.status(400).json({
      message : ERR_MISSING_USER_FIELD
    })

    return
  }

  // Return error if email field is missing
  if (!email) {
    res.status(400).json({
      message : ERR_MISSING_EMAIL_FIELD
    })

    return
  }

  // Return error if email field is missing
  if (!password) {
    res.status(400).json({
      message : ERR_MISSING_PASSWORD_FIELD
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

  // Validate password is strong
  if (!isStrongPassword(password)) {
    res.status(400).json({
      message : ERR_PASSWORD_WEAK
    })

    return
  }

  const hashedPassword = await hashPassword(password)

  if (hashedPassword == null) {
    res.sendStatus(500)

    return
  }

  let query = `insert into ${USER_TABLE} (username,email,password) values (?, ?, ?);`
  let values = [username, email, hashedPassword]

  // Declare poolConnection so we can close it in case something goes wrong.
  let poolConnection : PoolConnection | undefined;
  
  try {
    // Get pool connection from the database and create a user.
    poolConnection =  await db.getConnection()
    const [data, ] = await poolConnection.query(
      query,
      values
    )
    
    
    
  } catch (error) {
    console.error(error)
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

  res.status(201).json({
    message: `User ${username} created!`
  })

  return
}  

/**
 * Tries to login a verified user with its credentials, and returns a jwt token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
 export const LoginUser = async (req : Request, res: Response) : Promise<void> => {
    const account = req.body?.account 
    const password = req.body?.password

      // Return error if user field is missing
    if (!account) {
      res.status(400).json({
        message : ERR_MISSING_ACCOUNT_FIELD
      })

      return
    }

    // Return error if email field is missing
    if (!password) {
      res.status(400).json({
        message : ERR_MISSING_PASSWORD_FIELD
      })

      return
    }

    let poolConnection;
    let user_id;

    const query = `select BIN_TO_UUID(user_id) as  user_id, password from ${USER_TABLE} where username=? or email=?`
    const values = [account, account]
    try {
      // Get pool connection from the database and create a user.
      poolConnection =  await db.getConnection()
      const [data, ] = await poolConnection.query(
        query,
        values
      )
      
    
      if (!data || data?.length < 1) {
        res.status(404).json({
          message: ERR_ACCOUNT_NOT_FOUND
        })

        return
      }

      const passwordHash = data[0].password

      const validPassword = await verifyPassword(password, passwordHash)
      console.log(validPassword)
      if (!validPassword) {
        res.status(400).json({
          message: ERR_WRONG_PASSWORD
        })

        return
      }

      user_id = data[0]["user_id"]
      
    } catch (error) {
      console.error(error)
      // An unknown error happened while performing a database operation.
      res.status(500).json({
        message: "An error has occured."
      })
  
      return
    } finally {
      // We close the connection to the database, so other instances can use it.
      poolConnection?.release()
    }

    // Generate access token with the user_id
    const jwt = generateAccessToken({ user_id: user_id})

    // Return jwt so the user can access protected endpoints, 201 as it was created.
    res.status(200).json(
      {
        "token" :  `${jwt}`
      }
    )

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

