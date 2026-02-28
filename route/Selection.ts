// here we use data-base quieries to redirect 
// the type of user to that specific route!
import path from 'path';
import rootDir from '../Utils/path';
import express from 'express';
const UserRouter=express.Router();
const Registeration: any[] = [];
UserRouter.post('/selection',(req,res)=>{
 console.log(req.url,req.method,req.body);
 Registeration.push({Gmail:req.body.gmail});
 console.log(Registeration);
      res.sendFile(path.join(rootDir,'views','./Selection.html'));
});

export { Registeration, UserRouter as Selection };
export default UserRouter;