import pool from '../config/db.js';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userServices = {
    saveUser: async (firstName, lastNname, dob, mobileNumber, address) => {
        return await pool.query('INSERT INTO user_details(first_name, last_name, dob, mobile_number, address) VALUES ($1, $2, $3::date, $4, $5)', [firstName, lastNname, dob, mobileNumber, address]);
    },
    getAllUsers: async (search, page, limit, sortBy, direction) => {
        const searchUser = search ? `%${search}%` : `$%%`;
        const offset = (page - 1) * limit;
        const validateSortBy = ["first_name", "last_name", "dob", "mobile_number", "address"];
        if (!validateSortBy.includes(sortBy)) {
            sortBy = "first_name";
        }
        const validateDirection = ["ASC", "DESC"];
        if (!validateDirection.includes(direction)) {
            direction = "ASC";
        }
        let query;
        let params;
        if (search && search.trim() !== '') {
            const searchUser = `%${search}%`;
            query = `SELECT user_id, first_name, last_name, dob, mobile_number, address, count(*) OVER() AS total_count
             FROM user_details WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR dob::TEXT ILIKE $1 OR mobile_number::TEXT 
            ILIKE $1 OR address ILIKE $1 ORDER BY ${sortBy} ${direction} limit $2 offset $3`;
            params = [searchUser, limit, offset];
        }
        else {
            query = `SELECT user_id, first_name, last_name, dob, mobile_number, address, count(*) OVER() AS total_count FROM 
            user_details ORDER BY ${sortBy} ${direction} limit $1 offset $2`;
            params = [limit, offset];
        }
        return await pool.query(query, params);
    },
    getUser: async (id) => {
        return await pool.query('SELECT * FROM user_details WHERE user_id=$1 ', [id]);
    },
    deleteUser: async (id) => {
        return await pool.query('DELETE FROM user_details WHERE user_id=$1', [id]);
    },
    updateUser: async (firstName, lastName, dob, mobileNumber, address, user_id) => {
        return await pool.query('UPDATE user_details SET first_name= $1, last_name=$2, dob=$3, mobile_number=$4, address=$5 WHERE user_id=$6', [firstName, lastName, dob, mobileNumber, address, user_id]);
    },
    authenticateUser: async (userName, password) => {
        const result = await pool.query('SELECT * from admin_users where username = $1', [userName]);
        if (result.rows.length === 0)
            return null;
        const resultData = result.rows[0];
        const ismatch = await bcrypt.compare(password, resultData.password);
        if (!ismatch)
            return null;
        return resultData;
    },
    generateToken: (user) => {
        const payload = { id: user.id, userName: user.userName, role: user.role };
        const secret = process.env.JWT_SECRET_KEY;
        const options = { expiresIn: process.env.JWT_EXPIRES_IN ?? '10m' };
        return jwt.sign(payload, secret, options);
    }
};
export default userServices;
