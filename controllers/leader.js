const admindb = require('../models/clubadmin');
const updatedb = require('../models/updates');
const eventsdb = require('../models/events');
const feedbackdb = require('../models/feedback');
const taskstatusdb = require('../models/task_status');
const Opening = require('../models/Opening');
const InterviewApplication = require('../models/Application_form');
const nodemailer = require('nodemailer');
require('dotenv').config();
// Email configuration


// Get available teams (not roles) from admin database
const getAvailableRoles = async (clubId) => {
    try {
        // Since roles are only 'leader' and 'member', we need to get available teams
        const clubMembers = await admindb.find({ 
            clubId: clubId,
            role: { $in: ['member', 'leader'] } 
        }).distinct('teamName');
        
        const availableTeams = clubMembers
            .filter(teamName => teamName && teamName.trim() !== '')
            .map(teamName => ({
                role: 'member', // All openings are for member positions
                teamName: teamName
            }));

        // Add default teams if none exist
        if (availableTeams.length === 0) {
            return [
                { role: 'member', teamName: 'Technical Team' },
                { role: 'member', teamName: 'Marketing Team' },
                { role: 'member', teamName: 'Events Team' },
                { role: 'member', teamName: 'Content Team' }
            ];
        }

        return availableTeams;
    } catch (error) {
        console.error('Error fetching available teams:', error);
        return [{ role: 'member', teamName: 'General Team' }];
    }
};

// Get leader's openings dashboard
const getOpeningsDashboard = async (req, res) => {
    try {
        // Check if user is logged in and is a leader
        if (!req.session || !req.session.isLoggedIn || !req.session.user) {
            return res.redirect('/login?error=Please log in to continue.');
        }

        const user = req.session.user;
        
        // Only leaders can access this dashboard
        if (user.role !== 'leader') {
            return res.redirect('/login?error=Access denied. Leaders only.');
        }

        const leaderEmail = user.email;
        const clubId = user.clubId;
        const clubName = user.clubName;
        const leaderName = user.name;

        const [activeOpenings, closedOpenings, availableRoles] = await Promise.all([
            Opening.find({ 
                clubId: clubId, 
                status: 'active', 
                createdBy: leaderEmail 
            }).lean(),
            Opening.find({ 
                clubId: clubId, 
                status: 'closed', 
                createdBy: leaderEmail 
            }).lean(),
            getAvailableRoles(clubId)
        ]);

        // Get applicant counts efficiently
        for (let opening of activeOpenings) {
            opening.applicantCount = await InterviewApplication.countDocuments({ 
                openingId: opening._id 
            });
        }

        for (let opening of closedOpenings) {
            opening.applicantCount = await InterviewApplication.countDocuments({ 
                openingId: opening._id 
            });
        }

        res.render('leader/opening', {
            clubInfo: {
                clubId,
                clubName,
                name: leaderName
            },
            activeOpenings,
            closedOpenings,
            availableRoles,
            InterviewApplication
        });
    } catch (error) {
        console.error('Error fetching openings dashboard:', error);
        res.redirect('/login?error=An error occurred. Please try again.');
    }
};

// Create new opening (only for member positions)
const createOpening = async (req, res) => {
    try {
        console.log('=== CREATE OPENING DEBUG ===');
        console.log('req.body:', req.body);
        console.log('req.body type:', typeof req.body);
        console.log('Session user:', req.session?.user);

        // Session validation
        if (!req.session || !req.session.isLoggedIn || !req.session.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Please log in to continue.' 
            });
        }

        const user = req.session.user;
        
        if (user.role !== 'leader') {
            return res.status(403).json({ 
                success: false, 
                message: 'Only leaders can create openings.' 
            });
        }

        // Body validation
        if (!req.body || typeof req.body !== 'object') {
            console.error('Request body is missing or invalid:', req.body);
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid request body. Please check your form submission.' 
            });
        }

        const { role, teamName, description, requirements, maxApplicants } = req.body;
        
        console.log('Extracted fields:', { role, teamName, description, requirements, maxApplicants });

        if (!teamName || !description || !requirements) {
            return res.status(400).json({ 
                success: false, 
                message: 'Team name, description, and requirements are required.' 
            });
        }

        const newOpening = new Opening({
            clubId: user.clubId,
            clubName: user.clubName,
            role: 'member', // Always member for openings
            teamName: teamName.trim(),
            description: description.trim(),
            requirements: requirements.trim(),
            maxApplicants: parseInt(maxApplicants) || 10,
            createdBy: user.email,
            status: 'active',
            createdDate: new Date()
        });

        const savedOpening = await newOpening.save();
        console.log('Opening created successfully:', savedOpening._id);

        res.status(201).json({ 
            success: true, 
            message: 'Opening created successfully', 
            opening: savedOpening 
        });
    } catch (error) {
        console.error('Error creating opening:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating opening: ' + error.message 
        });
    }
};


