import express from 'express';
const UserRouter=express.Router();
import * as home from '../../controllers/leader';
UserRouter.get('/leader/leader-teams',home.teams);
export default UserRouter;