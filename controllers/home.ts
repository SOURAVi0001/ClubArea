import { Request, Response } from 'express';
import { AuthRequest } from '../Utils/authMiddleware';
import updatesdb from '../models/updates';
import userdb from '../models/user';
import admindb from '../models/clubadmin';
import InterviewApplicationdb from '../models/Application_form';
import Applieddb from '../models/Applied';
import openingdb from '../models/Opening';
import Club from '../models/clubs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

declare module 'express-session' {
  interface SessionData {
    user?: any;
    isLoggedIn?: boolean;
    errors?: any[];
    oldInput?: any;
    applied?: any;
    applicationData?: any;
  }
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const form = async (req: Request, res: Response): Promise<void> => {
  if (!req.session.user || !req.session.user.openingId) {
    res.redirect('/');
    return;
  }
  
  const openingData = await openingdb.findById(req.session.user.openingId);
  if (!openingData) {
    res.redirect('/');
    return;
  }

  const clubName = openingData.clubName;
  const role = openingData.teamName;
  const email = req.session.user.email;
  
  res.render('form_fill/form_fill', {
    clubName,
    role,
    email
  });
};

export const clubs = (req: Request, res: Response): void => {
  Club.find()
    .then(clubs => {
      res.json({
        PageTitle: 'ClubDetails',
        clubs: clubs
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error fetching clubs");
    });
};

export const getclubdetail = (req: Request, res: Response): void => {
  const ClubId = req.params.id;

  Club.findOne({ id: ClubId })
    .then(club => {
      if (!club) {
        res.status(404).send("Club not found");
        return;
      }
      res.json({
        PageTitle: 'ClubDetails',
        club: club
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error fetching club details");
    });
};

export const contact_us = (req: Request, res: Response): void => {
  res.json({ PageTitle: "Contact-Us" });
};

export const home = (req: Request, res: Response): void => {
  res.json({ message: "Welcome to ClubArea API", PageTitle: "ClubArea" });
};

export const leader_log = (req: Request, res: Response): void => {
  req.session.isLoggedIn = true;
  req.session.save(() => {
    res.redirect('/leader');
  });
};

export const leader = (req: Request, res: Response): void => {
  if (req.session.isLoggedIn && req.session.user) {
    res.redirect('/leader/leader-events');
  } else {
    res.redirect("/login");
  }
};

export const admin_login = (req: Request, res: Response): void => {
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

export const user_login = (req: Request, res: Response): void => {
  const errors = req.session.errors || [];
  const oldInput = req.session.oldInput || {};

  req.session.errors = [];
  req.session.oldInput = {};

  res.render('Login/user_login', {
    PageTitle: "User Login",
    errors,
    oldInput
  });
};

export const Sign_Up_Validators = [
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
    .custom((value: string, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
];

export const Sign_Up = [
  (req: Request, res: Response): void => {
    const errors = req.session.errors || [];
    const oldInput = req.session.oldInput || {};

    req.session.errors = [];
    req.session.oldInput = {};

    res.render('Sign_Up/Sign_Up', {
      PageTitle: "Sign Up",
      errors,
      oldInput
    });
  }
];

export const VALIDATE = [
  ...Sign_Up_Validators,
  async (req: Request, res: Response): Promise<Response | void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;
    try {
      const user = new userdb({ name, email, password });
      await user.save();

      const secret = process.env.JWT_SECRET || '';
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name, role: 'user' },
        secret,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: { name: user.name, email: user.email, role: 'user' }
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return res.status(500).json({
        success: false,
        message: errorMsg || "Registration failed"
      });
    }
  }
];

export const member = (req: Request, res: Response): void => {
  if (req.session.isLoggedIn && req.session.user) {
    res.render('Club_Member/member', {
      PageTitle: "Events",
      Member_Name: req.session.user.name,
      Club_Name: req.session.user.clubName,
      Curr: "member"
    });
  } else {
    res.redirect("/login");
  }
};

export const member_log = (req: Request, res: Response): void => {
  req.session.isLoggedIn = true;
  req.session.save(() => {
    res.redirect('/member');
  });
};

export const user_login_post = async (req: Request, res: Response): Promise<Response | void> => {
  const { email, password } = req.body;

  try {
    const user = await userdb.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Use doesn't exist. Please Sign Up first." });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const secret = process.env.JWT_SECRET || '';
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'user' },
      secret,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, role: 'user' }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong. Try again later." });
  }
};

export const admin_login_post = async (req: Request, res: Response): Promise<Response | void> => {
  let email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password;

  try {
    const user = await admindb.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "You are not authorised!" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const secret = process.env.JWT_SECRET || '';
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role, clubName: user.clubName },
      secret,
      { expiresIn: '24h' }
    );

    let redirectUrl = '/admin';
    if (user.role === 'leader') {
      redirectUrl = '/leader';
    } else if (user.role === 'member') {
      redirectUrl = '/member';
    }

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, role: user.role, clubName: user.clubName },
      redirectUrl
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong. Try again later." });
  }
};

export const user = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (!req.user) return res.status(401).json({ error: "Not authorized" });
  
  const userPayload = req.user as any;
  const userEmail = userPayload.email;

  const appliedDocs = await Applieddb.find({ applicantEmail: userEmail });

  const appliedKeysSet = new Set(
    appliedDocs.map(doc =>
      [doc.clubName.trim().toLowerCase(), doc.teamName.trim().toLowerCase()].join('|')
    )
  );

  const allOpenings = await openingdb.find();

  function openingKey(openingDoc: any): string {
    return [
      openingDoc.clubName.trim().toLowerCase(),
      openingDoc.teamName.trim().toLowerCase()
    ].join('|');
  }

  const openingsApplied: any[] = [];
  const openingsNotApplied: any[] = [];

