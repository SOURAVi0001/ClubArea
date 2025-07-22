const express=require('express');
const path=require('path');
const rootdir=require('../Utils/path');
const home=require('../controllers/home');
const UserRouter=express.Router();

UserRouter.get('/ContactUs',home.contact_us);

module.exports=UserRouter;