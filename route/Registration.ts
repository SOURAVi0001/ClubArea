import express from 'express';
const router = express.Router();

const registrations: any[] = []; // Temporary in-memory storage

// Student registration form
router.get('/register', (req, res) => {
    res.render('registration');
});

// Handle form submission
router.post('/register', (req, res) => {
    const { name, email, rollNo, club, whyJoin } = req.body;
    registrations.push({ name, email, rollNo, club, whyJoin });
    res.redirect('/home');
});

// Leader view
router.get('/leaderDashBoard', (req, res) => {
    res.render('RegistrationFormView', { students: registrations });
});

export default router;