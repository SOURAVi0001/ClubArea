const path=require('path');
const rootDir=require('../Utils/path')
const express=require('express');
const UserRouter=express.Router();
const home=require('../controllers/home');
UserRouter.get('/admin_login',home.admin_login);
UserRouter.post('/admin_login_post',home.admin_login_post);
UserRouter.get('/user_login',home.user_login);
UserRouter.post('/user_login_post',home.user_login_post);
UserRouter.get('/login_type',home.Login_Type);
UserRouter.get('/check-session', home.checkSession);

module.exports=UserRouter;          