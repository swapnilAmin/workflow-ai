const express = require("express");
const router = express.Router();
const workflowController = require("../../controllers/workflow.controller");

// router.post("/schedule/:workflow_id",);
// router.post("/whatsapp", );

router.get("/wrun/seo", workflowController.processSEOGeneration);

router.post("/", workflowController.createWorkflow);

// Get all
router.get("/", workflowController.getWorkflows);

// Get a single workflow
router.get("/:workflow_id", workflowController.getWorkflow);

// Update a workflow
router.put("/:id", workflowController.updateWorkflow);

// Delete a workflow
router.delete("/:id", workflowController.deleteWorkflow);

router.post("/inputconfig", workflowController.addInputToWorkflow);

// Get a single input Workflow
// router.get("/inputconfig/:input_id", workflowController.getInputFromWorkflow);

// Update a workflow
router.put("/inputconfig/:input_id", workflowController.updateInputInWorkflow);

// Delete a workflow
router.delete(
  "/inputconfig/:input_id",
  workflowController.deleteInputFromWorkflow
);

router.post("/outputconfig", workflowController.addOutputToWorkflow);

// Get a single output Workflow
// router.get("/outputconfig/:input_id", workflowController.getOutputFromWorkflow);

// Update a workflow
router.put(
  "/outputconfig/:input_id",
  workflowController.updateOutputInWorkflow
);

// Delete a workflow
router.delete(
  "/outputconfig/:input_id",
  workflowController.deleteOutputFromWorkflow
);

// Create a new action
router.post("/actions", workflowController.addActionToWorkflow);

// Get all actions
router.get("/actions", async (req, res, next) => {
  try {
    const actions = await workflowService.getActions(req.query);
    res.status(200).json(actions);
  } catch (error) {
    next(error);
  }
});

// Get a single action
router.get("/actions/:id", async (req, res, next) => {
  try {
    const action = await workflowService.getAction({ _id: req.params.id });
    res.status(200).json(action);
  } catch (error) {
    next(error);
  }
});

// Update an action
router.put("/actions/:id", async (req, res, next) => {
  try {
    const action = await workflowService.updateAction(
      { _id: req.params.id },
      req.body
    );
    res.status(200).json(action);
  } catch (error) {
    next(error);
  }
});

// Delete an action
router.delete("/actions/:id", async (req, res, next) => {
  try {
    const action = await workflowService.deleteAction({ _id: req.params.id });
    res.status(200).json(action);
  } catch (error) {
    next(error);
  }
});

// Reorder workflow actions
router.post(
  "/workflows/:workflow_id/actions/:action_id/reorder",
  async (req, res, next) => {
    try {
      const { direction } = req.body;
      const result = await workflowService.reorderWorkflowsAction(
        req.params.workflow_id,
        req.params.action_id,
        direction
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Remove an action from a workflow
router.delete(
  "/workflows/:workflow_id/actions/:action_id",
  async (req, res, next) => {
    try {
      const result = await workflowService.removeWorkflowsAction(
        req.params.workflow_id,
        req.params.action_id
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
