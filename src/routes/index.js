const express = require("express");
const router = express.Router();
const workflowRoutes = require("./v1/workflow.route");

router.use("/api/v1/workflow", workflowRoutes);

module.exports = router;