// Close opening
const closeOpening = async (req, res) => {
    try {
        if (!req.session || !req.session.isLoggedIn || !req.session.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Please log in to continue.' 
            });
        }

        const user = req.session.user;
        
        if (user.role !== 'leader') {
            return res.status(403).json({ 
                success: false, 
                message: 'Only leaders can close openings.' 
            });
        }

        const { openingId } = req.params;
        const leaderEmail = user.email;

        if (!openingId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Opening ID is required.' 
            });
        }

        const opening = await Opening.findOneAndUpdate(
            { 
                _id: openingId, 
                createdBy: leaderEmail,
                status: 'active'
            },
            { 
                status: 'closed', 
                closedDate: new Date() 
            },
            { new: true }
        );

        if (!opening) {
            return res.status(404).json({ 
                success: false, 
                message: 'Opening not found, already closed, or unauthorized' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Opening closed successfully' 
        });
    } catch (error) {
        console.error('Error closing opening:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error closing opening: ' + error.message 
        });
    }
};

// Get applicants for specific opening
const getApplicants = async (req, res) => {
    try {
        if (!req.session || !req.session.isLoggedIn || !req.session.user) {
            return res.redirect('/login?error=Please log in to continue.');
        }

        const user = req.session.user;
        
        if (user.role !== 'leader') {
            return res.redirect('/login?error=Only leaders can view applicants.');
        }

        const { openingId } = req.params;
        const leaderEmail = user.email;

        if (!openingId) {
            return res.redirect('/leader/openings?error=Opening ID is required.');
        }

        // Fetch opening document by id and leader's email (authorization)
        const opening = await Opening.findOne({ 
            _id: openingId, 
            createdBy: leaderEmail 
        });

        if (!opening) {
            return res.redirect('/leader/openings?error=Opening not found or unauthorized.');
        }

        console.log('Opening found:', {
            clubName: opening.clubName,
            teamName: opening.teamName
        });

        // UPDATED: Fetch applicants by matching clubName and teamName instead of openingId
        const applicants = await InterviewApplication.find({ 
            clubName: opening.clubName,
            teamName: opening.teamName
        }).sort({ createdAt: -1 });

        console.log(`Found ${applicants.length} applicants for ${opening.clubName} - ${opening.teamName}`);

        res.render('leader/applicants', { 
            opening, 
            applicants,
            clubInfo: {
                clubId: user.clubId,
                clubName: user.clubName,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Error fetching applicants:', error);
        res.redirect('/leader/openings?error=Unable to fetch applicants.');
    }
};


// Review application (accept/reject)
const reviewApplication = async (req, res) => {
    try {
        if (!req.session || !req.session.isLoggedIn || !req.session.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Please log in to continue.' 
            });
        }

        const user = req.session.user;
        
        if (user.role !== 'leader') {
            return res.status(403).json({ 
                success: false, 
                message: 'Only leaders can review applications.' 
            });
        }

        const { applicantId } = req.params;
        const { decision } = req.body;

        if (!applicantId || !decision) {
            return res.status(400).json({ 
                success: false, 
                message: 'Applicant ID and decision are required.' 
            });
        }

        if (!['accepted', 'rejected'].includes(decision)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Decision must be either "accepted" or "rejected".' 
            });
        }

        const application = await InterviewApplication.findById(applicantId);
        if (!application) {
            return res.status(404).json({ 
                success: false, 
                message: 'Application not found' 
            });
        }

        const opening = await Opening.findById(application.openingId);
        if (!opening || opening.createdBy !== user.email) {
            return res.status(403).json({ 
                success: false, 
                message: 'Unauthorized to review this application' 
            });
        }

        application.status = decision;
        application.reviewedBy = user.email;
        application.reviewedDate = new Date();
        await application.save();
        console.log("decision is updated!");
        if (decision === 'accepted') {
            try {
                await addToAdminDatabase({
                    clubId: user.clubId,
                    clubName: user.clubName,
                    email: application.email,
                    password: '123456',
                    role: 'member', // Always member role for accepted applicants
                    teamName: opening.teamName,
                    name: application.fullName || application.name
                });
                console.log("SAVED TO DB ")
            } catch (adminError) {
                console.error('Error adding to admin database:', adminError);
            }
        }

        try {
            await sendApplicationReviewEmail(application, decision, user.clubName, opening);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        res.json({ 
            success: true, 
            message: `Application ${decision} successfully` 
        });
    } catch (error) {
        console.error('Error reviewing application:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error reviewing application: ' + error.message 
        });
    }
};

