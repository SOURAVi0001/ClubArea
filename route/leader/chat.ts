import express from 'express';
const UserRouter=express.Router();
import * as home from '../../controllers/leader';
UserRouter.get('/leader/leader-chat',home.chat);
export default UserRouter;