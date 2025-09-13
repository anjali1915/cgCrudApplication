import express, { Router } from 'express';
const router = express.Router();
import userController from '../Controller/userController.js';
import validateUser from '../middleware/validator.js';
// 
router.post('/saveUser', validateUser, userController.saveUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUser/:id', userController.getUser);
router.delete('/deleteUser/:user_id', userController.deleteUser);
router.put('/updateUser/:user_id', validateUser, userController.updateUser);
export default router;
