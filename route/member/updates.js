const express = require('express');
const UserRouter = express.Router();
const home = require('../../controllers/member');

// Use same function for both URLs
UserRouter.get('/member_updates', home.updates);
UserRouter.get('/member/updates/page', home.updates); // ← fixed

module.exports = UserRouter;