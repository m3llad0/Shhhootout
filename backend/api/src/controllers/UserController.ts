import {db} from "../db";
import { Request, Response } from "express";

const USER_TABLE = 'user'
const ERR_MISSING_USER_FIELD = "Missing `username`"
const ERR_MISSING_EMAIL_FIELD = "Missing `email`"
const ERR_INVALID_EMAIL = "email is invalid: "
const ERR_INVALID_USERNAME_LENGTH = "username length is too short"
const emailRegex = new RegExp(/^\S+@\S+\.\S\S+$/);



interface CreateUserResponse {
  message: string
}

  export const CreateUser = async (req : Request, res: Response) : Promise<void> =>  {
    
    // Recieve request data
    const username : string | null = req.body?.username
    const email : string | null = req.body?.email

    // Verify we received all fields
    if (username === null) {
      res.status(400).json({
        message : ERR_MISSING_USER_FIELD
      })

      return
    }

    if (email === null) {
      res.status(400).json({
        message : ERR_MISSING_EMAIL_FIELD
      })

      return
    }

    // Validate username
    if (username?.length < 5) {
      res.status(400).json({
        message : ERR_INVALID_USERNAME_LENGTH + ": " + username.length
      })

      return
    }

    // Validate Email
    if (!emailRegex.test(email)) {
  
      res.status(400).json({
        message : ERR_INVALID_EMAIL + email
      })

      return
    }

    // Create User Query
    // TODO: Improve Buisiness logic to create temporal users until they get verified.
    const query = `insert into ${USER_TABLE} (username,email) values (?, ?);`
    const values = [username, email]
    try {
      const poolConnection =  await db.getConnection()
      const [data, _] = await poolConnection.query(
        query,
        values
      )
      
      res.status(201).json(
        {
          "message" :  `User created ${username}`
        }
      )
      return

    } catch (error) {
      // Handle SQL Errors
      if (error?.code  == 'ER_DUP_ENTRY') {
        res.status(400).json({
          message: `ERROR: ${error?.sqlMessage}`
        })

        return
      }
      
      // Unkown Error
      res.status(500).json({
        message: "An error has occured."
      })
    }
 }  
