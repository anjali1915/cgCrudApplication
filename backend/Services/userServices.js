const pool = require('../db');

const userServices = {
    saveUser: async (firstName, lastNname, dob, mobileNumber, address)=>{
        return await pool.query(
            'INSERT INTO userdetails(first_name, last_name, dob, mobile_number, address) VALUES ($1, $2, $3::date, $4, $5)',
            [firstName, lastNname, dob, mobileNumber, address]
        )
    },
    getAllUsers: async (req,res)=>{
        return await pool.query(
            'SELECT * FROM userdetails'
        )
    },
    getUser: async (id)=>{
        return await pool.query(
            'SELECT * FROM userdetails WHERE user_id=$1 ',
            [id]
        )
    },
    deleteUser: async (id)=>{
        return await pool.query(
            'DELETE FROM userdetails WHERE user_id=$1',
            [id]
        )
    },
    updateUser: async (firstName,lastName,dob,mobileNumber,address,user_id)=>{
        return await pool.query(
            'UPDATE userdetails SET first_name= $1, last_name=$2, dob=$3, mobile_number=$4, address=$5 WHERE user_id=$6',
            [firstName,lastName,dob,mobileNumber,address,user_id]
        )
    }
}

module.exports = userServices;