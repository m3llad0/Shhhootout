import { db } from "../db";
import { Request, Response } from "express";
import { PoolConnection } from "mysql2/promise";

const SCORE_TABLE = 'score'
const SESSION_TABLE = "session"
const ERR_MISSING_TIME_PLAY = "Missing time_play"
const ERR_MISSING_TIME_EDITOR = "Missing time_editor"
const ERR_MISSING_TIME_OTHER = "Missing time_other"
const ERR_MISSING_LEVEL_ID = "Missing level_id"
const ERR_MISSING_SESSION_ID = "Missing session_id"
const ERR_MISSING_TIME = "Missing time"
const ERR_MISSING_COMPLETION = "Missing completion"

/**
 * Creates an unverified user, sends an email with a activation token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const CreateScore = async (req: Request, res: Response): Promise<void> => {

    const user_id = (req.params.auth as any).user_id;

    const level_id = req.body.level_id
    const session_id = req.body.session_id
    const time = req.body.time
    const completed = req.body.completed


    if (!level_id) {
        res.status(400).json(
            {
                "message": ERR_MISSING_LEVEL_ID
            }
        )

        return
    }

    if (!session_id) {
        res.status(400).json(
            {
                "message": ERR_MISSING_SESSION_ID
            }
        )

        return
    }

    if (!time) {
        res.status(400).json(
            {
                "message": ERR_MISSING_TIME
            }
        )

        return
    }

    if (completed === undefined) {
        res.status(400).json(
            {
                "message": ERR_MISSING_COMPLETION
            }
        )

        return
    }


    let query = `insert into ${SCORE_TABLE} (level_id,user_id,session_id,time,completed) values (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?),?,?);`
    let values = [level_id, user_id, session_id, time, completed]

    // Declare poolConnection so we can close it in case something goes wrong.
    let poolConnection: PoolConnection | undefined;

    try {
        // Get pool connection from the database and create a user.
        poolConnection = await db.getConnection()
        const [data,] = await poolConnection.query(
            query,
            values
        )



    } catch (error) {
        console.error(error)
        // The user is a duplicated entry, either the email or username is taken.
        if (error?.code == 'ER_DUP_ENTRY') {
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
        message: `Score created!`
    })

    return
}


/**
 * Creates an unverified user, sends an email with a activation token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
export const CreateSession = async (req: Request, res: Response): Promise<void> => {

    const user_id = (req.params.auth as any).user_id;


    const agent = req.headers["user-agent"] ?? ""

    let query = `insert into ${SESSION_TABLE} (user_id,agent) values (UUID_TO_BIN(?), ?);`
    let values = [user_id, agent]

    // Declare poolConnection so we can close it in case something goes wrong.
    let poolConnection: PoolConnection | undefined;

    try {
        // Get pool connection from the database and create a user.
        poolConnection = await db.getConnection()
        await poolConnection.beginTransaction()

        const [data,] = await poolConnection.query(
            query,
            values
        )

        query = `select BIN_TO_UUID(session_id) as session_id from ${SESSION_TABLE} order by start_date DESC limit 1;`

        const [dataTwo,] = await poolConnection.query(
            query,
            values
        )
        
        await poolConnection.commit()

        res.status(201).json(
            dataTwo[0]
        )


        return
    } catch (error) {
        console.error(error)
        // The user is a duplicated entry, either the email or username is taken.
        if (error?.code == 'ER_DUP_ENTRY') {
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

}


/**
 * Creates an unverified user, sends an email with a activation token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}      
 */
 export const UpdateSession = async (req: Request, res: Response): Promise<void> => {

    const user_id = (req.params.auth as any).user_id;

    const session_id = req.params.session_id
    const time_editor = req.body.time_editor
    const time_play = req.body.time_play
    const time_other = req.body.time_other

    if (time_editor === undefined) {
        res.status(400).json(
            {
                message: ERR_MISSING_TIME_EDITOR
            }
        )

        return
    }
    
    if (time_play === undefined) {
        res.status(400).json(
            {
                message: ERR_MISSING_TIME_PLAY
            }
        )

        return
    }

    if (time_other === undefined) {
        res.status(400).json(
            {
                message: ERR_MISSING_TIME_OTHER
            }
        )

        return
    }

    let query = `update ${SESSION_TABLE} set time_editor = ?, time_play = ?, time_other = ? where session_id = UUID_TO_BIN(?) and user_id = UUID_TO_BIN(?);`
    let values = [time_editor, time_play, time_other, session_id, user_id]

    // Declare poolConnection so we can close it in case something goes wrong.
    let poolConnection: PoolConnection | undefined;

    try {
        // Get pool connection from the database and create a user.
        poolConnection = await db.getConnection()
       
        const [data,] = await poolConnection.query(
            query,
            values
        )

        res.status(201).json(
            {
                message: "Updated session!"

            }
        )


        return
    } catch (error) {
        console.error(error)
        // The user is a duplicated entry, either the email or username is taken.
        if (error?.code == 'ER_DUP_ENTRY') {
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

}

