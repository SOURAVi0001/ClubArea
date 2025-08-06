
const updatesdb = require('../models/updates');
const userdb=require('../models/user');
const admindb=require('../models/clubadmin');
const InterviewApplicationdb = require('../models/Application_form');
// Add this import at the top of controllers/home.js
const InterviewApplication = require('../models/Application_form'); // Adjust path as needed
const Applieddb = require('../models/Applied'); // Adjust path as needed

const opening=require('../models/Opening');
const openingdb=require('../models/Opening');

const { body, validationResult } = require('express-validator');
const form = async (req, res) => {
  const openingData = await openingdb.findById(req.session.user.openingId);
  const clubName = openingData.clubName;
  const role = openingData.teamName;
  const email=req.session.user.email;
  console.log("EMAIL FOR THE USER IN THE SESSION IS ", req.session.user);
  res.render('form_fill/form_fill', {
    clubName,
    role,
    email
  });
};


exports.form=form;
// controllers/clubController.js


// Save or Update Club


// routes/clubRoutes.js or similar


// Render all clubs

// controllers/home.js (or wherever your route handler is)
 const Club = require('../models/clubs');  // Import the Mongoose model

const clubs = (req, res) => {
  Club.find()
    .then(clubs => {
      res.render('clubs/clublist', {
        PageTitle: 'ClubDetails',
        Register: clubs  // You can rename 'Register' to 'clubs' in the template too
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error fetching clubs");
    });
};

exports.clubs = clubs;


const getclubdetail = (req, res) => {

  const ClubId = req.params.id;
  console.log("REQ PARAM ID:", ClubId);

  Club.findOne({ id: ClubId })  // match with custom string id
    .then(club => {
      if (!club) return res.status(404).send("Club not found");
      res.render('clubs/clubdetails', {
        PageTitle: 'ClubDetails',
        club: club
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error fetching club details");
    });
};

exports.getclubdetail = getclubdetail;


const contact_us=(req,res)=>{
      res.render( 'contact-us/contact_us',{PageTitle:"Contact-Us"});
}
exports.contact_us=contact_us;


const home=(req,res) => {
 res.render('home/index',{PageTitle:"ClubAreia"}); // ✅ This tells Express to render index.ejs from views/home
};
exports.home=home;


const leader_log = (req, res) => {
  req.session.isLoggedIn = true;
req.session.save(() => {
    res.redirect('/leader');
});
};
exports.leader_log = leader_log;



const leader = (req, res) => {
  //console.log(req.url, req.method, req.body);
  if (req.session.isLoggedIn) {
    const {name,clubName}=req.session.user;
    console.log(name);
    res.redirect( '/leader/leader-events');
  } else {
    res.redirect("/login");
  }
};
exports.leader = leader;


const admin_login = (req, res) => {
  
  const errors = req.session.errors || [];
  const oldInput = req.session.oldInput || {};

  req.session.errors = [];
  req.session.oldInput = {};
  req.session.isLoggedIn = false;
  req.session.save(() => {
   res.render('Login/admin_login', {
    PageTitle: 'Admin Login',
    errors,
    oldInput
   });
});

 };
exports.admin_login = admin_login;


const user_login = (req, res) => {
  const errors = req.session.errors || [];
  const oldInput = req.session.oldInput || {};

  // Clear the session values after using
  req.session.errors = [];
  req.session.oldInput = {};

  res.render('Login/user_login', {
    PageTitle: "User Login",
    errors,
    oldInput
  });
 };
exports.user_login = user_login;


const Sign_Up_Validators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmpassword')
    .notEmpty().withMessage('Confirm Password is required')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
];


const Sign_Up = [
  (req, res) => {
    console.log(req.body);
    const errors = req.session.errors || [];
    const oldInput = req.session.oldInput || {};

    // Clear session data after rendering once
    req.session.errors = [];
    req.session.oldInput = {};

    res.render('Sign_Up/Sign_Up', {
      PageTitle: "Sign Up",
      errors,
      oldInput
    });
  }
];
exports.Sign_Up = Sign_Up;


const VALIDATE = [
  ...Sign_Up_Validators,
  (req, res) => {
    console.log(req.body);
    console.log("Validator is called");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.errors = errors.array();
      req.session.oldInput = req.body;
      return res.redirect('/Sign_Up');
    }

    const { name, email, password,confirmpassword } = req.body;
    const user = new userdb({ name, email, password });

    console.log(user);

    user.save()
      .then(() => {
        req.session.errors = [];
        req.session.oldInput = {};
        res.redirect('/user_login');
      })
      .catch(err => {
        console.log("Error in saving the user: ", err);
        req.session.errors = [{ msg: err.message }];
        req.session.oldInput = req.body;
        return res.redirect('/Sign_Up');
      });
  }
];
exports.VALIDATE = VALIDATE;


const member =(req,res)=>{
  if(req.session.isLoggedIn){
      res.render('Club_Member/member',{
        PageTitle: "Events",
        Member_Name: req.session.user.name,
        Club_Name: req.session.user.clubName,
        Curr: "member"
      });
  }
  else res.redirect("/login");
};
exports.member=member;


const member_log = (req, res) => {
  req.session.isLoggedIn = true;
  console.log("Req is passed and approved for member !")
req.session.save(() => {
    res.redirect('/member');
});
};
exports.member_log = member_log;


const user_login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userdb.findOne({ email });

    if (!user) {
      req.session.errors = [{ msg: "You don't have an account yet. Please Sign Up first." }];
      req.session.oldInput = req.body;
      return res.redirect('/user_login');
    }

    if (user.password !== password) {
      req.session.errors = [{ msg: "Invalid email or password" }];
      req.session.oldInput = req.body;
      return res.redirect('/user_login');
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.errors = [];
    req.session.oldInput = {};
    return res.redirect('/user');

  } catch (err) {
    console.error("Login error:", err);
    req.session.errors = [{ msg: "Something went wrong. Try again later." }];
    req.session.oldInput = req.body;
    return res.redirect('/user_login');
  }
};
exports.user_login_post = user_login_post;


const admin_login_post = async (req, res) => {
  let email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  try {
    console.log("Attempting login with:", email);
    const user = await admindb.findOne({ email });
    console.log("User found in DB:", user);

    if (!user) {
      req.session.errors = [{ msg: "You are not authorised!" }];
      req.session.oldInput = { email };
      return res.redirect('/admin_login');
    }

    if (user.password !== password) {
      req.session.errors = [{ msg: "Invalid email or password" }];
      req.session.oldInput = { email };
      return res.redirect('/admin_login');
    }

    req.session.isLoggedIn = false;
    req.session.user = user;
    req.session.errors = [];
    req.session.oldInput = {};

  if (user.role === 'leader') {
  req.session.isLoggedIn = false;
  req.session.save(() => {
  return res.redirect('/leader_log');
});
      
    }
  else if (user.role === 'member') {
  req.session.isLoggedIn = false;
  console.log("Req for member")
  req.session.save(() => {
  return res.redirect('/member_log');
});
     
    } 
    else {
      req.session.errors = [{ msg: "Unknown user role" }];
      req.session.oldInput = { email };
      return res.redirect('/admin_login');
    }
  }
   catch (err) {
    console.error("Login error:", err);
    req.session.errors = [{ msg: "Something went wrong. Try again later." }];
    req.session.oldInput = { email };
    return res.redirect('/admin_login');
  }

};
exports.admin_login_post = admin_login_post;


const user =async(req,res)=>{
console.log("user call here with session ",req.url,req.method,req.body,req.session.user);
const userEmail = req.session.user.email;

// Step 1: Get all applied job records by this user
const appliedDocs = await Applieddb.find({ applicantEmail: userEmail });
console.log('appliedDocs:', appliedDocs);

// Step 2: Build Set of composite keys for efficient lookup
const appliedKeysSet = new Set(
  appliedDocs.map(doc =>
    [doc.clubName.trim().toLowerCase(), doc.teamName.trim().toLowerCase()].join('|')
  )
);

const allOpenings = await openingdb.find();

console.log('appliedKeysSet:', Array.from(appliedKeysSet));
console.log('allOpeningsKeys:', allOpenings.map(openingKey));

function openingKey(opening) {
  return [
    opening.clubName.trim().toLowerCase(),
    opening.teamName.trim().toLowerCase()
  ].join('|');
}

console.log('appliedKeysSet:', Array.from(appliedKeysSet));
console.log('allOpeningsKeys:', allOpenings.map(openingKey));

const openingsApplied = [];
const openingsNotApplied = [];

allOpenings.forEach(opening => {
  if (appliedKeysSet.has(openingKey(opening))) {
    openingsApplied.push(opening);
  } 
  else {
    openingsNotApplied.push(opening);
  }
});


console.log("openingsApplied", openingsApplied);
console.log("openingsNotApplied", openingsNotApplied);
const alreadyApplied = await InterviewApplicationdb.find({ applicantEmail: userEmail });
const username=req.session.user.name;
// Step 2: Extract jobIds the user has applied to

// Now you can use openingsApplied and openingsNotApplied in your view or return them

  
      res.render('User/user',{
        opening:openingsNotApplied,
        openingsApplied:alreadyApplied,
        email:userEmail,
        PageTitle:"User",
        username
      });
};
exports.user=user;




const updates = async (req, res) => {
  try {
    // 1. Fetch all updates:
    const updatedlist = await updatesdb.find({type:"public"});

    // 2. Extract unique clubIds from updates
    const clubIds = [...new Set(updatedlist.map(update => update.clubId))];

    // 3. Get admin records for those clubs
    const adminData = await admindb.find({ clubId: { $in: clubIds } });

    // 4. Build a map of clubId -> clubName
    const clubIdToName = {};
    adminData.forEach(admin => {
      if (!clubIdToName[admin.clubId]) {
        clubIdToName[admin.clubId] = admin.clubName;
      }
    });

    // 5. Attach clubName to each update
    const updatesWithClubName = updatedlist.map(update => ({
      ...update.toObject(),
      clubName: clubIdToName[update.clubId] || "Unknown Club"
    }));

    // 6. Render the view
    res.render('updates/update', {
      PageTitle: "Updates",
      updates: updatesWithClubName
    });

  } catch (err) {
    console.error("Error fetching updates with club names:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.updates = updates;

// Add this route to check if user is logged in
// Add to your routes controller
const checkSession = (req, res) => {
  try {
    const isLoggedIn = !!(req.session && req.session.user && req.session.isLoggedIn);
    
    res.json({ 
      loggedIn: isLoggedIn,
      user: isLoggedIn ? {
        name: req.session.user.name,
        email: req.session.user.email,
        role: req.session.user.role
      } : null
    });
  } catch (error) {
    console.error('Error checking session:', error);
    res.json({ loggedIn: false });
  }
};

exports.checkSession = checkSession;


const recruitment =async(req,res)=>{
  const openings=await openingdb.find();
      res.render('Recruitment/recruitment',{
        PageTitle: "Recruitment",
       opening:openings
      });
};
exports.recruitment=recruitment;













const Login_Type =(req,res)=>{
      res.render('Login_Type/logintype');
};
exports.Login_Type=Login_Type;





const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/resumes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Submit application
// Add this at the top of your submitApplication function
const submitApplication = async (req, res) => {
 

  console.log('=== APPLICATION SUBMISSION STARTED ===');
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Request body: for the SUMBIT APPLICATION ', req.session);

  console.log('=== FIELD VALIDATION DEBUG ===');
  console.log('fullName:', req.body.fullName, '| exists:', !!req.body.fullName);
  console.log('email:', req.body.email, '| exists:', !!req.body.email);
  console.log('clubName:', req.body.clubName, '| exists:', !!req.body.clubName);
  console.log('TeamName:', req.body.TeamName, '| exists:', !!req.body.TeamName);
  console.log('motivation:', req.body.motivation, '| exists:', !!req.body.motivation);

  try {
    const {
      fullName,
      email,
      scholarNo,
      phone,
      address,
      clubName,
      TeamName,
      motivation
    } = req.body;

     const appliedDoc = await InterviewApplicationdb.findOne({
  clubName: clubName,          // e.g., "AI Club"
  teamName: TeamName,          // e.g., "Orthoptist Team"
  applicantEmail: email        // e.g., "souravpandr@gmail.com"
});

if (appliedDoc) {
  const applied = new Applieddb({
  jobId: appliedDoc._id,
  clubName: clubName,          // e.g., "AI Club"
  teamName: TeamName, 
  applicantEmail: appliedDoc.applicantEmail
});
await applied.save();
    

}
else {
  console.log("No application found.");
}

    console.log('Extracted form ', {
      fullName, email, scholarNo, phone, address, clubName, TeamName, motivation
    });
    console.log(req.session);
    // Validate required fields
    if (!clubName || !TeamName) {
      return res.status(400).json({
        success: false,
        message: 'Club Name and Team Name are required.'
      });
    }

    // Check if resume file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required.'
      });
    }

    // Create new Opening document with form data
    const newOpening = new InterviewApplicationdb({
      clubName: clubName,
      teamName: TeamName,
      applicantName: fullName,
      applicantEmail: email,
      scholarNo: scholarNo,
      phone: phone,
      address: address,
      motivation: motivation,
      resumeFileName: req.file.originalname,
      resumePath: req.file.path,
      status: 'pending',
      role: 'member',
      createdDate: new Date(),
      updatedAt: new Date()
    });

    console.log('Saving to Opening collection:', newOpening);

    // Save to Opening collection
    await newOpening.save();
try {
  const appliedEntry = new Applieddb({
    jobId: newOpening._id,
    clubName: clubName,
    teamName: TeamName,
    applicantEmail: email
  });
  await appliedEntry.save();
  console.log('Application saved to Applieddb:', appliedEntry._id);
} catch (appliedErr) {
  console.error('Error saving to Applieddb:', appliedErr);
}
    console.log('Data saved successfully to Opening collection:', newOpening._id);

    // Clear session data
    if (req.session.applied) {
      delete req.session.applied;
    }

    // Send success response
    return res.status(201).json({
      success: true,
      message: 'Application data saved to Opening collection successfully.',
      data: {
        id: newOpening._id,
        clubName: newOpening.clubName,
        teamName: newOpening.teamName,
        applicantName: newOpening.applicantName,
        status: newOpening.status
      }
    });

  } catch (error) {
    console.error('=== ERROR IN APPLICATION SUBMISSION ===');
    console.error('Error:', error);

    if (req.file && req.file.path) {
      const fs = require('fs');
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while saving application data.',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.submitApplication = submitApplication;

exports.upload=upload;

// Add to your routes controller

// Store application data in session
const storeApplicationData = (req, res) => {
  try {
    console.log("JJJJJJJJJJJJJJJJ");
    console.log('Received ', req.body);
    
    if (!req.session) {
      return res.status(400).json({ success: false, message: 'Session not available' });
    }
    
    // Handle both data formats - current frontend sends {applied: {clubName, TeamName}}
    let sessionData;
    
    if (req.body.applied) {
      // Current frontend format
      sessionData = {
        clubName: req.body.applied.clubName,
        TeamName: req.body.applied.TeamName, 
        timestamp: new Date()
      };
      
      // Store in session under 'applied' key to match frontend expectation
      req.session.applied = sessionData;
      
    }
    else {
      // Alternative format if you want to use openingId format
      const { openingId, clubId, role, teamName } = req.body;
      sessionData = {
        openingId,
        clubId,
        role,
        teamName,
        timestamp: new Date()
      };
      
      req.session.applicationData = sessionData;
    }
    
    // Force session save
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ success: false, message: 'Failed to save session' });
      }
      
      console.log("Session data stored successfully:");
      console.log(req.session.applied || req.session.applicationData);
      res.json({ success: true, message: 'Application data stored' });
    });
    
  } catch (error) {
    console.error('Error storing application ', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get user applications
const getUserApplications = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.json({ success: false, message: 'Not logged in' });
    }
    
    const userEmail = req.session.user.email;
    
    // Fetch user's applications using correct field name from schema
    const applications = await InterviewApplicationdb.find({ 
      applicantEmail: userEmail  // Changed from 'email' to 'applicantEmail'
    })
    .sort({ createdAt: -1 });
    
    const formattedApplications = applications.map(app => ({
      id: app._id,
      role: app.role || 'Member',
      teamName: app.teamName,
      clubName: app.clubName,
      status: app.status || 'pending',
      appliedDate: app.createdAt,
      reviewedDate: app.reviewedDate,
      applicantName: app.applicantName,
      applicantEmail: app.applicantEmail,
      phone: app.phone
    }));
    
    res.json({
      success: true, 
      applications: formattedApplications 
    });
  }
  catch (error) {
    console.error('Error fetching user applications:', error);
    res.json({ success: false, message: 'Error fetching applications' });
  }
};

exports.storeApplicationData = storeApplicationData;
exports.getUserApplications = getUserApplications;

