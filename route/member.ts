import express from 'express';
const UserRouter = express.Router();
import * as home from '../controllers/home';
import authenticateToken from '../Utils/authMiddleware';

// UserRouter.use(authenticateToken);

UserRouter.get('/member_log', authenticateToken, home.member_log);
UserRouter.get('/member', authenticateToken, home.member);

export default UserRouter;

// AI interview code
// 