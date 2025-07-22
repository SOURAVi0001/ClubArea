const express=require('express');
const UserRouter=express.Router();
const home=require('../controllers/home');

UserRouter.get('/member_log',home.member_log);
UserRouter.get('/member',home.member);

module.exports=UserRouter;

// AI interview code
// 