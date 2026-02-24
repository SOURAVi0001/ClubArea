const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
// Route imports
const home = require('./route/Home');
const ContactUs = require('./route/ContactUs');
const updates = require('./route/Updates');
const Clubs = require('./route/Clubs');
const Login = require('./route/Login');

const member = require('./route/member');
const memberContact = require('./route/member/Contact');
const memberevents = require('./route/member/events');
const memberFeedback = require('./route/member/Feedback');
const memberTask_Status = require('./route/member/Task_Status');
const memberupdates = require('./route/member/updates');

const leader = require('./route/leader');
const leaderfeedback = require('./route/leader/feedback');
const leadermembers = require('./route/leader/members');
const leaderteams = require('./route/leader/teams');
const leaderupdates = require('./route/leader/updates');
const leaderevents = require('./route/leader/events');
const leaderclubsettings = require('./route/leader/clubsetting');
const leadertaskstatus = require('./route/leader/chat');
const leadergallery = require('./route/leader/gallery');
const leaderchat = require('./route/leader/taskstatus');
const leaderrecuriment = require('./route/leader/recuriment');
const Interview = require('./route/Interview');
const { Selection } = require('./route/Selection');
const Error404 = require('./route/Error404');
const Gallery = require('./route/Gallery');
const Recruitment = require('./route/Recruitment');
const Sign_Up = require('./route/Sign_Up');
const VALIDATE = require('./route/VALIDATE');
const user = require('./route/user');
const RegistrationRoutes = require('./route/Registration');

// Enable CORS
const cors = require('cors');
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
    {
      title: 'Design Poster',
      status: 'In Progress',
      deadlineProgress: 70
    },
    {
      title: 'Write Event Description',
      status: 'Just Started',
      deadlineProgress: 30
    },
    {
      title: 'Submit Task Report',
      status: 'Completed',
      deadlineProgress: 100
    }
  ]
};

// Debug middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('--- Request Debug ---');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Content-Length:', req.get('Content-Length'));
    console.log('Body:', req.body);
    console.log('Raw Body Length:', req.rawBody ? req.rawBody.length : 'No raw body');
    next();
  });
}

// Dashboard routes
app.get('/member-dashboard', (req, res) => {
  res.render('member_dashboard', { member: memberData });
});

const dashboardPath = path.join(__dirname, 'views', 'argon-dashboard-tailwind-1.0.1');

// Serve static files (CSS, JS, images)
app.use('/leader-dashboard/assets', express.static(path.join(dashboardPath, 'build/assets')));

// Route to open dashboard
app.get('/leader-dashboard', (req, res) => {
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
    const mongoDB = require('./Utils/mongoDB');
    await mongoDB();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.log('⚠️ Database connection failed:', error.message);
    console.log('🔄 Server will continue without database connection');
    return false;
  }
}

// Start server function
function startServer() {
  app.listen(port, '0.0.0.0', () => {
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

  // Try to connect to database
  const dbConnected = await connectToDatabase();

  if (dbConnected) {
    console.log('✅ Application started with database connection');
  } else {
    console.log('⚠️ Application started without database connection');
    console.log('💡 Add database environment variables to enable database features');
  }

  // Start the server regardless of database connection status
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
