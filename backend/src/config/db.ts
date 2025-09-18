import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();

const pool:Pool = new Pool({
    user: process.env.DATABASE_USER,
    host: 'localhost',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: 5432
});

export default pool;

//  create database userdatabase;
// CREATE DATABASE
//  create user cguser with encrypted password 'cguser12';
// CREATE ROLE
//  GRANT ALL privileges on database userdatabase to cguser;
// GRANT
//  alter database userdatabase owner to cguser;
// ALTER DATABASE
// userdatabase=# grant usage on schema public to cguser;
// GRANT
// userdatabase=# grant create on schema public to cguser;
// GRANT
//  create table user_details(firstName varchar(50) NOT NULL, lastName varchar(50), dateOfBirth DATE, mobileNumber NUMERIC(10,0) UNIQUE NOT NULL PRIMARY KEY, address text);
// CREATE TABLE