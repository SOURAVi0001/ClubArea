const express=require('express');
const UserRouter=express.Router();
const home = require('../controllers/home');
UserRouter.get('/clublist',home.clubs);
UserRouter.get('/club/:id',home.getclubdetail);
module.exports=UserRouter;