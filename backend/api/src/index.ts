import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from 'cors'
import morgan from "morgan"
import Router from "./routes";

const PORT = process.env.PORT || 8000;

const app: Application = express();

// Cors Configuration
const corsOptions :  cors.CorsOptions = {
  origin: "https://web.shhootout.tk", 
  allowedHeaders: [ 'Accept-Version', 'Authorization', 'Credentials', 'Content-Type' ]
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))
app.use(Router)

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

// Could use on finished for db middleware