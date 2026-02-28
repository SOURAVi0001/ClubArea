import express from 'express';
const UserRouter = express.Router();
import * as home from '../controllers/home';
import InterviewApplicationdb from '../models/Application_form';
import authenticateToken from '../Utils/authMiddleware';

// UserRouter.use(authenticateToken); // Removed global middleware to prevent leakage

UserRouter.get('/user', authenticateToken, home.user);
UserRouter.post('/store-application-data', authenticateToken, home.storeApplicationData);
UserRouter.get('/user-applications', authenticateToken, home.getUserApplications);
UserRouter.get('/store-application-data1', authenticateToken, (req, res) => {
  if (!req.session) {
    return res.status(500).json({
      success: false,
      message: 'Session not configured'
    });
  }
  try {
    res.render("form_fill/form_fill", {
      clubName: req.session.applied.clubName,
      TeamName: req.session.applied.TeamName,
      email: req.session.user.email
    });
  }
  catch (error) {
    console.error('Error storing application ', error,);
    res.status(500).json({ success: false, message: 'Failed to store data' });
  }

});
UserRouter.get('/user-applied-roles', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    // Use session user email instead of userId since your schema doesn't have userId
    const userEmail = req.session?.user?.email;

    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Get just the club and team names for filtering using correct field name
    const appliedRoles = await InterviewApplicationdb.find(
      { applicantEmail: userEmail },  // Use applicantEmail from your schema
      { clubName: 1, teamName: 1 }
    );

    // Create array of applied role keys
    const roleKeys = appliedRoles.map(app => {
      return `${app.clubName}-${app.teamName}`;
    });

    res.json({
      success: true,
      appliedRoles: roleKeys
    });

  } catch (error) {
    console.error('Error fetching applied roles:', error);
    res.status(500).json({ success: false, message: 'Error fetching applied roles' });
  }
});
export default UserRouter;











