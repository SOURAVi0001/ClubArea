import express from 'express';
import path from 'path';
import rootdir from '../Utils/path';
import * as home from '../controllers/home';
const UserRouter = express.Router();
UserRouter.get('/ContactUs', home.contact_us);

import admindb from '../models/clubadmin';
import userdb from '../models/user';
UserRouter.get('/testing_data', async (req: express.Request, res: express.Response) => {
    try {
        // Fetch all users from userdb
        const users = await userdb.find({}).lean();

        // Fetch all admins from admindb
        const admins = await admindb.find({}).lean();

        // Return the datasets as JSON
        res.json({
            users: users,
            admins: admins,
            title: 'Testing Data Interface'
        });
    } catch (error) {
        console.error('Error fetching testing ', error);
        res.status(500).json({
            users: [],
            admins: [],
            error: 'Error loading data',
            title: 'Testing Data Interface'
        });
    }
});


export default UserRouter;