import express from 'express';
const UserRouter = express.Router();
import * as home from '../../controllers/member';
UserRouter.get('/member_feedback', home.getFeedback);
UserRouter.post('/member_feedback', home.postFeedback);
export default UserRouter;
