import Joi from 'joi';
import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';



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

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(" ")[1]: null;
    if(!token){
        return res.status(401).json({success: false, message: "Missing token"});
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, payload) => {
        if(err){
            return res.status(401).json({status: false, message: "Invalid or expired token"})
        }
        console.log("Decoded payload:", payload);

        (req as any).user = payload;
        console.log("User inside authorize:", (req as any).user);

        next();
    })
}

const authorize = (req: Request, res: Response, next: NextFunction)=>{
    console.log("User inside authorize:", (req as any).user);

    if(!(req as any).user){
        return res.status(401).json({success: false, message: "Not authenticated"})
    }
    if((req as any).user.role !== 'admin'){
        return res.status(403).json({success: false, message: "Acess denied! Admin only"})
    }
    next();
}
export default validator;
export { authenticate };
export {authorize};
