const userServices = require('../Services/userServices');

const userController = {
    //create new user
    saveUser: async (req, res) => {
        const { firstName, lastName, dob, mobileNumber, address } = req.body;
        try {
            await userServices.saveUser(firstName, lastName, dob, mobileNumber, address);
            res.status(200).json({ message: "User added Successfully" });
        } catch (error) {
            console.log("Error in user addition", error)
            res.status(500).json({ message: "Error in user addition", error: error.message });
        }
    },
    //get all users
    getAllUsers: async (req, res) => {
        const {page,limit,sortBy,direction} = req.query;
        try {
            const result = await userServices.getAllUsers(page,limit,sortBy,direction);
            const users = formattedUsers(result.rows);

        res.status(200).json({message:"All data fetched", users: users});
    }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error in user selection", error: error.message });
        }
    },
    //get specific user
    getUser: async (req, res) => {
        const id = req.params.id;
        try {
            const result = await userServices.getUser(id);
            const users = formattedUsers(result.rows);
        res.status(200).json(users[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error in user selection using id", error: error.message })
        }
    },
    //delete data
    deleteUser: async (req, res) => {
        const user_id=req.params.user_id;
        try {
            await userServices.deleteUser(user_id);
            const result = await userServices.getAllUsers();
            const users = formattedUsers(result.rows);
            res.status(200).json({ message: "User deleted successfully", users: users});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "User deleted is failed", error: error.message });
        }
    },
    //update data
    updateUser: async (req, res) => {
        const user_id = req.params.user_id;
        const { firstName, lastName, dob, mobileNumber, address } = req.body;
        try {
            await userServices.updateUser(firstName, lastName, dob, mobileNumber, address, user_id);
            const users = await userServices.getAllUsers();
            res.status(200).json({ message: "User updated successfully", users })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "User updation failed", error: error.message });
        }

    },
    filterUser: async (req,res) => {
        const {search,page,limit,sortBy,direction} = req.query;
        try{
            const result = await userServices.filterUser(search,page,limit,sortBy,direction);
             const users = formattedUsers(result.rows); 
            res.status(200).json({message:"User filterd successfully", users: users})
        } catch(error) {
            console.log(error);
            res.status(400).json({status:false,message:"Some error occured in filter User",error: error.message});
        }
    }
}

//to soive USD to ISD conversion
function formattedUsers(rows){
    if (!rows || rows.length === 0) return [];
    for(const users of rows){
        if(users.dob){
            users.dob = new Date(users.dob).toLocaleDateString("en-CA") ;//returns only local date as a string according to canadian english
           
        } else {
            users.dob = null;
             
        }
        
    }
    return rows;
}

module.exports = userController;