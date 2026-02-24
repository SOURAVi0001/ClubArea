const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get token from Authorization header or cookie (if any)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user info to request object
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Verification error:', err.message);
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

module.exports = authenticateToken;
