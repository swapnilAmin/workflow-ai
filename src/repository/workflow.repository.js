const Workflow = require("../models/workflow.model");
const AppErrors = require("../utils/error-handling");
const { StatusCodes } = require("http-status-codes");

class WorkflowRepository {
  async create(data) {
    try {
      const workflow = await Workflow.create(data);
      return workflow;
    } catch (error) {
      if (error?.code == 11000) {
        throw new AppErrors(
          "MongoServerError",
          "Duplicate key error",
          `workflow with given field(${Object.keys(
            error.keyValue
          )}) is already exist`,
          StatusCodes.BAD_REQUEST
        );
      }
      throw new AppErrors(
        "ValidationError",
        `${error.message}`,
        "Invalid workflow data",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async getByFilter(filter) {
    try {
      const workflow = await Workflow.findOne(filter);
      if (!workflow) {
        throw new AppErrors(
          "NotFoundError",
          "could not find workflow",
          "No Workflow stored with given Filter",
          StatusCodes.BAD_REQUEST
        );
      }
      return workflow;
    } catch (error) {
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Invalid ID",
          "Could not found workflow with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      if (error?.name == "NotFoundError") {
        throw error;
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error retrieving assistant",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getById(id) {
    try {
      const workflow = await Workflow.findById(id);
      if (!workflow) {
        throw new AppErrors(
          "NotFoundError",
          "could not find workflow",
          "No Workflow stored with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      return workflow;
    } catch (error) {
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Invalid ID",
          "Could not found workflow with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      if (error?.name == "NotFoundError") {
        throw error;
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error retrieving assistant",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAll(filter) {
    try {
      const workflow = await Workflow.find(filter);
      return workflow;
    } catch (error) {
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Invalid ID",
          "Could not found workflow with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      if (error?.name == "NotFoundError") {
        throw error;
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error retrieving assistant",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async update(filter, data, session) {
    try {
      const workflow = await Workflow.findOneAndUpdate(filter, data, {
        new: true,
        session,
        runValidators: true,
      });
      return workflow;
    } catch (error) {
      if (error?.explanation) {
        throw error;
      }
      if (error?.name == "CastError") {
        throw new AppErrors(
          "NotFoundError",
          "workflow not found",
          `workflow with ID ${id} not found`,
          StatusCodes.NOT_FOUND
        );
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error updating workflow",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async delete(filter) {
    try {
      const workflow = await Workflow.findOneAndDelete(filter);

      return workflow;
    } catch (error) {
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Invalid ID",
          "Could not found workflow with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      if (error?.name == "NotFoundError") {
        throw error;
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error retrieving assistant",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = WorkflowRepository;
