import { Response } from 'express';
import { AuthRequest } from '../Utils/authMiddleware';
import admindb from '../models/clubadmin';
import updatedb from '../models/updates';
import eventsdb from '../models/events';
import feedbackdb from '../models/feedback';
import taskstatusdb from '../models/task_status';
import Opening from '../models/Opening';
import InterviewApplication from '../models/Application_form';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
  name: string;
  email: string;
  role: string;
  clubId: string;
  clubName: string;
}

interface TeamRole {
  role: string;
  teamName: string;
}

// Get available teams (not roles) from admin database
const getAvailableRoles = async (clubId: string): Promise<TeamRole[]> => {
  try {
    const clubMembers = await admindb.find({
      clubId: clubId,
      role: { $in: ['member', 'leader'] }
    }).distinct('teamName');

    const availableTeams = clubMembers
      .filter((teamName: string) => teamName && teamName.trim() !== '')
      .map((teamName: string) => ({
        role: 'member',
        teamName: teamName
      }));

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

export const getOpeningsDashboard = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Please log in to continue" });
    }

    const user = req.user as unknown as UserPayload;

    if (user.role !== 'leader') {
      return res.status(403).json({ error: "Access denied. Leaders only." });
    }

    const leaderEmail = user.email;
    const clubId = user.clubId;
    const clubName = user.clubName;
    const leaderName = user.name;

    const [activeOpenings, closedOpenings, availableRoles] = await Promise.all([
      Opening.find({ clubId, status: 'active', createdBy: leaderEmail }).lean(),
      Opening.find({ clubId, status: 'closed', createdBy: leaderEmail }).lean(),
      getAvailableRoles(clubId)
    ]);

    for (const opening of activeOpenings) {
      (opening as any).applicantCount = await InterviewApplication.countDocuments({
        openingId: opening._id
      });
    }

    for (const opening of closedOpenings) {
      (opening as any).applicantCount = await InterviewApplication.countDocuments({
        openingId: opening._id
      });
    }

    return res.json({
      clubInfo: { clubId, clubName, name: leaderName },
      activeOpenings,
      closedOpenings,
      availableRoles,
      Club_Name: clubName,
      Leader_Name: leaderName
    });
  } catch (error) {
    console.error('Error fetching openings dashboard:', error);
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
};

export const createOpening = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Please log in to continue.' });
    }

    const { role, teamName, description, requirements, maxApplicants } = req.body;
    const user = req.user as unknown as UserPayload;

    if (user.role !== 'leader') {
      return res.status(403).json({ error: 'Only leaders can create openings.' });
    }

    if (!role || !teamName || !description || !requirements) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newOpening = new Opening({
      clubId: user.clubId,
      clubName: user.clubName,
      role,
      teamName,
      description,
      requirements,
      maxApplicants: maxApplicants || 10,
      status: 'active',
      createdBy: user.email,
      createdDate: new Date()
    });

    await newOpening.save();

    return res.status(201).json({
      success: true,
      headers: { ...req.headers },
      message: 'Opening created successfully.',
      opening: newOpening
    });
  } catch (error) {
    console.error('Error creating opening:', error);
    return res.status(500).json({ error: 'Unable to create opening.' });
  }
};

export const closeOpening = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Please log in to continue.' });
    
    const { openingId } = req.body;
    const user = req.user as unknown as UserPayload;

    if (user.role !== 'leader') return res.status(403).json({ error: 'Only leaders can close openings.' });
    if (!openingId) return res.status(400).json({ error: 'Opening ID is required.' });

    const opening = await Opening.findOne({ _id: openingId, createdBy: user.email });
    if (!opening) return res.status(404).json({ error: 'Opening not found or unauthorized.' });

    opening.status = 'closed';
    opening.closedDate = new Date();
    await opening.save();

    return res.json({ success: true, message: 'Opening closed successfully.', openingId: opening._id });
  } catch (error) {
    console.error('Error closing opening:', error);
    return res.status(500).json({ error: 'Unable to close opening.' });
  }
};

export const getApplicants = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Please log in to continue.' });
    const user = req.user as unknown as UserPayload;
    if (user.role !== 'leader') return res.status(403).json({ error: 'Only leaders can view applicants.' });

    const { openingId } = req.params;
    const leaderEmail = user.email;

    if (!openingId) return res.status(400).json({ error: 'Opening ID is required.' });

    const opening = await Opening.findOne({ _id: openingId, createdBy: leaderEmail });
    if (!opening) return res.status(404).json({ error: 'Opening not found or unauthorized.' });

    const applicants = await InterviewApplication.find({
      clubName: opening.clubName,
      teamName: opening.teamName
    }).sort({ createdAt: -1 });

    return res.json({
      opening,
      applicants,
      clubInfo: { clubId: user.clubId, clubName: user.clubName, name: user.name }
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return res.status(500).json({ error: 'Unable to fetch applicants.' });
  }
};

