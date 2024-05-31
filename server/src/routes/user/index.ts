import express from 'express';
import {
  getUsersController,
  getAllUsersController,
  updateprofileController,
  getProfileController,
} from '../../controlleres/userController';

const router = express.Router();

//api/users/get-users
router.get('/get-users', getUsersController);

//api/users/all
router.get('/all', getAllUsersController);

//api/users/profile
router.get('/profile', getProfileController);

//api/users/update-profile
router.put('/update-profile', updateprofileController);

export default router;
