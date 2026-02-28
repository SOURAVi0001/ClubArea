import express from 'express';
const UserRouter=express.Router();
import * as home from '../../controllers/member';  
UserRouter.get('/member_leader_contact', home.Contact); 
export default UserRouter;  









