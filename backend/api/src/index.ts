import express, { Application } from "express";
import cors from 'cors'
import Router from "./routes";

const PORT = process.env.PORT || 8000;

const app: Application = express();

// Cors Configuration
const allowedOrigins = [ "http://localhost" ]

const corsOptions :  cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(Router)

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
