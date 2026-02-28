import express from 'express';
const UserRouter=express.Router();
import * as home from '../controllers/home';

UserRouter.get('/recruitment',home.recruitment);
export default UserRouter;













