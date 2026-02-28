import express from 'express';
const UserRouter=express.Router();
import * as home from '../controllers/home';
UserRouter.get('/form',home.form);
UserRouter.post('/submit-application', 
  home.upload.single('resume'),                  
  home.submitApplication
);
// Add this to your route file for testing


export default UserRouter;