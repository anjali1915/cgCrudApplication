import express, { Router } from 'express';
const router = express.Router();
import userController from '../Controller/userController.js';
import validateUser from '../middleware/validator.js';
import { authenticate } from '../middleware/validator.js';
import { authorize } from '../middleware/validator.js';
// 
router.get('/loginUserCheck', authenticate, authorize, userController.loginUserCheck);
router.post('/logout', userController.logout);
router.post('/loginUser', userController.loginController);
router.post('/saveUser', validateUser, authenticate, authorize, userController.saveUser);
router.get('/getAllUsers', authenticate, authorize, userController.getAllUsers);
router.get('/getUser/:id', authenticate, authorize, userController.getUser);
router.delete('/deleteUser/:user_id', authenticate, authorize, userController.deleteUser);
router.put('/updateUser/:user_id', validateUser, authenticate, authorize, userController.updateUser);
export default router;
