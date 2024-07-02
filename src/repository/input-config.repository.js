// const InputConfig = require("../models/inputs-config.model");
// const AppErrors = require("../utils/error-handling");
// const { StatusCodes } = require("http-status-codes");

// class InputConfigRepository {
//   async create(data) {
//     try {
//       const inputConfig = await InputConfig.create(data);
//       return inputConfig;
//     } catch (error) {
//       if (error?.code == 11000) {
//         throw new AppErrors(
//           "MongoServerError",
//           "Duplicate key error",
//           `InputConfig with given field(${Object.keys(
//             error.keyValue
//           )}) is already exist`,
//           StatusCodes.BAD_REQUEST
//         );
//       }
//       throw new AppErrors(
//         "ValidationError",
//         `${error.message}`,
//         "Invalid InputConfig data",
//         StatusCodes.BAD_REQUEST
//       );
//     }
//   }

//   //   async getByFilter(filter) {
//   //     try {
//   //       const inputConfig = await InputConfig.findOne(filter);
//   //       if (!inputConfig) {
//   //         throw new AppErrors(
//   //           "NotFoundError",
//   //           "could not find InputConfig",
//   //           "No InputConfig stored with given Filter",
//   //           StatusCodes.BAD_REQUEST
//   //         );
//   //       }
//   //       return inputConfig;
//   //     } catch (error) {
//   //       if (error?.name == "CastError") {
//   //         throw new AppErrors(
//   //           "InvalidDetailError",
//   //           "Invalid ID",
//   //           "Could not found InputConfig with given ID",
//   //           StatusCodes.BAD_REQUEST
//   //         );
//   //       }
//   //       if (error?.name == "NotFoundError") {
//   //         throw error;
//   //       }
//   //       throw new AppErrors(
//   //         "DatabaseError",
//   //         "Database operation failed",
//   //         "Error retrieving assistant",
//   //         StatusCodes.INTERNAL_SERVER_ERROR
//   //       );
//   //     }
//   //   }
//   async getById(id) {
//     try {
//       const inputConfig = await InputConfig.findById(id);
//       if (!inputConfig) {
//         throw new AppErrors(
//           "NotFoundError",
//           "could not find InputConfig",
//           "No InputConfig stored with given ID",
//           StatusCodes.BAD_REQUEST
//         );
//       }
//       return inputConfig;
//     } catch (error) {
//       if (error?.name == "CastError") {
//         throw new AppErrors(
//           "InvalidDetailError",
//           "Invalid ID",
//           "Could not found InputConfig with given ID",
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

//   //   async getAll(filter) {
//   //     try {
//   //       const inputConfig = await InputConfig.find(filter);
//   //       return inputConfig;
//   //     } catch (error) {
//   //       if (error?.name == "CastError") {
//   //         throw new AppErrors(
//   //           "InvalidDetailError",
//   //           "Invalid ID",
//   //           "Could not found InputConfig with given ID",
//   //           StatusCodes.BAD_REQUEST
//   //         );
//   //       }
//   //       if (error?.name == "NotFoundError") {
//   //         throw error;
//   //       }
//   //       throw new AppErrors(
//   //         "DatabaseError",
//   //         "Database operation failed",
//   //         "Error retrieving assistant",
//   //         StatusCodes.INTERNAL_SERVER_ERROR
//   //       );
//   //     }
//   //   }
//   async delete(id) {
//     try {
//       const inputConfig = await InputConfig.findByIdAndDelete(id);

//       return inputConfig;
//     } catch (error) {
//       if (error?.name == "CastError") {
//         throw new AppErrors(
//           "InvalidDetailError",
//           "Invalid ID",
//           "Could not found InputConfig with given ID",
//           StatusCodes.BAD_REQUEST
//         );
//       }
//       if (error?.name == "NotFoundError") {
//         throw error;
//       }
//       throw new AppErrors(
//         "DatabaseError",
//         "Database operation failed",
//         "Error deleting input",
//         StatusCodes.INTERNAL_SERVER_ERROR
//       );
//     }
//   }
//   async update(id, data, session) {
//     try {
//       const inputConfig = await InputConfig.findByIdAndUpdate(id, data, {
//         new: true,
//         session,
//         runValidators: true,
//       });
//       return inputConfig;
//     } catch (error) {
//       if (error?.explanation) {
//         throw error;
//       }
//       if (error?.name == "CastError") {
//         throw new AppErrors(
//           "NotFoundError",
//           "InputConfig not found",
//           `InputConfig with filter not found`,
//           StatusCodes.NOT_FOUND
//         );
//       }
//       throw new AppErrors(
//         "DatabaseError",
//         "Database operation failed",
//         "Error updating InputConfig",
//         StatusCodes.INTERNAL_SERVER_ERROR
//       );
//     }
//   }
// }

// module.exports = InputConfigRepository;
