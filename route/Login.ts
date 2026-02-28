import path from 'path';
import rootDir from '../Utils/path';
import express from 'express';
const UserRouter = express.Router();
import * as home from '../controllers/home';
UserRouter.get('/admin_login', home.admin_login);
UserRouter.post('/admin_login_post', home.admin_login_post);
UserRouter.get('/user_login', home.user_login);
UserRouter.post('/user_login_post', home.user_login_post);
UserRouter.get('/login_type', home.Login_Type);
UserRouter.post('/google_login_post', home.google_login_post);
UserRouter.get('/check-session', home.checkSession);

export default UserRouter;          