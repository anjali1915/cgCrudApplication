import Joi from 'joi';
import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import type { authUser, authUserPayload } from "../types/interfaces.ts"
import { decryptToken } from '../crypto/cryptos.js';
import userServices from '../Services/userServices.js'


const userSchema = Joi.object({
    firstName : Joi.string().min(3).max(10).required().pattern(/[a-zA-Z]+$/).messages({'string.pattern.base':'First Name should be text only'}),
    lastName: Joi.string().min(3).max(10).required().pattern(/[a-zA-Z]+$/).messages({'string.pattern.base':'First Name should be text only'}),
    dob: Joi.date().required().less('now').messages({'date.less':'Date of birth cannot be in the future'}),
    mobileNumber: Joi.string().length(10).required().pattern(/^[6-9]\d{9}$/).messages({'string.pattern.base': 'Mobile number must be start with 6, 7,and 9 or of 10 numbers'}),
    address: Joi.string().required(),
});

const validator = (req: Request, res: Response, next: NextFunction) =>{
    const {error} = userSchema.validate(req.body, { abortEarly: false});

    if(error){
        return res.status(400).json({ success:false, message: "validation failed", error: error.message});
    }
    next();
}

const authenticate =(req: Request, res: Response, next: NextFunction)=>{

   
    const token = req.cookies? req.cookies.token : undefined;
    //console.log(token)
    if(!token){
        return res.status(401).json({success: false, message: "Missing token"});
    }
    try{
        //console.log(token,"decrypt")
        //decryption of token 
        const decryptedToken = decryptToken(token)
        //console.log("decrypted token",decryptedToken)
            const payload = jwt.verify(decryptedToken, process.env.JWT_SECRET_KEY as string) as authUser;
            //console.log("Decoded payload:", payload);
        res.locals.user = { id: payload.id, role: payload.role } as authUserPayload;
        const user = res.locals.user as authUserPayload;
//console.log(user.id, user.role);

        //console.log("User inside authorize:", user);
        next();
    } catch(error){
        const err = error as Error;
        return res.status(401).json({status: false, message: "Invalid or expired token", error: err.message})
    }
}

const authorize = (permission: string)=>{
    return async (req: Request, res: Response, next: NextFunction) =>{
         const user = res.locals.user as authUserPayload;
         //console.log(user)
         if(!user){
        return res.status(401).json({success: false, message: "Not authenticated"})
         }
         const result = await userServices.authorizeUser(user.id, permission);
         //console.log(result)
         if(!result){
        return res.status(403).json({success: false, message: "Forbidden ! Not allowed"})
    }
    next();
    }
    }

    //console.log("User inside authorize:", user);

export default validator;
export { authenticate };
export {authorize};
