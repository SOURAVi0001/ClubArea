const express = require('express');
const UserRouter = express.Router();
const home = require('../../controllers/member');
UserRouter.get('/member_feedback', home.getFeedback);
UserRouter.post('/member_feedback', home.postFeedback);
module.exports = UserRouter;
