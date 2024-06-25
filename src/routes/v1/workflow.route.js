const express = require("express");
const router = express.Router();
const workflowController = require("../../controllers/workflow.controller");

// router.post("/schedule/:workflow_id",);
// router.post("/whatsapp", );
router.get("/wrun/seo", workflowController.processSEOGeneration);
module.exports = router;
