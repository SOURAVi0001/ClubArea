import express from 'express';
const UserRouter = express.Router();
import * as home from '../../controllers/member';

// Use same function for both URLs
UserRouter.get('/member_updates', home.updates);
UserRouter.get('/member/updates/page', home.updates); // ← fixed

export default UserRouter;