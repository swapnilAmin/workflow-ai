const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const AppErrors = require("./error-handler");

const fileDelete = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw new AppErrors(
        "Server Error",
        "could not able to delete file",
        "server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  });
};

module.exports = fileDelete;
