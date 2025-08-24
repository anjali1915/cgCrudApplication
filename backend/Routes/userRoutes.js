const express = require('express');
const router = express.Router();

const userController = require('../Controller/userController');
const validateUser = require('../middleware/validator');

router.post('/saveUser',validateUser,userController.saveUser);
router.get('/getAllUsers',userController.getAllUsers);
router.get('/getUser/:id',userController.getUser);
router.delete('/deleteUser/:user_id',userController.deleteUser);
router.put('/updateUser/:user_id',validateUser,userController.updateUser);
router.get('/filterUser',userController.filterUser);

module.exports = router;