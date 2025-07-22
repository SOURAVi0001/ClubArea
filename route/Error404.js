const path=require('path');
const rootDir=require('../Utils/path')
const express=require('express');
const UserRouter=express.Router();
UserRouter.use('/',(req,res)=>{
      res.status(404).render('Error/Error404',{PageTitle:"ERROR"});
});
module.exports=UserRouter;