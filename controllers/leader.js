const admindb = require('../models/clubadmin');
const updatedb = require('../models/updates');
const eventsdb = require('../models/events');
const feedbackdb = require('../models/feedback');
const taskstatusdb = require('../models/task_status');

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




