const express=require('express');
const path=require('path');
const rootdir=require('../Utils/path.js');
const userrouter=express.Router();
const home=require('../controllers/home');
userrouter.get('/updates',home.updates);
module.exports=userrouter;