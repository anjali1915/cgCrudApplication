import crypto from 'crypto';
import dotenv from 'dotenv'

const ALGORITHM = 'aes-256-cbc'; //symmetric cipher block chaining alogorithm

const IV_LENGTH = 16;

//key shared over the network in base64 encrypted form or same key used 
const SECRET_KEY = crypto.createHash("sha256").update(String(process.env.JWT_SECRET_KEY)).digest("base64").substring(0, 32);


//encryption
export const encryptToken = (token:string):string =>{
    //random bytes of 16 size generated
    const IV = crypto.randomBytes(IV_LENGTH); //Initialization vector unique every time for each encryption

    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY),IV); //Secret key in bytes form

    //encrypted token generated
    let encrypted =cipher.update(token,"utf-8","hex");
    encrypted += cipher.final("hex"); //final finishes encryption
//console.log(`${encrypted}:${IV.toString("hex")}`)
    //IV is stored with token for decryption because same IV is needed for decryption purpose
    return `${encrypted}:${IV.toString("hex")}`; //encrypted token and IV 
};

export const decryptToken =(encrypted:string):string =>{
     const [encryptedData, IVHex] = encrypted.split(":"); // ciphertext first, then IV

     
    if (!IVHex || !encryptedData) {
  throw new Error("Invalid encrypted token format");
}


    const IV =Buffer.from(IVHex, "hex"); //IV hex to buffer conversion 

    //decrypts back to utf-8 string
    const decipher = crypto.createDecipheriv(ALGORITHM,Buffer.from(SECRET_KEY),IV);
    let decrypted = decipher.update(encryptedData ,"hex","utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;

};