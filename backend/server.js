const express = require('express');
const cors= require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const port=8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/api/users', async (req,res)=>{
    const{fname, lname, dob, mnumber, address} = req.body;
    try{
        await pool.query(
            'INSERT INTO user_details (firstName, lastName, dateOfBirth, mobileNumber, address) VALUES ($1, $2, $3, $4, $5)',
            [fname, lname, dob, mnumber, address]
        );
        res.status(200).send("User added successfully")
    } catch(error) {
        res.status(500).json(error.message);
    }
})

app.get('/api/users', async (req,res)=>{
    
    try{
        const result = await pool.query('SELECT * from user_details');
        res.json(result.rows);
    } catch(error){
        res.status(500).json(error.message);
    }
})

app.get(`/api/users/:mobile`, async (req,res) =>{
    const mobile = req.params.mobile;
    try{
        const result = await pool.query('SELECT * from user_details WHERE mobileNumber = $1',[mobile])
        res.json(result.rows[0])
    } catch(error){
        res.status(500).json(error.message);
    }

})

app.delete('/api/users/:mobile', async (req, res)=>{
    const mobile = req.params.mobile;
    try{
        await pool.query('DELETE FROM user_details where mobileNumber = $1',[mobile]);
        
        res.json({message: "User deleted successfully"});
    } catch(error){
        res.status(500).json(error.message);
    }
       
})

app.put("/api/users/:mobile", async (req, res) =>{
    const {fname, lname, dob, address} = req.body;
    const mobile = req.params.mobile;

    try{
        await pool.query('UPDATE user_details SET firstname=$1, lastname=$2, dateofbirth=$3, address=$4 WHERE mobilenumber=$5',
            [fname, lname, dob, address, mobile]
        );
        res.json({message:"data updated successfully"});
    } catch(error){
        res.status(500).json(error.message);
    }
});

app.listen(port, ()=>{
    console.log("server is running at port number 3000")
}
)
