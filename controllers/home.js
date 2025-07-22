const register = require('../models/clubs');
const updatesdb = require('../models/updates');
const userdb=require('../models/user');
const admindb=require('../models/clubadmin');
const { body, validationResult } = require('express-validator');

const clubs = (req, res) => {
  register.fetchAll().then(([rows,fields]) => {
      res.render("clubs/clublist",{
            PageTitle: 'ClubDetails',
            Register: rows
      })
  })
 };
exports.clubs=clubs;


const getclubdetail = (req, res) => {
  const ClubId = req.params.id;

  register.findById(ClubId).then(([club, fields]) => {
    if (!club || club.length === 0) {
      return res.status(404).send("Club not found");
    }

    res.render('clubs/clubdetails', {
      PageTitle: 'ClubDetails',
      club: club[0]  // if result is an array
    });
  }).catch(err => {
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
    res.render( 'leader/dashboard', { PageTitle: "Leader Dashboard" ,Leader_Name:name,Club_Name:clubName } );
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
        res.render('Login/user_login');
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


const user =(req,res)=>{
 console.log(req.url,req.method,req.body);
      res.render('User/user');
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


const recruitment =(req,res)=>{
      res.render('Recruitment/recruitment');
};
exports.recruitment=recruitment;


const interview =(req,res)=>{
      res.render('AI_INTERVIEW/dashboard');
};
exports.interview=interview;


const Login_Type =(req,res)=>{
      res.render('Login_Type/logintype');
};
exports.Login_Type=Login_Type;