// Function to add to admin database (always as member)
const addToAdminDatabase = async (userData) => {
    try {
        const existingUser = await admindb.findOne({ 
            email: userData.email, 
            clubId: userData.clubId 
        });
        
        if (existingUser) {
            console.log('User already exists in admin database:', userData.email);
            return existingUser;
        }

        // Ensure role is always 'member' for new recruits
        const newAdmin = new admindb({
            ...userData
        });
        
        await newAdmin.save();
        console.log('Added to admin database as member:', userData.email);
        return newAdmin;
    } catch (error) {
        console.error('Error adding to admin database:', error);
        throw error;
    }
};

// Send email notification
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendApplicationReviewEmail = async (application, decision, clubName, opening) => {
    try {
        const subject = decision === 'accepted' 
            ? `🎉 Congratulations! You've been accepted to ${clubName}`
            : `Application Update - ${clubName}`;

        const html = decision === 'accepted' 
            ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Dear ${application.fullName || application.name},</h2>
                <p>We're excited to inform you that your application for a <strong>member</strong> position in the <strong>${opening.teamName}</strong> of <strong>${clubName}</strong> has been <strong>accepted</strong>!</p>
                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Role:</strong> Member</p>
                    <p><strong>Team:</strong> ${opening.teamName}</p>
                </div>
                <p>You can now log in to the club portal using your email and the password: <strong>123456</strong></p>
                <p><em>Please change your password after first login.</em></p>
                <p>Welcome to the team!</p>
                <p>Best regards,<br>${clubName} Leadership Team</p>
            </div>`
            : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Dear ${application.fullName || application.name},</h2>
                <p>Thank you for your interest in becoming a member of the <strong>${opening.teamName}</strong> in <strong>${clubName}</strong>.</p>
                <p>After careful consideration, we regret to inform you that we won't be moving forward with your application at this time.</p>
                <p>We encourage you to apply for future openings that match your interests and qualifications.</p>
                <p>Best regards,<br>${clubName} Leadership Team</p>
            </div>`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: application.email,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully to:', application.email);
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
};

exports.reviewApplication = reviewApplication;


exports.getOpeningsDashboard = getOpeningsDashboard;
exports.createOpening = createOpening;
exports.closeOpening = closeOpening;
exports.getApplicants = getApplicants;

const updates = async (req, res) => {
  if (req.session.isLoggedIn) {
    try {
      const totalCount = await updatedb.countDocuments(); // 👈 add this
      const data = await updatedb.find().sort({ date: -1 }).limit(5); // 👈 limit to 5
      const { name, clubName } = req.session.user;

      res.render('leader/Updates', {
        PageTitle: "Updates",
        Leader_Name: name,
        Club_Name: clubName,
        Curr: "Updates",
        data: data,
        totalCount: totalCount // 👈 pass this to EJS
      });
    } catch (err) {
      console.error("Error fetching updates:", err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
};
exports.updates = updates;

const updatesPage = async (req, res) => {
  const skip = parseInt(req.query.skip || 0);
  try {
    const data = await updatedb.find().sort({ date: -1 }).skip(skip).limit(5);
    const total = await updatedb.countDocuments();
    res.json({ updates: data, totalCount: total });
  } catch (err) {
    console.error("Error fetching paginated updates:", err);
    res.status(500).json({ error: "Failed to fetch updates" });
  }
};
exports.updatesPage = updatesPage;


const Post_Updates = (req, res) => {
  if (req.session.isLoggedIn) {
    const { name, clubId, clubName } = req.session.user;
    const { content, postType,title } = req.body;

    // Use the first 10 words of content as a title if title not provided
   
    const update = new updatedb({
      title: title,
      posted_by: name,
      description: content,
      clubId: clubId,
      type: postType, // "club" or "public"
      date: new Date()
    });

    update.save()
      .then(() => {
        res.redirect('/leader/leader-updates'); // or re-render with success message
      })
      .catch(err => {
        console.error("Error saving update:", err);
        res.status(500).send("Internal Server Error");
      });

  } else {
    res.redirect('/login'); // If not logged in
  }
}
exports.Post_Updates = Post_Updates;

const Post_event = (req, res) => {
  if (req.session.isLoggedIn) {
     const { name, clubId, clubName } = req.session.user;
    const { title, date, venue, time } = req.body;
const onlyDate = new Date(date);
onlyDate.setHours(0, 0, 0, 0); // This removes the time part
    // Use the first 10 words of content as a title if title not provided
   
    const event = new eventsdb({
      clubName:clubName,
      posted_by: name,
      clubId: clubId,
      title: title,
      venue: venue,
      date: onlyDate,
      time:time
    });

    event.save()
      .then(() => {
        res.redirect('/leader/leader-events'); // or re-render with success message
      })
      .catch(err => {
        console.error("Error saving events:", err);
        res.status(500).send("Internal Server Error");
      });
  }
  else {
    res.redirect('/login'); // If not logged in
  }

}
exports.Post_event = Post_event;



const events = async (req, res) => {
  if (req.session.isLoggedIn) {
    const totalCount = await eventsdb.countDocuments();
     const data1 = await eventsdb.find().sort({ date: 1, time: 1 });
    const { name, clubName } = req.session.user;
    res.render('leader/Events', {
      PageTitle: "Events",
      Leader_Name: name,
      Club_Name: clubName,
      Curr:"Events",
      data:data1,
      totalCount: totalCount

    });
  } else res.redirect("/login");
};
exports.events = events;

const paginatedEvents = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = 5;

    const events = await eventsdb.find()
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await eventsdb.countDocuments();

    res.json({ events, totalCount });
  } catch (err) {
    console.error("Error fetching paginated events:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.paginatedEvents = paginatedEvents;

const feedback = async (req, res) => {
  if (req.session.isLoggedIn) {
    try {
      const { name, clubName, clubId } = req.session.user;
      const search = req.query.search || '';
      const userType = req.query.userType || '';
      const limit = parseInt(req.query.limit) || 5;

      const filter = { clubId };
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      if (userType && userType !== 'all') {
        filter.user_type = userType;
      }

      const data = await feedbackdb.find(filter).sort({ date: -1 }).limit(limit);

      res.render('leader/Feedback', {
        PageTitle: "Feedback",
        Leader_Name: name,
        Club_Name: clubName,
        Curr: "Feedback",
        data: data,
        search,
        userType,
        limit,
        hasMore: data.length === limit
      });
    } catch (err) {
      console.error("Error fetching feedback:", err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
};
exports.feedback = feedback;


const recuriment = (req, res) => {
  if (req.session.isLoggedIn) {
    const { name, clubName } = req.session.user;
    res.render('leader/Recuriment', {
      PageTitle: "Recruitment",
      Leader_Name: name,
      Club_Name: clubName,
      Curr:"Recuriment"
    });
  } else res.redirect("/login");
};
exports.recuriment = recuriment;

const taskstatus = async (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect("/login");

  const { name, clubName, clubId } = req.session.user;
  const search = req.query.search || '';

  try {
    const filter = { clubId };

    if (search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { assigned_to: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const data = await taskstatusdb.find(filter).sort({ task_assign_date: -1 });

    res.render('leader/Task-Status', {
      PageTitle: "Task Status",
      Leader_Name: name,
      Club_Name: clubName,
      Curr: "Taskstatus",
      data: data,
      search
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Internal Server Error");
  }
};
exports.taskstatus = taskstatus;

const create_task = async (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect("/login");

  const { name, clubName, clubId } = req.session.user;

  // Handle GET request – show the form
  if (req.method === 'GET') {
    const members = await admindb.find({ clubId, role: "member" });
    return res.render('leader/Task-Assign', {
      PageTitle: "Task Assign",
      Leader_Name: name,
      Club_Name: clubName,
      Curr: "Taskstatus",
      member:members
    });
  }

  // Handle POST request – form submission
  const {
    task_title = '',
    task_description = '',
    assigned_to = '',
    task_completion_date = ''
  } = req.body || {};  // safe destructuring

  // Validation: Ensure all fields are provided
  if (!task_title || !task_description || !assigned_to || !task_completion_date) {
    return res.render('leader/Task-Assign', {
      PageTitle: "Task Assign",
      Leader_Name: name,
      Club_Name: clubName,
      Curr: "Taskstatus",
      error: "All fields are required."  // Optional: show message in form
    });
  }

  try {
    const task = new taskstatusdb({
      title: task_title,
      posted_by: name,
      assigned_to,
      description: task_description,
      task_status: 0,
      clubId: clubId,
      task_completion_date,
      task_assign_date: new Date()
    });

    await task.save();
    res.redirect('/leader/leader-taskstatus');
  } catch (err) {
    console.error("Task creation failed:", err);
    res.status(500).send("Internal Server Error");
  }
};
exports.create_task = create_task;



const teams = async (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect("/login");

  const { name, clubName, clubId } = req.session.user;

  try {
    const members = await admindb.find({ clubId, role: "member" });
    const teamMap = {};
    members.forEach(member => {
      const team = member.teamName || "Unassigned";
      if (!teamMap[team]) teamMap[team] = [];
      teamMap[team].push(member);
    });

    const teamStats = Object.entries(teamMap).map(([teamName, members]) => ({
      teamName,
      membercount: members.length
    }));

    res.render("leader/teams", {
      PageTitle: "Teams",
      Leader_Name: name,
      Club_Name: clubName,
      teamStats,
      Curr:"teamsStats"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching team data");
  }
};
exports.teams = teams;

const members = (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect("/login");

  const { name, clubName, clubId } = req.session.user;

  admindb.find({ clubId, role: "member" })
    .then(members => {
      console.log(members);
      res.render('../frontend/leader/members.ejs', {
        PageTitle: "Members",
        Leader_Name: name,
        Club_Name: clubName,
        members:members, // array of member objects passed to EJS,
      Curr:"members"
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error fetching members");
    });
};
exports.members = members;

const chat = (req, res) => {
  if (req.session.isLoggedIn) {
    const { name, clubName } = req.session.user;
    res.render('leader/Chat', {
      PageTitle: "Chat",
      Leader_Name: name,
      Club_Name: clubName,
      Curr:"Chat"
    });
  } else res.redirect("/login");
};
exports.chat = chat;

const clubsettings = (req, res) => {
  if (req.session.isLoggedIn) {
    const { name, clubName } = req.session.user;
    res.render('leader/Club-Settings', {
      PageTitle: "Club Settings",
      Leader_Name: name,
      Club_Name: clubName,
      Curr:"clubsettings"
    });
  } else res.redirect("/login");
};
exports.clubsettings = clubsettings;

const dashboard = (req, res) => {
  if (req.session.isLoggedIn) {
    const { name, clubName } = req.session.user;
    res.render('leader/dashboard', {
      PageTitle: "Leader Dashboard",
      Leader_Name: name,
      Club_Name: clubName,
      Curr:"dashboard"
    });
  } else res.redirect("/login");
};
exports.dashboard = dashboard;




