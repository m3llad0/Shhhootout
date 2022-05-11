import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import PoolConnection from "mysql2/typings/mysql/lib/PoolConnection";
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,

});


// db.getConnection = async () : Promise<mysql.PoolConnection> => {
//   return db.getConnection()
//           .then( (connection) => {
//             console.log("MySql Pool Connection, threadId: " + connection.threadId)
//             return connection
//           } )
//           .catch((reason) => reason)
// }
