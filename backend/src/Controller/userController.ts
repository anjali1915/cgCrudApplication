import type { Request, Response } from "express";
import userServices from "../Services/userServices.js";
import type { User, authUserPayload } from "../types/interfaces.ts";
import { encryptToken } from "../crypto/cryptos.js";

const userController = {
    //create new user
    saveUser: async (req: Request, res: Response) => {
        const firstName = req.body.firstName ? String(req.body.firstName) : "";
        const lastName = req.body.lastName ? String(req.body.lastName) : "";
        const dob = req.body.dob ? String(req.body.dob) : null;
        const mobileNumber = req.body.mobileNumber ? String(req.body.mobileNumber) : ""
        const address = req.body.address ? String(req.body.address) : "";
        
        try {
            const result =await userServices.saveUser(firstName, lastName, dob, mobileNumber, address);
            console.log(result);
            res.status(201).json({success: true,result, message: "User added Successfully" });
        } catch (error) {
            const err = error as Error;
            console.log("Error in user addition", err)
            res.status(500).json({success:false, message: "Error in user addition", error: err.message });
        }
    },


    //get all users
    getAllUsers: async (req: Request, res: Response) => {
        const search = req.query.search ? String(req.query.search) : "";
        const page = req.query.page ? parseInt(String(req.query.page)) : 1;
        const limit = req.query.limit ? parseInt(String(req.query.limit)) : 5;
        const sortBy = req.query.sortBy ? String(req.query.sortBy) : "first_name"
        const direction = req.query.direction ? String(req.query.direction) : "ASC";
        
        try {
            const result = await userServices.getAllUsers(search,page,limit,sortBy,direction);
            const users = formattedUsers(result.rows);
            
        res.status(200).json({success:true ,message:"All data fetched", data:{users: users}});
    }
        catch (error) {
            const err = error as Error;
            console.log(err);
            res.status(500).json({success:false, message: "Error in user selection", error: err.message });
        }
    },


    //get specific user
    getUser: async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const result = await userServices.getUser(id);
            
        res.status(200).json(result.rows[0]);
        } catch (error) {
            const err = error as Error;
            console.log(err);
            res.status(500).json({success:false, message: "Error in user selection using id", error: err.message })
        }
    },


    //delete data
    deleteUser: async (req: Request, res: Response) => {
        const user_id: String|undefined =req.params.user_id;
        try {
            await userServices.deleteUser(user_id);
            const result = await userServices.getAllUsers("", 1, 5, "first_name", "ASC");
            const users = formattedUsers(result.rows);
            res.status(200).json({success:true, message: "User deleted successfully", data: {users: users}});
        } catch (error) {
            const err = error as Error;
            console.log(err);
            res.status(500).json({success:false, message: "User deleted is failed", error: err.message });
        }
    },


    //update data
    updateUser: async (req: Request, res: Response) => {
        const user_id: number |string|undefined= req.params.user_id;
        const firstName = req.body.firstName ? String(req.body.firstName) : "";
        const lastName = req.body.lastName ? String(req.body.lastName) : "";
        const dob = req.body.dob ? String(req.body.dob) : null
        const mobileNumber = req.body.mobileNumber ? String(req.body.mobileNumber) : ""
        const address = req.body.address ? String(req.body.address) : "";
        try {
            await userServices.updateUser(firstName, lastName, dob, mobileNumber, address, user_id);
            const result = await userServices.getAllUsers("", 1, 5, "first_name", "ASC");
            const users = formattedUsers(result.rows );
            res.status(200).json({success:true, message: "User updated successfully", data: {users }})
        } catch (error) {
            const err = error as Error;

            console.log(err);
            res.status(500).json({success:false, message: "User updation failed", error: err.message });
        }

    },
    loginController: async (req: Request, res: Response) =>{
        const userName: string =req.body.userName? String(req.body.userName) : "";
        const password: string =req.body.password ? String(req.body.password) : "";
        try {
            if(userName=="" || password=="")
            return res.status(400).json({success: false, error:"Username and password is required"})
        const user = await userServices.authenticateUser(userName,password);
        if(!user) {
            return res.status(401).json({success: false, error:"No user found, invalid credentials"})//unauthorised
        }
        const token = userServices.generateToken(user);
//console.log(token)
        //encryption of token
        const encryptedtoken = encryptToken(token)
//console.log(encryptedtoken)
        //token send to frontend
        res.cookie("token", encryptedtoken, {
            httpOnly: true, //cannot be accessed by JS
            secure: false,// over HTTPs
            sameSite: "lax",
            maxAge: 15 * 60 *1000 //15 minutes

        });
        //console.log(token)
        return res.status(200).json({success: true, message:"token generated", role: user.role});
        } catch(error){
            const err = error as Error;
            console.log(err);
            res.status(500).json({ success: false, message: "Authentication has error", error: err.message })
        }
        
    },
    logout:async(req: Request, res: Response)=>{
        res.clearCookie("token", {
            httpOnly: false,
            secure: false,
            sameSite: "none"
        })
        res.status(200).json({success:true, message: "User logout successfully"});
    },
    loginUserCheck: (req: Request, res: Response)=>{
        const user = res.locals.user as authUserPayload;
        //console.log(user)

        return res.status(200).json({success:true, message:"authenticated", user: user})

    },
    
}


//to solve USD to ISD conversion
function formattedUsers(rows: User[]): User[] {
    if (!rows || rows.length === 0) return [];
    for(const users of rows){
        if(users.dob){
            users.dob = new Date(users.dob).toLocaleDateString("en-US") ;//returns only local date as a string according to American English
           //MM-DD-YYYY for UI but YYYY-MM-DD for Database
        } else {
            users.dob = null;
             
        }
        
    }
    return rows;
}

export default userController;