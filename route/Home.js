const express = require('express');
const UserRouter = express.Router();
// Set up route to render the index.ejs file
const home=require('../controllers/home');
UserRouter.get('/', home.home);
module.exports = UserRouter;
//
//
//
//
//n --> s
//e --> w
//
// 
// 
//