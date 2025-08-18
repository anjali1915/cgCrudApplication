const express = require('express');
const cors= require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const userRoutes = require('./Routes/userRoutes');
const port=8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users',userRoutes); //base path



app.listen(port, ()=>{
    console.log("server is running at port number 8080")
}
)
