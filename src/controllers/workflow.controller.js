const { StatusCodes } = require("http-status-codes");
const processSEOWorkflow = require("../services/seo.workflow.service");
const { processWhatsAppMessage } = require("../services/workflow.service");

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
    const { keywords } = req.body;
    console.log(keywords);
    const seoResult = await processSEOWorkflow(keywords);
    return res.status(StatusCodes.OK).json({
      message: "",
      success: true,
      data: seoResult,
    });
  } catch (error) {}
};

module.exports = {
  processSEOGeneration,
};
