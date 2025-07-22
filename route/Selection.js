// here we use data-base quieries to redirect 
// the type of user to that specific route!
const path=require('path');
const rootDir=require('../Utils/path')
const express=require('express');
const UserRouter=express.Router();
const Registeration=[];
UserRouter.post('/selection',(req,res)=>{
 console.log(req.url,req.method,req.body);
 Registeration.push({Gmail:req.body.gmail});
 console.log(Registeration);
      res.sendFile(path.join(rootDir,'views','./Selection.html'));
});

exports.Selection=UserRouter;
exports.Registeration=Registeration;