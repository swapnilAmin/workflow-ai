const { StatusCodes } = require("http-status-codes");
const processSEOWorkflow = require("../services/seo.workflow.service");
const { processWhatsAppMessage } = require("../services/workflow.service");
const WorkflowService = require("../services/workflow.service");
const workflowService = new WorkflowService();

const processWhatsappMessages = async (req, res) => {
  try {
    const message = req.body.Body;
    const from = req.body.From;

    const user = {
      mobile_no: from.replace("whatsapp:", ""),
    };

    await processWhatsAppMessage({ body: message }, user);

    res.send("<Response></Response>");
  } catch (error) {}
};

const processSEOGeneration = async (req, res) => {
  try {
    const { keyword } = req.body;

    const seoResult = await processSEOWorkflow(keyword);
    return res.status(StatusCodes.OK).json({
      status: "Completed",
      success: true,
      input: keyword,
      output: seoResult,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const createWorkflow = async (req, res) => {
  try {
    const data = req.body;
    const workflow = await workflowService.createWorkflow(data);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "successfully created workflow",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};
const getWorkflow = async (req, res) => {
  try {
    const { workflow_id } = req.params;
    const workflow = await workflowService.getWorkflow({ workflow_id });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "successfully retrieved workflow",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const getWorkflows = async (req, res) => {
  try {
    const workflow = await workflowService.getWorkflows({});

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "successfully retrieved workflows",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const updateWorkflow = async (req, res) => {
  try {
    const { workflow_id } = req.body;
    const data = req.body;
    const workflow = await workflowService.updateWorkflow(
      { workflow_id },
      data
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "successfully updated workflows",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const deleteWorkflow = async (req, res) => {
  try {
    const { workflow_id } = req.body;

    const workflow = await workflowService.deleteWorkflow({ workflow_id });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "successfully deleted workflows",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const addInputToWorkflow = async (req, res) => {
  try {
    const data = req.body;
    const { workflow_id } = req.params;

    const workflow = await workflowService.addInputToWorkflow(
      workflow_id,
      data
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully Input Added to workflows",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const updateInputInWorkflow = async (req, res) => {
  try {
    const newData = req.body;
    const { workflow_id, input_id } = req.params;

    const workflow = await workflowService.updateInputInWorkflow(
      workflow_id,
      input_id,
      newData
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully Input Updated in workflow",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const deleteInputFromWorkflow = async (req, res) => {
  try {
    const { workflow_id, input_id } = req.params;

    const workflow = await workflowService.deleteInputFromWorkflow(
      workflow_id,
      input_id
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully Input Deleted From Workflow",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const addOutputToWorkflow = async (req, res) => {
  try {
    const data = req.body;
    const { workflow_id } = req.params;

    const workflow = await workflowService.addOutputToWorkflow(
      workflow_id,
      data
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully Output Added to workflows",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const updateOutputInWorkflow = async (req, res) => {
  try {
    const newData = req.body;
    const { workflow_id, output_id } = req.params;

    const workflow = await workflowService.updateOutputInWorkflow(
      workflow_id,
      output_id,
      newData
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully output Updated in workflow",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const deleteOutputFromWorkflow = async (req, res) => {
  try {
    const { workflow_id, output_id } = req.params;

    const workflow = await workflowService.deleteOutputFromWorkflow(
      workflow_id,
      output_id
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully output Deleted From Workflow",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const addActionToWorkflow = async (req, res) => {
  try {
    const { workflow_id } = req.params;
    const data = req.body;

    const workflow = await workflowService.createAction(
      workflow_id,
      data.index_of_action,
      data.action
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully Action added to Workflow",
      data: workflow,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

module.exports = {
  processSEOGeneration,
  createWorkflow,
  getWorkflow,
  getWorkflows,
  addInputToWorkflow,
  updateWorkflow,
  deleteWorkflow,
  updateInputInWorkflow,
  deleteInputFromWorkflow,
  addOutputToWorkflow,
  updateOutputInWorkflow,
  deleteOutputFromWorkflow,
  addActionToWorkflow,
};
