import Joi from 'joi';
import type { Request, Response, NextFunction } from "express";

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
export default validator
