import express from 'express';
const UserRouter=express.Router();
import * as home from '../controllers/home';
UserRouter.post('/VALIDATE',home.VALIDATE);
export default UserRouter;