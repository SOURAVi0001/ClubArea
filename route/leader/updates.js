const express=require('express');
const UserRouter=express.Router();
const home = require('../../controllers/leader');
UserRouter.get('/leader/leader-updates',home.updates);
UserRouter.post('/leader/Post_Updates',home.Post_Updates);
UserRouter.get("/leader/updates/page", home.updatesPage);
module.exports=UserRouter;