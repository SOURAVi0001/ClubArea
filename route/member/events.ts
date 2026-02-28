import express from 'express';
const UserRouter=express.Router();
import * as home from '../../controllers/member';
UserRouter.get('/member_events',home.events);
export default UserRouter;









