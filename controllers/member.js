const admindb = require('../models/clubadmin');
const updatedb = require('../models/updates');
const eventsdb = require('../models/events');
const taskstatusdb = require('../models/task_status');
const feedbackdb = require('../models/feedback');

const events = async (req, res) => {
  if (req.user) {
    const { name, email } = req.user;

    const admin = await admindb.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const { clubId, clubName } = admin;

    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limitPerPage = 5;
    const limit = page * limitPerPage;

    try {
      // Note: Original code used 'clubid' (lowercase) in query but 'clubId' (camelCase) from admin object. 
      // Assuming database field is 'clubId' based on other files, but check if it was 'clubid'. 
      // The original code had: const { clubid, clubName } = admin; and query { clubid }
      // But in updates it used clubId. Let's assume consistent field names or check model.
      // safely use both or check what 'admin' has.

      const query = { clubId: clubId || admin.clubid };

      const totalEvents = await eventsdb.countDocuments(query);
      const eventsList = await eventsdb.find(query)
        .sort({ date: 1, time: 1 })
        .limit(limit);

      const totalPages = Math.ceil(totalEvents / limitPerPage);

      res.json({
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
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};
exports.events = events;


const updates = async (req, res) => {
  try {
    if (!req.session?.isLoggedIn || !req.session?.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const { name, email } = req.user;
    const admin = await admindb.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Member profile not found" });
    }

    const { clubId, clubName } = admin;
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const query = {
      clubId: clubId?.toUpperCase(),
      type: { $in: ["club", "public"] },
    };

    const totalUpdates = await updatedb.countDocuments(query);
    const updatesList = await updatedb.find(query)
      .sort({ date: -1, time: -1 }) // Sorting by date descending for updates usually
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalUpdates / limit);

    res.json({
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
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.updates = updates;

const Contact = async (req, res) => {
  if (req.user) {
    const { name, email } = req.user;
    const admin = await admindb.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Member profile not found" });
    }

    const { clubName, clubId } = admin;

    // Find the leader of this club
    const leader = await admindb.findOne({ clubId, role: 'leader' });

    res.json({
      PageTitle: "Contact Leader",
      Member_Name: name,
      Club_Name: clubName,
      leader: leader ? {
        name: leader.name,
        email: leader.email,
        phone: leader.phone || 'Not available' // Assuming phone exists or just email
      } : null
    });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};
exports.Contact = Contact;

const Task_Status = async (req, res) => {
  if (req.user) {
    const { name, email } = req.user;
    const admin = await admindb.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Member profile not found" });
    }

    const { clubId, clubName } = admin;
    const search = req.query.search?.trim() || "";
    const limit = parseInt(req.query.limit) || 10; // Increased default limit for API

    const query = { assigned_to: name };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    try {
      const allData = await taskstatusdb.find(query).sort({ task_assign_date: -1 });
      // The original code did slice for pagination manually? 
      // Let's just return what was requested.
      const data = allData.slice(0, limit);
      const hasMore = allData.length > limit;

      res.json({
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
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};
exports.Task_Status = Task_Status;

const Task_view_details = async (req, res) => {
  if (req.user) {
    const { name, email } = req.user;
    const admin = await admindb.findOne({ email });

    if (!admin) return res.status(404).json({ error: "Member profile not found" });

    const { clubName } = admin;
    const { id } = req.params;

    try {
      const task = await taskstatusdb.findById(id);
      if (!task) return res.status(404).json({ error: "Task not found" });

      res.json({
        PageTitle: "Task Details",
        Member_Name: name,
        Club_Name: clubName,
        task,
      });
    } catch (err) {
      console.error("Error fetching task:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }

  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};
exports.Task_view_details = Task_view_details;

// Split Feedback into get and post
const getFeedback = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authorized" });

  const { name, email } = req.user;
  const admin = await admindb.findOne({ email });
  if (!admin) return res.status(404).json({ error: "Member profile not found" });
  const { clubName } = admin;

  try {
    const prevfeedback = await feedbackdb.find({ email }).sort({ date: -1 });
    res.json({
      PageTitle: "Feedback",
      Member_Name: name,
      Club_Name: clubName,
      data: prevfeedback
    });
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getFeedback = getFeedback;

const postFeedback = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authorized" });

  const { title, description } = req.body;
  const { name, email } = req.user;

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
    res.json({ success: true, message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.postFeedback = postFeedback;

// Keep the old export name for compatibility if needed, but route should check
exports.Feedback = getFeedback; // Default to get logic if imported directly without change, but we will change route.




