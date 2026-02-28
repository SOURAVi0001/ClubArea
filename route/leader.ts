import path from 'path';
import rootDir from '../Utils/path';
import express from 'express';
const UserRouter = express.Router();
import * as home from '../controllers/home';
import authenticateToken from '../Utils/authMiddleware';

// UserRouter.use(authenticateToken);

UserRouter.get('/leader_log', authenticateToken, home.leader_log);
UserRouter.get('/leader', authenticateToken, home.leader);

export default UserRouter;