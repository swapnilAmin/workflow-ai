const fs = require("fs");
const AppErrors = require("./error-handling");
const { StatusCodes } = require("http-status-codes");

const writeFileWithStream = async (filePath, data) => {
  const writeStream = fs.createWriteStream(filePath);
  writeStream.write(data);
  writeStream.end();

  writeStream.on("finish", () => {
    console.log("File written successfully");
  });

  writeStream.on("error", (err) => {
    console.error("Error writing file:", err);
  });
};
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
module.exports = { writeFileWithStream, fileDelete };
