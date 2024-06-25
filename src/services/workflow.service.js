const axios = require("axios");
const { google } = require("googleapis");
const OPENAI = require("openai");
const { StatusCodes } = require("http-status-codes");
const twilio = require("twilio");
const AppErrors = require("../utils/error-handling");
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  GOOGLE_API_KEY,
  OPENAI_API_KEY,
  GROWSTACKAI_WHATSAPP_NO,
} = require("../configs/server.config");
const sendEmail = require("../utils/send-email");
const openai = new OPENAI(OPENAI_API_KEY);

const sendMessageToWhatsApp = async (to, body, media = "") => {
  try {
    const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const message = await client.messages.create({
      from: `whatsapp:${GROWSTACKAI_WHATSAPP_NO}`,
      to: `whatsapp:${to}`,
      body: body,
      mediaUrl: media,
    });
    return message;
  } catch (error) {
    throw new AppErrors(
      "ServerError",
      "Could not able to send message",
      "Error occured while sending message",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const getGoogleFormFile = async (userId, fileId) => {
  try {
    const drive = google.drive({ version: "v3", auth: GOOGLE_API_KEY });
    const response = await drive.files.get(
      { fileId: fileId, alt: "media" }
      //   { responseType: "stream" }
    );
    // const dest = fs.createWriteStream("/files/doc.response.txt");
    // response.data.pipe(dest);
    // return new Promise((resolve, reject) => {
    //   dest.on("finish", () => {
    //     console.log("File downloaded successfully");
    //     resolve(true);
    //   });
    //   dest.on("error", (err) => {
    //     console.error("Error writing file:", err);
    //     reject(err);
    //   });
    // });
    return response;
  } catch (error) {
    console.error("Failed to download file:", error);
  }
};

const chatGPTProcess = async (messages, creativity) => {
  try {
    const creativitySettings = {
      repetitive: { temperature: 0.0, frequency_penalty: 1.0 },
      deterministic: { temperature: 0.3, frequency_penalty: 0.5 },
      original: { temperature: 0.7, frequency_penalty: 0.2 },
      creative: { temperature: 1.0, frequency_penalty: 0.0 },
      imaginative: { temperature: 1.2, frequency_penalty: -0.2 },
    };

    const { temperature, frequency_penalty } =
      creativitySettings[creativity] || creativitySettings["original"];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature,
      frequency_penalty,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    throw new AppErrors(
      "ServerError",
      "Could not able generate ai response",
      "Error occured while generating gpt response",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// const checkPlagiarism = async (text) => {
//   const url = "https://api.plagiarismchecker.com/check";
//   const data = {
//     text: text,
//   };
//   const headers = {
//     Authorization: "Bearer ",
//     "Content-Type": "application/json",
//   };

//   try {
//     const response = await axios.post(url, data, { headers: headers });
//     return response.data.plagiarismRate;
//   } catch (error) {
//     console.error("Error checking plagiarism:", error);
//   }
// };

const processWhatsAppMessage = async (message, user) => {
  if (message.body.toLowerCase() === "reviewed") {
    await sendMessageToWhatsApp(
      user.mobile_no,
      "Thank you for reviewing the research."
    );
  } else if (message.body.toLowerCase() === "not satisfied") {
    await sendMessageToWhatsApp(
      user.mobile_no,
      "Sorry to here that, We will enhance our system to generate better research."
    );
  } else {
    await sendMessageToWhatsApp(
      user.mobile_no,
      'If you received PDF url then Please review the Research and reply with "Reviewed" when done, else reply with "Not Satisfied" when pdf does not reached expectation, if you do not recevied any pdf link then we are still processing your request'
    );
  }
};

const processStudenResearchNewSubmission = async (response, user, count) => {
  if (count == 0) {
    return false;
  }
  const systemPrompt = `You are very good research.Leverage the search engine, help me to do research about the given data. Provide some sites links.`;
  const userMessage = response;
  const message = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];
  const chatGPTResponse = await chatGPTProcess(message);
  const textToCheck = chatGPTResponse;
  // const plagiarismCheck = [
  //   {
  //     role: "system",
  //     content:
  //       "You are good at plagiarism checking. Please give the plagiarism rate in percentage.",
  //   },
  //   {
  //     role: "user",
  //     content: userMessage,
  //   },
  // ];
  // const plagiarismRate = await chatGPTProcess(plagiarismCheck);

  // const messageBody = plagiarismRate.choices[0].text;

  if (plagiarismRate > 20) {
    const flag = await processStudenResearchNewSubmission(
      response,
      user,
      count - 1
    );
    return flag;
  } else {
    // await sendMessageToWhatsApp(
    //   user.mobile_no,
    //   "Research completed, review attached pdf"
    // );
    // // const systemPrompt = `You need to add human touch to given text.`;

    // // const message = [
    // //   {
    // //     role: "system",
    // //     content: systemPrompt,
    // //   },
    // //   {
    // //     role: "user",
    // //     content: textToCheck,
    // //   },
    // // ];
    // // const humanTouchResponse = await chatGPTProcess(message);
    return textToCheck;
  }
};

const scheduleCronJobForUser = (user) => {
  cron.schedule("*/3 * * * *", async (user) => {
    // console.log(`Running the cron job for user: ${user.userId}`);
    const fileDownloaded = await getGoogleFormFile(user.userId, user.fileId);
    if (fileDownloaded.length > 0) {
      await sendMessageToWhatsApp(user.mobile_no, "Received a new ");

      const response = await processStudenResearchNewSubmission(
        fileDownloaded,
        user
      );
      if (response && response.research) {
        // upload file to s3
        await sendMessageToWhatsApp(
          user.mobile_no,
          "Research completed, review attached pdf"
        );
        await sendEmail(
          user.email,
          "Research Reviewed",
          "Your research has been reviewed."
        );
      } else {
      }
    }
  });
};

module.exports = {
  scheduleCronJobForUser,
  processWhatsAppMessage,
  chatGPTProcess,
};
