const express=require('express');
const UserRouter=express.Router();
const home = require('../../controllers/member');  
UserRouter.get('/member_Task_Status', home.Task_Status ); 
UserRouter.get('/View-Details/:id', home.Task_view_details ); 
module.exports=UserRouter;      




