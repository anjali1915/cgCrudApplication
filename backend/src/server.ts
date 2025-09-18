import express from "express";
import type { Application } from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './Routes/userRoutes.js';
dotenv.config();

const port=process.env.PORT || 8080;
const app:Application = express();

app.use(cors()); //register middleware
app.use(bodyParser.json());

app.use('/api/users',userRoutes); //base path



app.listen(port, ()=>{
    console.log("server is running at port number 8080")
}
)