const addToAdminDatabase = async (userData: Record<string, string>) => {
  try {
    const existingUser = await admindb.findOne({ email: userData.email, clubId: userData.clubId });
    if (existingUser) return existingUser;

    const newAdmin = new admindb({ ...userData });
    await newAdmin.save();
    return newAdmin;
  } catch (error) {
    console.error('Error adding to admin database:', error);
    throw error;
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER || '', pass: process.env.EMAIL_PASS || '' }
});

const sendApplicationReviewEmail = async (application: any, decision: string, clubName: string, opening: any) => {
  try {
    const name = application.fullName || application.applicantName || application.name;
    const subject = decision === 'accepted'
      ? `🎉 Congratulations! You've been accepted to ${clubName}`
      : `Application Update - ${clubName}`;

    const html = decision === 'accepted'
      ? `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Dear ${name},</h2>
            <p>We're excited to inform you that your application for a <strong>member</strong> position in the <strong>${opening.teamName}</strong> of <strong>${clubName}</strong> has been <strong>accepted</strong>!</p>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Role:</strong> Member</p>
                <p><strong>Team:</strong> ${opening.teamName}</p>
            </div>
            <p>You can now log in to the club portal using your email and the password: <strong>123456</strong></p>
            <p>Welcome to the team!</p>
            <p>Best regards,<br>${clubName} Leadership Team</p>
        </div>`
      : `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Dear ${name},</h2>
            <p>Thank you for your interest in becoming a member of the <strong>${opening.teamName}</strong> in <strong>${clubName}</strong>.</p>
            <p>After careful consideration, we regret to inform you that we won't be moving forward with your application at this time.</p>
            <p>Best regards,<br>${clubName} Leadership Team</p>
        </div>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.email || application.applicantEmail,
      subject: subject,
      html: html
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

export const reviewApplication = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Please log in to continue.' });
    const user = req.user as unknown as UserPayload;
    if (user.role !== 'leader') return res.status(403).json({ success: false, message: 'Only leaders can review applications.' });

    const { applicantId } = req.params;
    const { decision } = req.body;

    if (!applicantId || !decision) return res.status(400).json({ success: false, message: 'Applicant ID and decision are required.' });
    if (!['accepted', 'rejected'].includes(decision)) return res.status(400).json({ success: false, message: 'Decision must be either "accepted" or "rejected".' });

    const application = await InterviewApplication.findById(applicantId);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const opening = await Opening.findById(application.openingId);
    if (!opening || opening.createdBy !== user.email) return res.status(403).json({ success: false, message: 'Unauthorized to review this application' });

    application.status = decision;
    application.reviewedBy = user.email;
    application.reviewedDate = new Date();
    await application.save();

    if (decision === 'accepted') {
      try {
        await addToAdminDatabase({
          clubId: user.clubId,
          clubName: user.clubName,
          email: application.applicantEmail || "",
          password: '123456',
          role: 'member',
          teamName: opening.teamName,
          name: application.applicantName || ""
        });
      } catch (adminError) {
        console.error('Error adding to admin database:', adminError);
      }
    }

    try {
      await sendApplicationReviewEmail(application, decision, user.clubName, opening);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    return res.json({ success: true, message: `Application ${decision} successfully` });
  } catch (error) {
    console.error('Error reviewing application:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ success: false, message: 'Error reviewing application: ' + msg });
  }
};

export const updates = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (req.user) {
    try {
      const user = req.user as unknown as UserPayload;
      const totalCount = await updatedb.countDocuments();
      const data = await updatedb.find().sort({ date: -1 }).limit(5);
      
      return res.json({
        PageTitle: "Updates",
        Leader_Name: user.name,
        Club_Name: user.clubName,
        data: data,
        totalCount: totalCount
      });
    } catch (err) {
      console.error("Error fetching updates:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else return res.status(401).json({ error: "Not authorized" });
};

export const updatesPage = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const skip = parseInt((req.query.skip as string) || '0');
  try {
    const data = await updatedb.find().sort({ date: -1 }).skip(skip).limit(5);
    const total = await updatedb.countDocuments();
    return res.json({ updates: data, totalCount: total });
  } catch (err) {
    console.error("Error fetching paginated updates:", err);
    return res.status(500).json({ error: "Failed to fetch updates" });
  }
};

export const Post_Updates = (req: AuthRequest, res: Response): void => {
  if (req.user) {
    const user = req.user as unknown as UserPayload;
    const { content, postType, title } = req.body;

    const update = new updatedb({
      title: title,
      posted_by: user.name,
      description: content,
      clubId: user.clubId,
      type: postType,
      date: new Date()
    });

    update.save()
      .then(() => res.json({ success: true, message: "Update posted successfully" }))
      .catch(err => {
        console.error("Error saving update:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

export const Post_event = (req: AuthRequest, res: Response): void => {
  if (req.user) {
    const user = req.user as unknown as UserPayload;
    const { title, date, venue, time } = req.body;
    const onlyDate = new Date(date);
    onlyDate.setHours(0, 0, 0, 0);

    const event = new eventsdb({
      clubName: user.clubName,
      posted_by: user.name,
      clubId: user.clubId,
      title: title,
      venue: venue,
      date: onlyDate,
      time: time
    });

    event.save()
      .then(() => res.json({ success: true, message: "Event posted successfully" }))
      .catch(err => {
        console.error("Error saving events:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

export const events = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (req.user) {
    try {
      const user = req.user as unknown as UserPayload;
      const totalCount = await eventsdb.countDocuments();
      const data1 = await eventsdb.find().sort({ date: 1, time: 1 });
      return res.json({
        PageTitle: "Events",
        Leader_Name: user.name,
        Club_Name: user.clubName,
        data: data1,
        totalCount: totalCount
      });
    } catch (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else return res.status(401).json({ error: "Not authorized" });
};

export const paginatedEvents = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = 5;

    const eventsList = await eventsdb.find()
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await eventsdb.countDocuments();

    return res.json({ events: eventsList, totalCount });
  } catch (err) {
    console.error("Error fetching paginated events:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const feedback = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (req.user) {
    try {
      const user = req.user as unknown as UserPayload;
      const { name, clubName, clubId } = user;
      const search = (req.query.search as string) || '';
      const userType = (req.query.userType as string) || '';
      const limit = parseInt(req.query.limit as string) || 5;

      const filter: Record<string, unknown> = { clubId };
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

      return res.json({
        PageTitle: "Feedback",
        Leader_Name: name,
        Club_Name: clubName,
        data: data,
        search,
        userType,
        limit,
        hasMore: data.length === limit
      });
    } catch (err) {
      console.error("Error fetching feedback:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized" });
  }
};

export const recuriment = (req: AuthRequest, res: Response): void => {
  if (req.user) {
    const user = req.user as unknown as UserPayload;
    res.json({
      PageTitle: "Recruitment",
      Leader_Name: user.name,
      Club_Name: user.clubName,
    });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

export const taskstatus = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (!req.user) return res.status(401).json({ error: "Not authorized" });

  const user = req.user as unknown as UserPayload;
  const { name, clubName, clubId } = user;
  const search = (req.query.search as string) || '';

  try {
    const filter: Record<string, unknown> = { clubId };

    if (search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { assigned_to: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const data = await taskstatusdb.find(filter).sort({ task_assign_date: -1 });

    return res.json({
      PageTitle: "Task Status",
      Leader_Name: name,
      Club_Name: clubName,
      data: data,
      search
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const create_task = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (!req.user) return res.status(401).json({ error: "Not authorized" });

  const user = req.user as unknown as UserPayload;
  const { name, clubName, clubId } = user;

  if (req.method === 'GET') {
    const membersList = await admindb.find({ clubId, role: "member" });
    return res.json({
      PageTitle: "Task Assign",
      Leader_Name: name,
      Club_Name: clubName,
      members: membersList
    });
  }

  const {
    task_title = '',
    task_description = '',
    assigned_to = '',
    task_completion_date = ''
  } = req.body || {};

  if (!task_title || !task_description || !assigned_to || !task_completion_date) {
    return res.status(400).json({ error: "All fields are required." });
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
    return res.json({ success: true, message: "Task created successfully" });
  } catch (err) {
    console.error("Task creation failed:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const teams = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (!req.user) return res.status(401).json({ error: "Not authorized" });

  const user = req.user as unknown as UserPayload;

  try {
    const membersList = await admindb.find({ clubId: user.clubId, role: "member" });
    const teamMap: Record<string, any[]> = {};
    
    membersList.forEach(member => {
      const team = (member as any).teamName || "Unassigned";
      if (!teamMap[team]) teamMap[team] = [];
      teamMap[team].push(member);
    });

    const teamStats = Object.entries(teamMap).map(([teamName, m]) => ({
      teamName,
      membercount: m.length,
      members: m
    }));

    return res.json({
      PageTitle: "Teams",
      Leader_Name: user.name,
      Club_Name: user.clubName,
      teamStats
    });
  } catch (err) {
    console.error("Error fetching teams:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const members = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: "Not authorized" });
    return;
  }

  const user = req.user as unknown as UserPayload;

  admindb.find({ clubId: user.clubId, role: "member" })
    .then(membersList => {
      res.json({
        PageTitle: "Members",
        Leader_Name: user.name,
        Club_Name: user.clubName,
        members: membersList
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

export const chat = (req: AuthRequest, res: Response): void => {
  if (req.user) {
    const user = req.user as unknown as UserPayload;
    res.json({
      PageTitle: "Chat",
      Leader_Name: user.name,
      Club_Name: user.clubName,
    });
  } else res.status(401).json({ error: "Not authorized" });
};

export const clubsettings = (req: AuthRequest, res: Response): void => {
  if (req.user) {
    const user = req.user as unknown as UserPayload;
    res.json({
      PageTitle: "Club Settings",
      Leader_Name: user.name,
      Club_Name: user.clubName,
    });
  } else res.status(401).json({ error: "Not authorized" });
};

export const dashboard = (req: AuthRequest, res: Response): void => {
  if (req.user) {
    const user = req.user as unknown as UserPayload;
    res.json({
      PageTitle: "Leader Dashboard",
      Leader_Name: user.name,
      Club_Name: user.clubName,
      email: user.email,
      user: req.user
    });
  } else res.status(401).json({ error: "Not authorized" });
};
