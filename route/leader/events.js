const express=require('express');
const UserRouter=express.Router();
const home = require('../../controllers/leader');
UserRouter.get('/leader/leader-events', home.events);
UserRouter.get('/leader/events/page', home.paginatedEvents); // 👈 AJAX route
UserRouter.post('/Post_event', home.Post_event);
module.exports=UserRouter;