  allOpenings.forEach(openingDoc => {
    if (appliedKeysSet.has(openingKey(openingDoc))) {
      openingsApplied.push(openingDoc);
    } else {
      openingsNotApplied.push(openingDoc);
    }
  });

  const alreadyApplied = await InterviewApplicationdb.find({ applicantEmail: userEmail });
  const username = userPayload.name;

  return res.json({
    PageTitle: "User",
    opening: openingsNotApplied,
    openingsApplied: alreadyApplied,
    email: userEmail,
    username
  });
};

export const updates = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const updatedlist = await updatesdb.find({ type: "public" });
    const clubIds = [...new Set(updatedlist.map(update => update.clubId))];
    const adminData = await admindb.find({ clubId: { $in: clubIds } });

    const clubIdToName: Record<string, string> = {};
    adminData.forEach(admin => {
      if (!clubIdToName[admin.clubId]) {
        clubIdToName[admin.clubId] = admin.clubName;
      }
    });

    const updatesWithClubName = updatedlist.map(update => ({
      ...update.toObject(),
      clubName: clubIdToName[update.clubId] || "Unknown Club"
    }));

    return res.json({
      PageTitle: "Updates",
      updates: updatesWithClubName
    });

  } catch (err) {
    console.error("Error fetching updates with club names:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const checkSession = (req: Request, res: Response): Response | void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.json({ loggedIn: false });
  }

  try {
    const secret = process.env.JWT_SECRET || '';
    const decoded = jwt.verify(token, secret) as any;
    return res.json({
      loggedIn: true,
      user: {
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        clubName: decoded.clubName
      }
    });
  } catch (error: any) {
    console.error('Error verifying token:', error.message);
    return res.json({ loggedIn: false });
  }
};

export const recruitment = async (req: Request, res: Response): Promise<Response | void> => {
  const openings = await openingdb.find();
  return res.json({
    PageTitle: "Recruitment",
    opening: openings
  });
};

export const Login_Type = (req: Request, res: Response): void => {
  res.render('Login_Type/logintype');
};

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

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: fileFilter
});

export const submitApplication = async (req: Request, res: Response): Promise<Response | void> => {
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
      clubName: clubName,
      teamName: TeamName,
      applicantEmail: email
    });

    if (appliedDoc) {
      const applied = new Applieddb({
        jobId: appliedDoc._id,
        clubName: clubName,
        teamName: TeamName,
        applicantEmail: appliedDoc.applicantEmail
      });
      await applied.save();
    }

    if (!clubName || !TeamName) {
      return res.status(400).json({
        success: false,
        message: 'Club Name and Team Name are required.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required.'
      });
    }

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

    await newOpening.save();
    
    try {
      const appliedEntry = new Applieddb({
        jobId: newOpening._id,
        clubName: clubName,
        teamName: TeamName,
        applicantEmail: email
      });
      await appliedEntry.save();
    } catch (appliedErr) {
      console.error('Error saving to Applieddb:', appliedErr);
    }

    if (req.session.applied) {
      delete req.session.applied;
    }

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

  } catch (error: any) {
    if (req.file && req.file.path) {
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

export const storeApplicationData = (req: Request, res: Response): Response | void => {
  try {
    if (!req.session) {
      return res.status(400).json({ success: false, message: 'Session not available' });
    }

    let sessionData;

    if (req.body.applied) {
      sessionData = {
        clubName: req.body.applied.clubName,
        TeamName: req.body.applied.TeamName,
        timestamp: new Date()
      };
      req.session.applied = sessionData;
    } else {
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

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ success: false, message: 'Failed to save session' });
      }
      res.json({ success: true, message: 'Application data stored' });
    });

  } catch (error) {
    console.error('Error storing application ', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserApplications = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.json({ success: false, message: 'Not logged in' });
    }

    const userPayload = req.user as any;
    const userEmail = userPayload.email;

    const applications = await InterviewApplicationdb.find({
      applicantEmail: userEmail
    }).sort({ createdAt: -1 });

    const formattedApplications = applications.map(app => ({
      id: app._id,
      role: (app as any).role || 'Member',
      teamName: app.teamName,
      clubName: app.clubName,
      status: app.status || 'pending',
      appliedDate: app.createdAt,
      reviewedDate: app.reviewedDate,
      applicantName: app.applicantName,
      applicantEmail: app.applicantEmail,
      phone: app.phone
    }));

    return res.json({
      success: true,
      applications: formattedApplications
    });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return res.json({ success: false, message: 'Error fetching applications' });
  }
};

export const google_login_post = async (req: Request, res: Response): Promise<Response | void> => {
  const { token, role } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('No payload in Google token');
    }
    
    const { email, name, picture } = payload;

    let user: any = await admindb.findOne({ email });
    let isUserType = 'admin';

    if (!user) {
      user = await userdb.findOne({ email });
      isUserType = 'user';
    }

    if (!user) {
      user = new userdb({
        name,
        email,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
      });
      await user.save();
      isUserType = 'user';
    }

    const jwtPayload = {
      id: user._id,
      email: user.email,
      name: user.name || name,
      role: isUserType === 'admin' ? user.role : 'user',
      clubName: (user as any).clubName
    };

    const secret = process.env.JWT_SECRET || '';
    const userToken = jwt.sign(
      jwtPayload,
      secret,
      { expiresIn: '24h' }
    );

    let redirectUrl = '/user';
    if (jwtPayload.role === 'leader') redirectUrl = '/leader';
    if (jwtPayload.role === 'member') redirectUrl = '/member';

    return res.json({
      success: true,
      message: "Google Login successful",
      token: userToken,
      user: jwtPayload,
      redirectUrl
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({ success: false, message: "Google Authentication failed" });
  }
};
