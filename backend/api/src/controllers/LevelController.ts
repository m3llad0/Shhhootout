import {db} from "../db";
import { Request, Response } from "express";

const TRENDING_LEVEL_VIEW = "trending_levels"

export const GetTrendingLevels = async (req: Request, res :Response) => {

    const query = `SELECT * FROM ${TRENDING_LEVEL_VIEW} LIMIT 10`

    try {
        const poolConnection =  await db.getConnection()
        const [data, _] = await poolConnection.query(
          query
        )
        
        res.status(201).json(
            data
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