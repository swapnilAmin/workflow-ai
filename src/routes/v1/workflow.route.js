const express = require("express");
const { route } = require("..");
const router = express.Router();

router.post("/schedule/:workflow_id");

module.exports = route;
