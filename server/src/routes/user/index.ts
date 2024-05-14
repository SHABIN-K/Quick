import express from 'express';
import { getUsersController, getAllUsersController, updateUserController } from '../../controlleres/userController';

const router = express.Router();

//api/users/get-users
router.get('/get-users', getUsersController);

//api/users/all
router.get('/all', getAllUsersController);
///

router.post('/update-user', updateUserController);

export default router;
