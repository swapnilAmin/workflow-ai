const fs = require("fs");

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

module.exports = writeFileWithStream;
