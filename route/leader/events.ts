import express from 'express';
const UserRouter=express.Router();
import * as home from '../../controllers/leader';
UserRouter.get('/leader/leader-events', home.events);
UserRouter.get('/leader/events/page', home.paginatedEvents); // 👈 AJAX route
UserRouter.post('/Post_event', home.Post_event);
export default UserRouter;






