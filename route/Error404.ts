import path from 'path';
import rootDir from '../Utils/path';
import express from 'express';
const UserRouter=express.Router();
UserRouter.use('/',(req,res)=>{
      res.status(404).render('Error/Error404',{PageTitle:"ERROR"});
});
export default UserRouter;