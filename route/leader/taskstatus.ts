import express from 'express';
const UserRouter=express.Router();
import * as home from '../../controllers/leader';
UserRouter.get('/leader/leader-taskstatus',home.taskstatus);
UserRouter.get('/leader-Create-Task',home.create_task);
UserRouter.post('/leader-Create-Task',home.create_task);
export default UserRouter;