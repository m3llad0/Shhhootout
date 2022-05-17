import express, { Application } from "express";
import cors from 'cors'
import Router from "./routes";

const PORT = process.env.PORT || 8000;

const app: Application = express();

// Cors Configuration
const allowedOrigins = [ "shouut.io" , "https://planetary-space-627770.postman.co" ] // for now we edit the hosts file to resolve the domain

const corsOptions :  cors.CorsOptions = {
  origin: allowedOrigins,
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(Router)

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
