const express  = require('express');
const multer   = require('multer');          // for file uploads
const Event    = require('../../models/Event-gallery');
const router   = express.Router();

// ─── Storage (example: store locally) ──────────────────────────────
const upload = multer({ dest: 'uploads/' , limits:{ files:5 } });

// Middleware to ensure leader is logged in
function isLeader(req, res, next){
  if (req.session?.user?.clubId) return next();
  res.status(401).send('Unauthorized');
}

// POST  /leader/events  – create event
router.post('/leader/events_gallery', isLeader, upload.array('photos',5), async (req,res)=>{
  try{
    const { title, date, time, venue, description } = req.body;
    if (!title || !date || !time) return res.status(400).send('Missing required fields');

    // map uploaded files → URLs (replace with Cloud storage in prod)
    const photoUrls = req.files.map(f => `/uploads/${f.filename}`);

    await Event.create({
      title, date, time, venue, description,
      photos: photoUrls,
      clubId:   req.session.user.clubId,
      clubName: req.session.user.clubName
    });

    res.redirect('/leader/manage-events');
  }catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// GET /leader/events/page?skip=0 – paginated fetch
router.get('/leader/events/page', isLeader, async (req,res)=>{
  const skip  = Number(req.query.skip) || 0;
  const limit = 5;
console.log()
  const [ totalCount, events ] = await Promise.all([
    Event.countDocuments({ clubId: req.session.user.clubId }),
    Event.find({ clubId: req.session.user.clubId })
         .sort({ date:1, time:1 })
         .skip(skip).limit(limit).lean()
  ]);

  res.json({ events, totalCount });
});

router.get('/leader/manage-events', async (req, res) => {
  if (!req.session?.user) {
    return res.redirect('/login');
  }

  try {
      console.log("req.session.user.clubId ::::::::", req.session.user.clubId);
    // pull events that belong to THIS club
    const events_gallery = await Event.find({ clubId: req.session.user.clubId })
                              .sort({ date: 1, time: 1 })
                              .lean();
      console.log("events_gallery    :-",events_gallery);
      console.log("Events    :-", Event);
    res.render('leader/manage-events', {
      events:events_gallery,                       // array of event docs
      Leader_Name : req.session.user.name,
      Club_Name : req.session.user.clubName
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
