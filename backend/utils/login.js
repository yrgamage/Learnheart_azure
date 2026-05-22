const express = require('express');
const User = require("../models/userModel");
const app = express();
app.use(express.json());

function userExists(username) {
    return User.findOne;
}
function userPasswordMatches(username, password) {
    return User.findOne;
}
exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    } else if (!password) {
        return res.status(400).json({ message: "Password is required" });
    } else if (!(userExists(username))) {
        return res.status(400).json({ message: "Username does not exist" });
    } else if (!(userPasswordMatches(username, password))) {
        return res.status(400).json({ message: "Password does not match" });
    }
    try {
        await User.findOne({ username, password }).then(user => {
            if (user) {
                res.status(200).json({ message: "Login successful" });
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};
