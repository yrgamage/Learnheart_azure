const express = require('express');
const User = require("../models/userModel");
const app = express();
app.use(express.json());

function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}

function containsNumbers(str) {
    return /\d/.test(str);
}

function containsLowerCase(str) {
    return /[a-z]/.test(str);
}

function containsUpperCase(str) {
    return /[A-Z]/.test(str);
}

exports.register = async (req, res, next) => {
    const { username, password, repassword } = req.body;
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    } else if (!repassword) {
        return res.status(400).json({ message: "Re-enter the password" });
    } else if (password !== repassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    } else if (password.length < 10) {
        return res.status(400).json({ message: "Password needs to have more than 10 characters" });
    } else if (!containsSpecialChars(password)) {
        return res.status(400).json({ message: "Password needs to have at least one special character" });
    } else if (!containsNumbers(password)) {
        return res.status(400).json({ message: "Password needs to have at least one number" });
    } else if (!containsLowerCase(password)) {
        return res.status(400).json({ message: "Password needs to have at least one lowercase letter" });
    } else if (!containsUpperCase(password)) {
        return res.status(400).json({ message: "Password needs to have at least one uppercase letter" });
    }
    try {
        const user = await User.create({ username, password });
        res.status(200).json({
            message: "User successfully created",
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: "User not successfully created",
            error: err.message,
        });
    }
};
