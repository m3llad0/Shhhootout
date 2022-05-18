import { db } from "../db";
import { Request, Response } from "express";
import { PoolConnection } from "mysql2/promise";


const TRENDING_LEVEL_VIEW = "trending_levels"
const LEVEL_STATISTiC = "level_statistic"

/**
 * Gets the top n level that have the most amount of downloads in the last week.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const GetTrendingLevels = async (req: Request, res :Response) => {

    const query = `SELECT * FROM ${TRENDING_LEVEL_VIEW} LIMIT 10`

    // Declare poolConnection so we can close it in case something goes wrong.
    let poolConnection : PoolConnection | undefined;

    try {
      // Get pool connection from the database and get the trending levels
        poolConnection =  await db.getConnection()
        const [data, _] = await poolConnection.query(
          query
        )
        
      // Operation succeded, return OK (200)
        res.status(200).json(
            data
        )
      
     
      return
      } catch (error) {
        console.log(poolConnection)
        // An unknown error happened while performing a database operation.
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
export const CreateLevel = () => {

}

/**
 * Gets a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const GetLevel = () => {

}

/**
 * Updates a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const UpdateLevel = () => {

}

/**
 * Deletes a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const DeleteLevel = () => {

}

/**
 * It adds a level to the starred level of a player.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const StarLevel = () => {

}
