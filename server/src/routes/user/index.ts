import express from 'express';
import { getUsersController, updateUserController } from '../../controlleres/userController';

const router = express.Router();

router.post('/get-users', getUsersController);

router.post('/update-user', updateUserController);

export default router;
