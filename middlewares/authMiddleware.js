const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model.js");

module.exports.isAuth = async(req, res, next) => {
    const token = req.cookies?.auth_token || req.header("Authorization")?.replace("Bearer ", "");

    console.log("TOKEN=",token);

    if (!token) return res.status(401).json({ message: "Unauthorized" });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("DECODED=",decoded);
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
