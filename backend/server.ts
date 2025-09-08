import express from "express";
import type { Application } from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import pool from './db.js';
import userRoutes from './Routes/userRoutes.js';

const port=8080;
const app:Application = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users',userRoutes); //base path



app.listen(port, ()=>{
    console.log("server is running at port number 8080")
}
)
