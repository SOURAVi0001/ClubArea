const admindb = require('../models/clubadmin');
const updatedb = require('../models/updates');
const eventsdb = require('../models/events');
const taskstatusdb = require('../models/task_status');
const feedbackdb = require('../models/feedback');

const events = async (req, res) => {
  if (req.session.isLoggedIn) {
    const { name, email } = req.session.user;

    const admin = await admindb.findOne({ email });
    if (!admin) {
      console.error("Admin not found for email:", email);
      return res.redirect("./login");
    }

    const { clubid, clubName } = admin;

    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limitPerPage = 5;
    const limit = page * limitPerPage; // Accumulate all events up to current page

    const totalEvents = await eventsdb.countDocuments({ clubid });

    const eventsList = await eventsdb.find({ clubid })
      .sort({ date: 1, time: 1 })
      .limit(limit); // Don't skip, just show all up to the current page

    const totalPages = Math.ceil(totalEvents / limitPerPage);

    res.render("Club_Member/Events", {
      PageTitle: "Events",
      Member_Name: name,
      Club_Name: clubName,
      Curr: "Events",
      data: eventsList,
      currentPage: page,
      totalPages
    });
  } else {
    res.redirect("./login");
  }
};

exports.events = events;


const updates = async (req, res) => {
  try {
    // ✅ Session validation
    if (!req.session?.isLoggedIn || !req.session?.user) {
      return res.redirect("/login");
    }

    // ✅ Destructure safely
    const { name, email } = req.session.user;

    // ✅ Pagination
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // ✅ Find admin details
    const admin = await admindb.findOne({ email });
    console.log("Admin:", admin);

    const { clubId, clubName } = admin;

    // ✅ Fetch both club-specific and public updates
    console.log("Fetching updates for club:", clubId);
    const query = {
      clubId: clubId?.toUpperCase(),
      type: { $in: ["club", "public"] }, // show both types
    };

    const totalUpdates = await updatedb.countDocuments(query);

    const updatesList = await updatedb.find(query)
      .sort({ date : 1 ,time :1}) // newest first
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalUpdates / limit);

    // ✅ Render updates page
    res.render("Club_Member/Updates", {
      PageTitle: "Events",
      Member_Name: name,
      Club_Name: clubName,
      Curr: "Events",
      update: updatesList,
      currentPage: page,
      totalPages,
    });

  } catch (err) {
    console.error("Error fetching updates:", err);
    res.status(500).send("Server Error");
  }
};

exports.updates = updates;

// ✅ Updated: Contact
const Contact = async (req, res) => {
  if (req.session.isLoggedIn) {
    const { name, email } = req.session.user;
    const admin = await admindb.findOne({ email });

    if (!admin) {
      console.error("Admin not found for email:", email);
      return res.redirect("./login");
    }

    const { clubName } = admin;

    res.render("Club_Member/Leader_Contact", {
      PageTitle: "Contact Leader",
      Member_Name: name,
      Club_Name: clubName,
      Curr: "Contact"
    });
  } else {
    res.redirect("./login");
  }
};
exports.Contact = Contact;

// ✅ Updated: Task_Status
const Task_Status = async (req, res) => {
  if (req.session.isLoggedIn) {
    const { name, email } = req.session.user;
    const admin = await admindb.findOne({ email });

    if (!admin) {
      console.error("Admin not found for email:", email);
      return res.redirect("./login");
    }

    const { clubId, clubName } = admin;
    const search = req.query.search?.trim() || "";
    const limit = parseInt(req.query.limit) || 3;

    const query = { assigned_to: name };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { assigned_to: { $regex: search, $options: 'i' } }
      ];
    }

    const allData = await taskstatusdb.find(query).sort({ task_assign_date: -1 });
    const data = allData.slice(0, limit);

    const hasMore = allData.length > limit;

    res.render("Club_Member/Task_Status", {
      PageTitle: "Task Status",
      Member_Name: name,
      Club_Name: clubName,
      Curr: "Task",
      data,
      search,
      limit,
      hasMore
    });
  } else {
    res.redirect("./login");
  }
};

exports.Task_Status = Task_Status;

const Task_view_details = async (req, res) => {
  if (req.session.isLoggedIn) {
    const { name, email } = req.session.user;
    const admin = await admindb.findOne({ email });

    if (!admin) {
      console.error("Admin not found for email:", email);
      return res.redirect("./login");
    }

    const { clubName } = admin;
    const { id } = req.params; // ✅ FIXED: Extract ID from route params

    try {
      const task = await taskstatusdb.findById(id);
      if (!task) return res.status(404).send("Task not found");

      res.render("Club_Member/Task_Details", {
        PageTitle: "Task Details",
        Member_Name: name,
        Club_Name: clubName,
        Curr: "Task",
        task: task,
      });
    } catch (err) {
      console.error("Error fetching task:", err);
      res.status(500).send("Server error");
    }

  } else {
    res.redirect("./login");
  }
};
exports.Task_view_details = Task_view_details;

// ✅ Updated: Feedback
const Feedback = async (req, res) => {
  if (req.session.isLoggedIn) {
      console.log(req.body)

   const title = req.body?.title || '';
const description = req.body?.description || '';

    const { name, email } = req.session.user;

    const admin = await admindb.findOne({ email });

    if (!admin) {
      console.error("Admin not found for email:", email);
      return res.redirect("./login");
    }

    const { clubId, clubName } = admin;

    if (title && description) {
      const feedback = new feedbackdb({
        title:title,
        description:description,
        posted_by: name,
        clubId: clubId,
        user_type: "member",
        email: email,
        date: new Date()
      });

      await feedback.save();
    }
const prevfeedback=await feedbackdb.find({email});
console.log("prevfeedback.  ",prevfeedback);
    res.render("Club_Member/Feedback", {
      PageTitle: "Feedback",
      Member_Name: name,
      Club_Name: clubName,
      Curr: "Feedback",
      prevfeedback
    });
  } 
  else {
    res.redirect("./login");
  }

};
exports.Feedback = Feedback;




