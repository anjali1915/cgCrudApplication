import type { Request, Response } from "express";
import userServices from "../Services/userServices.js";

interface User{
    user_id: number| string| undefined,
    first_name: string,
    last_name: string,
    dob: string| null,
    mobile_number: string,
    address: String,
}


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
        } catch (error: any) {
            console.log("Error in user addition", error)
            res.status(500).json({success:false, message: "Error in user addition", error: error.message });
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
        catch (error: any) {
            console.log(error);
            res.status(500).json({success:false, message: "Error in user selection", error: error.message });
        }
    },


    //get specific user
    getUser: async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const result = await userServices.getUser(id);
            
        res.status(200).json(result.rows[0]);
        } catch (error: any) {
            console.log(error);
            res.status(500).json({success:false, message: "Error in user selection using id", error: error.message })
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
        } catch (error: any) {
            console.log(error);
            res.status(500).json({success:false, message: "User deleted is failed", error: error.message });
        }
    },


    //update data
    updateUser: async (req: Request, res: Response) => {
        const user_id: number |string|undefined= req.params.user_id="";
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
        } catch (error: any) {
            console.log(error);
            res.status(500).json({success:false, message: "User updation failed", error: error.message });
        }

    }
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