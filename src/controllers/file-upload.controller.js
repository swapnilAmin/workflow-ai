const FileUploadService = require("../services/file-upload.service");
const { StatusCodes } = require("http-status-codes");
const fileUploadService = new FileUploadService();

const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const { user } = req;
    const key = user.id;
    const fileUrl = await fileUploadService.upload(file, key);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "successfully uploaded document",
      data: fileUrl,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { key, fileName } = req.params;
    await fileUploadService.download(key, fileName, res);
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.explanation,
    });
  }
};
module.exports = { uploadFile, downloadFile };
