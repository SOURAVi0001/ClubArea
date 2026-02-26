const express = require('express');
const path = require('path');
const rootdir = require('../Utils/path');
const home = require('../controllers/home');
const UserRouter = express.Router();
UserRouter.get('/ContactUs', home.contact_us);

const admindb = require('../models/clubadmin');
const userdb = require('../models/user');
UserRouter.get('/testing_data', async (req, res) => {
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


module.exports = UserRouter;