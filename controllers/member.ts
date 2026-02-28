import { Response } from 'express';
import { AuthRequest } from '../Utils/authMiddleware';
import admindb from '../models/clubadmin';
import updatedb from '../models/updates';
import eventsdb from '../models/events';
import taskstatusdb from '../models/task_status';
import feedbackdb from '../models/feedback';

interface UserPayload {
  name: string;
  email: string;
}

export const events = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (req.user) {
    const user = req.user as unknown as UserPayload;
    const { name, email } = user;

    const admin = await admindb.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const { clubId, clubName } = admin;

    const page = Math.max(1, parseInt(req.query.page as string || '1')) || 1;
    const limitPerPage = 5;
    const limit = page * limitPerPage;

    try {
      const query = { clubId: clubId };

      const totalEvents = await eventsdb.countDocuments(query);
      const eventsList = await eventsdb.find(query)
        .sort({ date: 1, time: 1 })
        .limit(limit);

      const totalPages = Math.ceil(totalEvents / limitPerPage);

      return res.json({
        PageTitle: "Events",
        Member_Name: name,
        Club_Name: clubName,
        data: eventsList,
        currentPage: page,
        totalPages,
        totalEvents
      });
    } catch (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized" });
  }
};

export const updates = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    // If you're using session:
    // const session = req.session as unknown as { isLoggedIn?: boolean, user?: any };
    // if (!session?.isLoggedIn || !session?.user) {
    //   return res.status(401).json({ error: "Not authorized" });
    // }
    // As we use JWT in AuthRequest, rely on req.user:
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const user = req.user as unknown as UserPayload;
    const { name, email } = user;
    const admin = await admindb.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Member profile not found" });
    }

    const { clubId, clubName } = admin;
    const page = Math.max(1, parseInt(req.query.page as string || '1')) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const query = {
      clubId: clubId?.toUpperCase(),
      type: { $in: ["club", "public"] },
    };

    const totalUpdates = await updatedb.countDocuments(query);
    const updatesList = await updatedb.find(query)
      .sort({ date: -1, time: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalUpdates / limit);

    return res.json({
      PageTitle: "Updates",
      Member_Name: name,
      Club_Name: clubName,
      data: updatesList,
      currentPage: page,
      totalPages,
      totalUpdates
    });
  } catch (err) {
    console.error("Error fetching updates:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Contact = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (req.user) {
    const user = req.user as unknown as UserPayload;
    const { name, email } = user;
    const admin = await admindb.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Member profile not found" });
    }

    const { clubName, clubId } = admin;

    const leader = await admindb.findOne({ clubId, role: 'leader' });

    return res.json({
      PageTitle: "Contact Leader",
      Member_Name: name,
      Club_Name: clubName,
      leader: leader ? {
        name: leader.name,
        email: leader.email,
        phone: 'Not available' 
      } : null
    });
  } else {
    return res.status(401).json({ error: "Not authorized" });
  }
};

export const Task_Status = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (req.user) {
    const user = req.user as unknown as UserPayload;
    const { name, email } = user;
    const admin = await admindb.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Member profile not found" });
    }

    const { clubId, clubName } = admin;
    const search = (req.query.search as string)?.trim() || "";
    const limit = parseInt(req.query.limit as string || '10') || 10;

    const query: Record<string, unknown> = { assigned_to: name };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    try {
      const allData = await taskstatusdb.find(query).sort({ task_assign_date: -1 });
      const data = allData.slice(0, limit);
      const hasMore = allData.length > limit;

      return res.json({
        PageTitle: "Task Status",
        Member_Name: name,
        Club_Name: clubName,
        data,
        search,
        limit,
        hasMore
      });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized" });
  }
};

export const Task_view_details = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (req.user) {
    const user = req.user as unknown as UserPayload;
    const { name, email } = user;
    const admin = await admindb.findOne({ email });

    if (!admin) return res.status(404).json({ error: "Member profile not found" });

    const { clubName } = admin;
    const { id } = req.params;

    try {
      const task = await taskstatusdb.findById(id);
      if (!task) return res.status(404).json({ error: "Task not found" });

      return res.json({
        PageTitle: "Task Details",
        Member_Name: name,
        Club_Name: clubName,
        task,
      });
    } catch (err) {
      console.error("Error fetching task:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized" });
  }
};

export const getFeedback = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (!req.user) return res.status(401).json({ error: "Not authorized" });

  const user = req.user as unknown as UserPayload;
  const { name, email } = user;
  const admin = await admindb.findOne({ email });
  if (!admin) return res.status(404).json({ error: "Member profile not found" });
  const { clubName } = admin;

  try {
    const prevfeedback = await feedbackdb.find({ email }).sort({ date: -1 });
    return res.json({
      PageTitle: "Feedback",
      Member_Name: name,
      Club_Name: clubName,
      data: prevfeedback
    });
  } catch (err) {
    console.error("Error fetching feedback:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postFeedback = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  if (!req.user) return res.status(401).json({ error: "Not authorized" });

  const { title, description } = req.body;
  const user = req.user as unknown as UserPayload;
  const { name, email } = user;

  const admin = await admindb.findOne({ email });
  if (!admin) return res.status(404).json({ error: "Member profile not found" });
  const { clubId } = admin;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  try {
    const feedback = new feedbackdb({
      title,
      description,
      posted_by: name,
      clubId,
      user_type: "member",
      email,
      date: new Date()
    });
    await feedback.save();
    return res.json({ success: true, message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Error saving feedback:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Feedback = getFeedback;
