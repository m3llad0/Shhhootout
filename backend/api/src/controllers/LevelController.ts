import { db } from "../db";
import { query, Request, Response } from "express";
import { PoolConnection, RowDataPacket } from "mysql2/promise";


const TRENDING_LEVEL_VIEW = "trending_levels"
const LEVEL_STATISTiC = "level_statistic"
const USER_TABLE = "user"
const LEVEL_TABLE = "level"
const STARRED_LEVELS = "starred_levels"
const ERROR_MISSING_NAME = "Missing name"
const ERROR_MISSING_DESCRIPTION = "Missing description"
const ERR_INVALID_JSON = "Invalid json"

/**
 * Gets the top n level that have the most amount of downloads in the last week.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const GetTrendingLevels = async (req: Request, res :Response) => {

    const query = `SELECT BIN_TO_UUID(level_id) as level_id, BIN_TO_UUID(user_id) as user_id, username, email, name, description, create_date FROM ${TRENDING_LEVEL_VIEW} NATURAL JOIN ${USER_TABLE} LIMIT 10`

    // Declare poolConnection so we can close it in case something goes wrong.
    let poolConnection : PoolConnection | undefined;

    try {
      // Get pool connection from the database and get the trending levels
        poolConnection =  await db.getConnection()
        const [data, _] = await poolConnection.query(
          query
        )
        
        const mappedData = (data as RowDataPacket[]).map((value) => {
          return {
            level_id : value.level_id,
            description: value.description,
            create_date: value.create_date,
            name: value.name,
            user: {
              user_id: value.user_id,
              username: value.username,
              email: value.email
            }
          }
        })
      // Operation succeded, return OK (200)
        res.status(200).json(
            mappedData
        )
      
     
      return
      } catch (error) {
        console.log(poolConnection)
        // An unknown error happened while performing a database operation.
        console.log(error)
        res.status(500).json({
          message: "An error has occured."
        })
      } finally {

      // We close the connection to the database, so other instances can use it.
      poolConnection?.release()

      }

}

/**
 * Get the statistics for a specified level
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const GetLevelStatistics = async (req: Request, res :Response) => {

  const query = `SELECT * FROM ${LEVEL_STATISTiC} where level_id=?;`

  // Get the level_id from the path parameter
  const level_id = req.params.id
  
   // Declare poolConnection so we can close it in case something goes wrong.
  let poolConnection : PoolConnection | undefined;

  try {
      // Get pool connection from the database and get the statistics of the level
      poolConnection = await db.getConnection()
 
      const [data, _] = await poolConnection.query(
        query,
        [ level_id ]
      )
      
      // Operation succeded, return OK (200)
      res.status(200).json(
          data
      )


      return
    } catch (error) {  
      // Unkown Error
      res.status(500).json({
        message: "An error has occured."
      })
    }
  
    finally {
      // We close the connection to the database, so other instances can use it.
      poolConnection?.release()
    }

}

/**
 * Create a level for a specified user. 
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const CreateLevel = async (req: Request, res: Response) => {
  const user_id = (req.params.auth as any).user_id;

  const name = req.body.name;

  if (!name) {
    res.status(400).json(
      { message: ERROR_MISSING_NAME }
    )

    return
  }

  const description = req.body.description;

  if (!description) {
    res.status(400).json(
      { message: ERROR_MISSING_DESCRIPTION }
    )

    return
  }

  const verified = req.body.verified || false;

  const jsonData = req.body.level_data;

  const query = `INSERT INTO ${LEVEL_TABLE} (name, description, verified, level_data, creator_id) values (?, ?, ?,?, UUID_TO_BIN(?));`

  const dataQuery = [name, description, verified, jsonData, user_id];

    // Declare poolConnection so we can close it in case something goes wrong.
    let poolConnection : PoolConnection | undefined;

    try {
      // Get pool connection from the database and get the trending levels
        poolConnection =  await db.getConnection()
        const [data, _] = await poolConnection.query(
          query,
          dataQuery
        )
      
      } catch (error) {
    
        if (error.errno == 3140) {
          res.status(400).json({
            message: ERR_INVALID_JSON
          })
          return
        }
        res.status(500).json({
          message: "An error has occured."
        })
        return
      } finally {

      // We close the connection to the database, so other instances can use it.
      poolConnection?.release()

      }

      // Operation succeded, return OK (200)
      res.status(201).json(
        { message: "Level created!"}
      )
}

/**
 * Gets a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const GetLevels = async (req:  Request, res: Response) => {

  const user_id = (req.params.auth as any).user_id;

  const query = `SELECT BIN_TO_UUID(level_id) as level_id, BIN_TO_UUID(user_id) as user_id, username, email, name, description, create_date, level_data FROM ${LEVEL_TABLE} NATURAL JOIN ${USER_TABLE} where user_id = UUID_TO_BIN(?)`
  const dataQuery = [ user_id ]
  // Declare poolConnection so we can close it in case something goes wrong.
  let poolConnection : PoolConnection | undefined;

  try {
    // Get pool connection from the database and get the trending levels
      poolConnection =  await db.getConnection()
      const [data, _] = await poolConnection.query(
        query,
        dataQuery
      )
      
      const mappedData = (data as RowDataPacket[]).map((value) => {
        return {
          level_id : value.level_id,
          name: value.name,
          description: value.description,
          create_date: value.create_date,
          level_data: value.level_data,
          user: {
            user_id: value.user_id,
            username: value.username,
            email: value.email
          }
        }
      })
    // Operation succeded, return OK (200)
      res.status(200).json(
          mappedData
      )
    
   
    return
    } catch (error) {
      console.log(poolConnection)
      // An unknown error happened while performing a database operation.
      console.log(error)
      res.status(500).json({
        message: "An error has occured."
      })
    } finally {

    // We close the connection to the database, so other instances can use it.
    poolConnection?.release()

    }
}

/**
 * Gets a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
 export const GetLevel = async (req:  Request, res: Response) => {

  const level_id = req.params.id

  const query = `SELECT BIN_TO_UUID(level_id) as level_id, BIN_TO_UUID(user_id) as user_id, username, email, name, description, create_date, level_data FROM ${LEVEL_TABLE} NATURAL JOIN ${USER_TABLE} where level_id = UUID_TO_BIN(?) LIMIT 1`
  const dataQuery = [ level_id ]
  // Declare poolConnection so we can close it in case something goes wrong.
  let poolConnection : PoolConnection | undefined;

  try {
    // Get pool connection from the database and get the trending levels
      poolConnection =  await db.getConnection()
      const [data, _] = await poolConnection.query(
        query,
        dataQuery
      )

      if ((data as RowDataPacket[]).length < 1) {
        res.sendStatus(404);
        return
      }
      
      const mappedData = (data as RowDataPacket[]).map((value) => {
        return {
          level_id : value.level_id,
          name: value.name,
          description: value.description,
          create_date: value.create_date,
          level_data: value.level_data,
          user: {
            user_id: value.user_id,
            username: value.username,
            email: value.email
          }
        }
      })[0]
    // Operation succeded, return OK (200)
      res.status(200).json(
          mappedData
      )
    
   
    return
    } catch (error) {
      console.log(poolConnection)
      // An unknown error happened while performing a database operation.
      console.log(error)
      res.status(500).json({
        message: "An error has occured."
      })
    } finally {

    // We close the connection to the database, so other instances can use it.
    poolConnection?.release()

    }
}

/**
 * Updates a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const UpdateLevel = async (req: Request, res: Response) => {
  const user_id = (req.params.auth as any).user_id;
  const level_id = req.params.id
  const name = req.body.name 
  const description = req.body.description 
  const data = req.body.data 

  let updateExpr = []
  let dataQuery = []

  if (name) {
    updateExpr.push('name = ?')
    dataQuery.push(name)
  }

  if (description) {
    updateExpr.push('description = ?')
    dataQuery.push(description)
  }

  if (data) {
    updateExpr.push('data = ?')
    dataQuery.push(data)
  }

  if (!updateExpr) {
    GetLevel(req, res)
    return
  }

  dataQuery.push(level_id)
  dataQuery.push(user_id)
  
  const query = `UPDATE ${LEVEL_TABLE} SET ${updateExpr.join(',')} where level_id = UUID_TO_BIN(?) and creator_id = UUID_TO_BIN(?)`

  // Declare poolConnection so we can close it in case something goes wrong.
  let poolConnection : PoolConnection | undefined;

  try {
    // Get pool connection from the database and get the trending levels
      poolConnection =  await db.getConnection()
      let [data, _] = await poolConnection.query(
        query,
        dataQuery
      )

      GetLevel(req, res)
  
    return
    } catch (error) {
      console.log(poolConnection)
      // An unknown error happened while performing a database operation.
      console.log(error)
      res.status(500).json({
        message: "An error has occured."
      })
    } finally {

    // We close the connection to the database, so other instances can use it.
    poolConnection?.release()

    }
}

/**
 * Deletes a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const DeleteLevel = async (req : Request, res: Response) => {
  const user_id = (req.params.auth as any).user_id;
  const level_id = req.params.id;

  const query = `delete from ${LEVEL_TABLE} where creator_id = UUID_TO_BIN(?) and level_id = UUID_TO_BIN(?)`

  const dataQuery = [user_id, level_id];

    // Declare poolConnection so we can close it in case something goes wrong.
    let poolConnection : PoolConnection | undefined;

    try {
      // Get pool connection from the database and get the trending levels
        poolConnection =  await db.getConnection()
        const [data, _] = await poolConnection.query(
          query,
          dataQuery
        )

        console.log(data)
      
      } catch (error) {
    console.log(error.message)
        res.status(500).json({
          message: "An error has occured."
        })
        return
      } finally {

      // We close the connection to the database, so other instances can use it.
      poolConnection?.release()

      }

      // Operation succeded, return OK (200)
      res.status(204).json(
        { message: "Level deleted!"}
      )
}

/**
 * It adds a level to the starred level of a player.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const StarLevel = async (req : Request, res : Response) => {
  const user_id = (req.params.auth as any).user_id;

  const level_id = req.params.id;

  const query = `INSERT INTO ${STARRED_LEVELS} (level_id, user_id) values (UUID_TO_BIN(?), UUID_TO_BIN(?));`

  const dataQuery = [level_id, user_id];

    // Declare poolConnection so we can close it in case something goes wrong.
    let poolConnection : PoolConnection | undefined;

    try {
      // Get pool connection from the database and get the trending levels
        poolConnection =  await db.getConnection()
        const [data, _] = await poolConnection.query(
          query,
          dataQuery
        )
      
      } catch (error) {
    
        console.log(error)
        res.status(500).json({
          message: "An error has occured."
        })
        return
      } finally {

      // We close the connection to the database, so other instances can use it.
      poolConnection?.release()

      }

      // Operation succeded, return OK (200)
      res.status(201).json(
        { message: "Level Starred!"}
      )
}
