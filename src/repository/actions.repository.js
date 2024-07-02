const Actions = require("../models/actions.model");
const AppErrors = require("../utils/error-handling");
const { StatusCodes } = require("http-status-codes");

class ActionsRepository {
  async create(data) {
    try {
      const actions = await Actions.create(data);
      return actions;
    } catch (error) {
      if (error?.code == 11000) {
        throw new AppErrors(
          "MongoServerError",
          "Duplicate key error",
          `Actions with given field(${Object.keys(
            error.keyValue
          )}) is already exist`,
          StatusCodes.BAD_REQUEST
        );
      }
      throw new AppErrors(
        "ValidationError",
        `${error.message}`,
        "Invalid Actions data",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async getByFilter(filter) {
    try {
      const actions = await Actions.findOne(filter);
      if (!actions) {
        throw new AppErrors(
          "NotFoundError",
          "could not find Actions",
          "No Actions stored with given Filter",
          StatusCodes.BAD_REQUEST
        );
      }
      return actions;
    } catch (error) {
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Invalid ID",
          "Could not found Actions with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      if (error?.name == "NotFoundError") {
        throw error;
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error retrieving actions",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getById(id) {
    try {
      const actions = await Actions.findById(id);
      if (!actions) {
        throw new AppErrors(
          "NotFoundError",
          "could not find Actions",
          "No Actions stored with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      return actions;
    } catch (error) {
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Invalid ID",
          "Could not found Actions with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      if (error?.name == "NotFoundError") {
        throw error;
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error retrieving actions",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAll(filter) {
    try {
      const actions = await Actions.find(filter);
      return actions;
    } catch (error) {
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Invalid ID",
          "Could not found Actions with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      if (error?.name == "NotFoundError") {
        throw error;
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error retrieving actions",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async delete(filter) {
    try {
      const actions = await Actions.findOneAndDelete(filter);

      return actions;
    } catch (error) {
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Invalid ID",
          "Could not found Actions with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      if (error?.name == "NotFoundError") {
        throw error;
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error deleting actions",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async update(filter, data, session) {
    try {
      const actions = await Actions.findOneAndUpdate(filter, data, {
        new: true,
        session,
        runValidators: true,
      });
      return actions;
    } catch (error) {
      if (error?.explanation) {
        throw error;
      }
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Actions not found",
          `Actions with filter not found`,
          StatusCodes.NOT_FOUND
        );
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error updating Actions",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = ActionsRepository;
