const express=require('express');
const path = require('path');

// import dotenv from 'dotenv';
// import cors from 'cors';
// import interviewRoutes from './routes/interviewRoutes.js';
// import connectDB from './config/db.js';

// dotenv.config();

const app=express();

const home=require('./route/Home');
const ContactUs=require('./route/ContactUs');
const updates=require('./route/Updates');
const Clubs=require('./route/Clubs');
const Login=require('./route/Login');



const member = require('./route/member');
const memberContact = require('./route/member/Contact');
const memberevents = require('./route/member/events');
const memberFeedback = require('./route/member/Feedback');
const memberTask_Status = require('./route/member/Task_Status');
const memberupdates = require('./route/member/updates');


const leader=require('./route/leader');
const leaderfeedback=require('./route/leader/feedback');
const leadermembers=require('./route/leader/members');
const leaderteams=require('./route/leader/teams');
const leaderupdates=require('./route/leader/updates');
const leaderevents=require('./route/leader/events');
const leaderclubsettings=require('./route/leader/clubsetting');
const leadertaskstatus=require('./route/leader/chat');
const leadergallery=require('./route/leader/gallery');
const leaderchat=require('./route/leader/taskstatus');
const leaderrecuriment=require('./route/leader/recuriment');
const Interview=require('./route/Interview');
const {Selection}=require('./route/Selection');
const Error404=require('./route/Error404');
const Gallery=require('./route/Gallery');
const Recruitment=require('./route/Recruitment');
const Sign_Up=require('./route/Sign_Up');
const VALIDATE=require('./route/VALIDATE');
const user=require('./route/user');
const RegistrationRoutes = require('./route/Registration');
const db = require('./Utils/database');
const session = require('express-session');

app.use(session({
  secret: 'DUNIYA_SURU_AUR_KATAM_AK_VAHEM_HAI',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Optional: 1-day cookie expiry
  }
}));
db.execute("Select * from clubs").then(([rows,fields]) =>{
 // console.log(rows);
}).catch((error)=>{
  console.log("Error db fetching", error);
});

app.use(express.static(path.join(__dirname, 'frontend')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend'));
app.use('/public', express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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



// Add this middleware AFTER express.json() but BEFORE your routes
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


app.use(Error404);



// app.use('/',(req,res)=>{
//       console.log(req.url,req.method,req.body);
//       res.send(`<h1>Currently working on it!!!!!</h1>`);
      
// });
const fs = require('fs');

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}
if (!fs.existsSync('uploads/resumes')) {
  fs.mkdirSync('uploads/resumes', { recursive: true });
}


const port=3005;

const mongoDB = require('./Utils/mongoDB');

mongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Your server is live on:- http://localhost:${port}`);
  });
});