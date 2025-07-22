const express=require('express');
const UserRouter=express.Router();
const home = require('../../controllers/leader');
UserRouter.get('/leader/leader-taskstatus',home.taskstatus);
UserRouter.get('/leader-Create-Task',home.create_task);
UserRouter.post('/leader-Create-Task',home.create_task);
module.exports=UserRouter;