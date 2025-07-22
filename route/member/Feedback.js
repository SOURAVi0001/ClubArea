const express=require('express');
const UserRouter=express.Router();
const home = require('../../controllers/member');
UserRouter.get('/member_feedback',home.Feedback);
UserRouter.post('/member_feedback',home.Feedback);
module.exports=UserRouter;
