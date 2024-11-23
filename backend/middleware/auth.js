const User = require("../models/User");

async function isAuthenticated(req, res, next) {
    if (!req.session.email) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ email: req.session.email });
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user; // Attach user to request object
    next();
}

module.exports = isAuthenticated;

