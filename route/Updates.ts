import express from 'express';
import path from 'path';
import rootdir from '../Utils/path.js';
const userrouter=express.Router();
import * as home from '../controllers/home';
userrouter.get('/updates',home.updates);
export default userrouter;