import express, { Router } from 'express';
const router: Router = express.Router();

import userController from '../Controller/userController.js';
import validateUser from '../middleware/validator.js';
import { authenticate } from '../middleware/validator.js';
import { authorize } from '../middleware/validator.js'

// 

router.get('/loginUserCheck',authenticate,userController.loginUserCheck);
router.post('/logout',userController.logout);
router.post('/loginUser',userController.loginController);
router.post('/saveUser',validateUser,authenticate,authorize("user:create"),userController.saveUser);
router.get('/getAllUsers',authenticate,authorize("user:read"),userController.getAllUsers);
router.get('/getUser/:id',authenticate,authorize("user:update"),userController.getUser);
router.delete('/deleteUser/:user_id',authenticate,authorize("user:delete"),userController.deleteUser);
router.put('/updateUser/:user_id',validateUser,authenticate,authorize("user:update"),userController.updateUser);


export default router;