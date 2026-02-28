import express from 'express';
const UserRouter=express.Router();
import * as home from '../../controllers/leader';
UserRouter.get('/leader/leader-updates',home.updates);
UserRouter.post('/leader/Post_Updates',home.Post_Updates);
UserRouter.get("/leader/updates/page", home.updatesPage);
export default UserRouter;