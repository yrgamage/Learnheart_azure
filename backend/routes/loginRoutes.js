const express = require("express");
const router = express.Router();
const { login } = require("../utils/login");
router.route("/login").post(login);
module.exports = login;
