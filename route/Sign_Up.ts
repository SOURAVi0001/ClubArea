import express from 'express';
const UserRouter=express.Router();
import * as home from '../controllers/home';
UserRouter.get('/Sign_Up',home.Sign_Up);
export default UserRouter;