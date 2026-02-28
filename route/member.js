const express = require('express');
const UserRouter = express.Router();
const home = require('../controllers/home');
const authenticateToken = require('../Utils/authMiddleware');

// UserRouter.use(authenticateToken);

UserRouter.get('/member_log', authenticateToken, home.member_log);
UserRouter.get('/member', authenticateToken, home.member);

module.exports = UserRouter;

// AI interview code
// 