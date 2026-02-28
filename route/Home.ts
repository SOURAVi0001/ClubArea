import express from 'express';
const UserRouter = express.Router();
// Set up route to render the index.ejs file
import * as home from '../controllers/home';
UserRouter.get('/', home.home);
export default UserRouter;
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