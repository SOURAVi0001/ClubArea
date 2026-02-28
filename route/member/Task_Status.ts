import express from 'express';
const UserRouter=express.Router();
import * as home from '../../controllers/member';  
UserRouter.get('/member_Task_Status', home.Task_Status ); 
UserRouter.get('/View-Details/:id', home.Task_view_details ); 
export default UserRouter;      




