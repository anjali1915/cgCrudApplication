import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './Routes/userRoutes.js';
import cookieParser from "cookie-parser";
dotenv.config();
const port = process.env.PORT || 8080;
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
})); //register middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/users', userRoutes); //base path
app.listen(port, () => {
    // console.log("server is running at port number 8080")
});
