import express from 'express';
const UserRouter=express.Router();
import * as home from '../controllers/home';
UserRouter.get('/clublist',home.clubs);
UserRouter.get('/club/:id',home.getclubdetail);
export default UserRouter;