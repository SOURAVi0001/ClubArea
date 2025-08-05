const express=require('express');
const UserRouter=express.Router();
const home=require('../controllers/home');
UserRouter.get('/form',home.form);
UserRouter.post('/submit-application', 
  home.upload.single('resume'),                  
  home.submitApplication
);
// Add this to your route file for testing


module.exports=UserRouter;