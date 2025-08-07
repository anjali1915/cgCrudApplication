const { Pool } = require('pg');

const pool = new Pool({
    user: 'cguser',
    host: 'localhost',
    password: 'cguser12',
    database: 'userdatabase',
    port: 5432
});

module.exports= pool;

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