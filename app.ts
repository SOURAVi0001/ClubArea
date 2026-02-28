import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import mongoDB from './Utils/mongoDB';

const app = express();

// Route imports
import home from './route/Home';
import ContactUs from './route/ContactUs';
import updates from './route/Updates';
import Clubs from './route/Clubs';
import Login from './route/Login';

import member from './route/member';
import memberContact from './route/member/Contact';
import memberevents from './route/member/events';
import memberFeedback from './route/member/Feedback';
import memberTask_Status from './route/member/Task_Status';
import memberupdates from './route/member/updates';

import leader from './route/leader';
import leaderfeedback from './route/leader/feedback';
import leadermembers from './route/leader/members';
import leaderteams from './route/leader/teams';
import leaderupdates from './route/leader/updates';
import leaderevents from './route/leader/events';
import leaderclubsettings from './route/leader/clubsetting';
import leadertaskstatus from './route/leader/chat'; // Assuming 'chat' exports a router
import leadergallery from './route/leader/gallery';
import leaderchat from './route/leader/taskstatus'; // Assuming 'taskstatus' exports a router
import leaderrecuriment from './route/leader/recuriment';
import Interview from './route/Interview';
import Selection from './route/Selection';
import Error404 from './route/Error404';
import Gallery from './route/Gallery';
import Recruitment from './route/Recruitment';
import Sign_Up from './route/Sign_Up';
import VALIDATE from './route/VALIDATE';
import user from './route/user';
import RegistrationRoutes from './route/Registration';

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// View engine configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sample member data
const memberData = {
  name: 'Rahul Sharma',
  tasks: [
    { title: 'Design Poster', status: 'In Progress', deadlineProgress: 70 },
    { title: 'Write Event Description', status: 'Just Started', deadlineProgress: 30 },
    { title: 'Submit Task Report', status: 'Completed', deadlineProgress: 100 }
  ]
};

// Debug middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('--- Request Debug ---');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Content-Length:', req.get('Content-Length'));
    console.log('Body:', req.body);
    console.log('Raw Body Length:', (req as any).rawBody ? (req as any).rawBody.length : 'No raw body');
    next();
  });
}

// Dashboard routes
app.get('/member-dashboard', (req: Request, res: Response) => {
  res.render('member_dashboard', { member: memberData });
});

const dashboardPath = path.join(__dirname, 'views', 'argon-dashboard-tailwind-1.0.1');

// Serve static files (CSS, JS, images)
app.use('/leader-dashboard/assets', express.static(path.join(dashboardPath, 'build/assets')));

// Route to open dashboard
app.get('/leader-dashboard', (req: Request, res: Response) => {
  res.sendFile(path.join(dashboardPath, 'build', 'index.html'));
});

// Route middleware
app.use(home);
app.use(Sign_Up);
app.use(VALIDATE);
app.use(leaderfeedback);
app.use(Gallery);
app.use(ContactUs);
app.use(user);
app.use(Login);
app.use(Clubs);
app.use(Recruitment);
app.use(updates);
app.use(Interview);

app.use(leader);
app.use(leaderfeedback);
app.use(leadermembers);
app.use(leaderteams);
app.use(leadertaskstatus);
app.use(leaderupdates);
app.use(leaderclubsettings);
app.use(leaderchat);
app.use(leadergallery);
app.use(leaderrecuriment);
app.use(leaderevents);

app.use(RegistrationRoutes);
app.use(Selection);

app.use(member);
app.use(memberContact);
app.use(memberevents);
app.use(memberFeedback);
app.use(memberTask_Status);
app.use(memberupdates);

// Static file serving (placed after API routes to prevent directory shadowing)
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/public', express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(Error404);

// Create necessary directories
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}
if (!fs.existsSync('uploads/resumes')) {
  fs.mkdirSync('uploads/resumes', { recursive: true });
}

// Server configuration
const port = process.env.PORT || 3005;

// Database connection with graceful error handling
async function connectToDatabase() {
  try {
    await mongoDB();
    console.log('✅ Database connection successful');
    return true;
  } catch (error: any) {
    console.log('⚠️ Database connection failed:', error.message);
    console.log('🔄 Server will continue without database connection');
    return false;
  }
}

// Start server function
function startServer() {
  app.listen(port, () => {
    console.log(`🚀 Server is live on port ${port}`);
    if (process.env.NODE_ENV === 'production') {
      console.log('🌍 Production mode - Server accessible via Render URL');
    } else {
      console.log(`🔗 Local development - Server accessible at http://localhost:${port}`);
    }
  });
}

// Initialize application
async function initializeApp() {
  console.log('🔄 Starting application...');

  const dbConnected = await connectToDatabase();

  if (dbConnected) {
    console.log('✅ Application started with database connection');
  } else {
    console.log('⚠️ Application started without database connection');
    console.log('💡 Add database environment variables to enable database features');
  }

  startServer();
}

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Attempting to continue in production mode...');
  } else {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Attempting to continue in production mode...');
  } else {
    process.exit(1);
  }
});

// Start the application
initializeApp();
