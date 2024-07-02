const OutputConfig = require("../models/output-config.model");
const AppErrors = require("../utils/error-handling");
const { StatusCodes } = require("http-status-codes");

class OutputConfigRepository {
  async create(data) {
    try {
      const OutputConfig = await OutputConfig.create(data);
      return OutputConfig;
    } catch (error) {
      if (error?.code == 11000) {
        throw new AppErrors(
          "MongoServerError",
          "Duplicate key error",
          `OutputConfig with given field(${Object.keys(
            error.keyValue
          )}) is already exist`,
          StatusCodes.BAD_REQUEST
        );
      }
      throw new AppErrors(
        "ValidationError",
        `${error.message}`,
        "Invalid OutputConfig data",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  //   async getByFilter(filter) {
  //     try {
  //       const OutputConfig = await OutputConfig.findOne(filter);
  //       if (!OutputConfig) {
  //         throw new AppErrors(
  //           "NotFoundError",
  //           "could not find OutputConfig",
  //           "No OutputConfig stored with given Filter",
  //           StatusCodes.BAD_REQUEST
  //         );
  //       }
  //       return OutputConfig;
  //     } catch (error) {
  //       if (error?.name == "CastError") {
  //         throw new AppErrors(
  //           "InvalidDetailError",
  //           "Invalid ID",
  //           "Could not found OutputConfig with given ID",
  //           StatusCodes.BAD_REQUEST
  //         );
  //       }
  //       if (error?.name == "NotFoundError") {
  //         throw error;
  //       }
  //       throw new AppErrors(
  //         "DatabaseError",
  //         "Database operation failed",
  //         "Error retrieving assistant",
  //         StatusCodes.INTERNAL_SERVER_ERROR
  //       );
  //     }
  //   }
  async getById(id) {
    try {
      const OutputConfig = await OutputConfig.findById(id);
      if (!OutputConfig) {
        throw new AppErrors(
          "NotFoundError",
          "could not find OutputConfig",
          "No OutputConfig stored with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      return OutputConfig;
    } catch (error) {
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Invalid ID",
          "Could not found OutputConfig with given ID",
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

  //   async getAll(filter) {
  //     try {
  //       const OutputConfig = await OutputConfig.find(filter);
  //       return OutputConfig;
  //     } catch (error) {
  //       if (error?.name == "CastError") {
  //         throw new AppErrors(
  //           "InvalidDetailError",
  //           "Invalid ID",
  //           "Could not found OutputConfig with given ID",
  //           StatusCodes.BAD_REQUEST
  //         );
  //       }
  //       if (error?.name == "NotFoundError") {
  //         throw error;
  //       }
  //       throw new AppErrors(
  //         "DatabaseError",
  //         "Database operation failed",
  //         "Error retrieving assistant",
  //         StatusCodes.INTERNAL_SERVER_ERROR
  //       );
  //     }
  //   }
  async delete(id) {
    try {
      const OutputConfig = await OutputConfig.findByIdAndDelete(id);

      return OutputConfig;
    } catch (error) {
      if (error?.name == "CastError") {
        throw new AppErrors(
          "InvalidDetailError",
          "Invalid ID",
          "Could not found OutputConfig with given ID",
          StatusCodes.BAD_REQUEST
        );
      }
      if (error?.name == "NotFoundError") {
        throw error;
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error deleting input",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async update(id, data, session) {
    try {
      const OutputConfig = await OutputConfig.findByIdAndUpdate(id, data, {
        new: true,
        session,
        runValidators: true,
      });
      return OutputConfig;
    } catch (error) {
      if (error?.explanation) {
        throw error;
      }
      if (error?.name == "CastError") {
        throw new AppErrors(
          "NotFoundError",
          "OutputConfig not found",
          `OutputConfig with filter not found`,
          StatusCodes.NOT_FOUND
        );
      }
      throw new AppErrors(
        "DatabaseError",
        "Database operation failed",
        "Error updating OutputConfig",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = OutputConfigRepository;
