
const express=require('express');
const UserRouter=express.Router();
UserRouter.get('/gallery',(req,res)=>{
      res.render('Gallery/gallery');
});

module.exports=UserRouter;