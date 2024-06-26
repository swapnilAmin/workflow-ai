var randomstring = require("randomstring");
const WorkflowRepository = require("../repository/workflow.repository");
const ActionsRepository = require("../repository/actions.repository");
const AppErrors = require("../utils/error-handling");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

class WorkflowService {
  constructor() {
    this.workflowRepo = new WorkflowRepository();
    this.actionsRepo = new ActionsRepository();
  }

  async createWorkflow(data) {
    try {
      data.workflow_id = "wkf_" + randomstring.generate(14);
      const workflow = await this.workflowRepo.create(data);
      return workflow;
    } catch (error) {
      if (
        error?.name == "ValidationError" ||
        error?.name == "MongoServerError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getWorkflows(filter) {
    try {
      const workflows = await this.workflowRepo.getAll(filter);
      return workflows;
    } catch (error) {
      if (
        error?.name == "DatabaseError" ||
        error?.name == "NotFoundError" ||
        error?.name == "CastError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getWorkflow(filter) {
    try {
      const workflow = await this.workflowRepo.getByFilter(filter);
      return workflow;
    } catch (error) {
      if (
        error?.name == "DatabaseError" ||
        error?.name == "NotFoundError" ||
        error?.name == "CastError" ||
        error?.name == "NotFoundError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async updateWorkflow(filter, data) {
    var session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      const workflow = await this.workflowRepo.update(filter, data, session);

      await session.commitTransaction();
      return workflow;
    } catch (error) {
      await session.abortTransaction();
      if (
        error?.name == "DatabaseError" ||
        error?.name == "NotFoundError" ||
        error?.name == "CastError" ||
        error?.name == "NotFoundError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } finally {
      session.endSession();
    }
  }
  async deleteWorkflow(filter) {
    var session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      const workflow = await this.workflowRepo.delete(filter, session);

      await session.commitTransaction();
      return workflow;
    } catch (error) {
      await session.abortTransaction();
      if (
        error?.name == "DatabaseError" ||
        error?.name == "NotFoundError" ||
        error?.name == "CastError" ||
        error?.name == "NotFoundError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } finally {
      session.endSession();
    }
  }

  async createAction(data) {
    try {
      data.action_id = "acp_" + randomstring.generate(14);
      const action = await this.actionsRepo.create(data);
      return action;
    } catch (error) {
      if (
        error?.name == "ValidationError" ||
        error?.name == "MongoServerError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getActions(filter) {
    try {
      const actions = await this.actionsRepo.getAll(filter);
      return actions;
    } catch (error) {
      if (
        error?.name == "DatabaseError" ||
        error?.name == "NotFoundError" ||
        error?.name == "CastError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAction(filter) {
    try {
      const action = await this.actionsRepo.getByFilter(filter);
      return action;
    } catch (error) {
      if (
        error?.name == "DatabaseError" ||
        error?.name == "NotFoundError" ||
        error?.name == "CastError" ||
        error?.name == "NotFoundError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async updateAction(filter, data) {
    var session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      const action = await this.actionsRepo.update(filter, data, session);

      await session.commitTransaction();
      return action;
    } catch (error) {
      await session.abortTransaction();
      if (
        error?.name == "DatabaseError" ||
        error?.name == "NotFoundError" ||
        error?.name == "CastError" ||
        error?.name == "NotFoundError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } finally {
      session.endSession();
    }
  }
  async deleteAction(filter) {
    var session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const deletedAction = await this.actionsRepo.delete(filter, session);

      await session.commitTransaction();
      return deletedAction;
    } catch (error) {
      await session.abortTransaction();
      if (
        error?.name == "DatabaseError" ||
        error?.name == "NotFoundError" ||
        error?.name == "CastError" ||
        error?.name == "NotFoundError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } finally {
      session.endSession();
    }
  }

  async reorderWorkflowsAction(workflow_id, action_id, direction) {
    try {
      const workflow = await this.workflowRepo.getByFilter({ workflow_id });

      if (!workflow) {
        throw new AppErrors(
          "NotFoundError",
          "Workflow not found",
          "The specified workflow does not exist",
          StatusCodes.NOT_FOUND
        );
      }

      const index = workflow?.actions?.indexOf(action_id);

      if (index === -1) {
        throw new AppErrors(
          "ValidationError",
          "Action ID not found",
          "The specified action ID does not exist in the workflow",
          StatusCodes.BAD_REQUEST
        );
      }

      let newIndex;
      if (direction === "up") {
        newIndex = index - 1;
      } else if (direction === "down") {
        newIndex = index + 1;
      } else {
        throw new AppErrors(
          "ValidationError",
          "Invalid direction",
          'The direction must be either "up" or "down"',
          StatusCodes.BAD_REQUEST
        );
      }

      if (newIndex < 0 || newIndex >= workflow?.actions?.length) {
        throw new AppErrors(
          "ValidationError",
          "Invalid move",
          "The action cannot be moved in the specified direction",
          StatusCodes.BAD_REQUEST
        );
      }
      const temp = workflow.actions_id[index];
      workflow.actions[index] = workflow.actions[newIndex];
      workflow.actions[newIndex] = temp;

      const updateWorkflow = await this.updateWorkflow(
        { workflow_id },
        {
          actions: workflow.actions,
        }
      );

      return updateWorkflow;
    } catch (error) {
      if (
        error?.name == "DatabaseError" ||
        error?.name == "NotFoundError" ||
        error?.name == "CastError" ||
        error?.name == "NotFoundError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async removeWorkflowsAction(workflow_id, action_id) {
    try {
      const workflow = await this.workflowRepo.getByFilter({ workflow_id });

      if (!workflow) {
        throw new AppErrors(
          "NotFoundError",
          "Workflow not found",
          "The specified workflow does not exist",
          StatusCodes.NOT_FOUND
        );
      }

      const index = workflow.actions.indexOf(action_id);

      if (index === -1) {
        throw new AppErrors(
          "ValidationError",
          "Action ID not found",
          "The specified action ID does not exist in the workflow",
          StatusCodes.BAD_REQUEST
        );
      }

      const newActions = workflow.actions.splice(index, 1);

      const updateWorkflow = await this.updateWorkflow(
        { workflow_id },
        {
          actions: newActions,
        }
      );
      const deletedAction = await this.deleteAction({ action_id });
      return { updateWorkflow, deletedAction };
    } catch (error) {
      if (
        error?.name == "DatabaseError" ||
        error?.name == "NotFoundError" ||
        error?.name == "CastError" ||
        error?.name == "NotFoundError"
      ) {
        throw error;
      }
      throw new AppErrors(
        "ServerError",
        "Internal Server Error",
        "Something Went Wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = WorkflowService;
