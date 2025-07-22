const express=require('express');
const UserRouter=express.Router();
const home = require('../../controllers/member');
UserRouter.get('/member_events',home.events);
module.exports=UserRouter;









