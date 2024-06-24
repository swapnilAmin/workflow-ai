const axios = require("axios");
const { google } = require("googleapis");
const OPENAI = require("openai");
const { StatusCodes } = require("http-status-codes");
const twilio = require("twilio");
const axios = require("axios");
const AppErrors = require("../utils/error-handling");
const {
  TWILLIO_ACCOUNT_SID,
  TWILLIO_AUTH_TOKEN,
  GOOGLE_API_KEY,
  OPENAI_KEY,
  GROWSTACKAI_WHATSAPP_NO,
} = require("../configs/server.config");
const openai = new OPENAI(OPENAI_KEY);

const sendMessageToWhatsApp = async (to, body) => {
  try {
    const client = new twilio(TWILLIO_ACCOUNT_SID, TWILLIO_AUTH_TOKEN);

    const message = await client.messages.create({
      from: `whatsapp:${GROWSTACKAI_WHATSAPP_NO}`,
      to: `whatsapp:${to}`,
      body: body,
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

const chatGPTProcess = async (messages) => {
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
      model: model,
      messages: messages,
      temperature,
      frequency_penalty,
    });
    return response;
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
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

const processStudenResearchNewSubmission = async (response, user) => {
  await sendMessageToWhatsApp(user.mobile_no, "We received a new document");

  const count = 5;

  const systemPrompt = `You are very good research.Leverage the search engine, help me to do research or web scrapping about the given data. Provide some sites links.`;
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
  const textToCheck = chatGPTResponse ? chatGPTResponse.choices[0].text : "";
  const plagiarismCheck = [
    {
      role: "system",
      content:
        "You are get at plagiarism checking. Please give the plagiarism rate in percentage.",
    },
    {
      role: "user",
      content: userMessage,
    },
  ];
  const plagiarismRate = await chatGPTProcess(plagiarismCheck);

  const messageBody = plagiarismRate.choices[0].text;

  if (plagiarismRate < 20) {
  }

  await sendMessageToWhatsApp(user.mobile_no, messageBody);
};

const scheduleCronJobForUser = (user) => {
  cron.schedule("*/3 * * * *", async () => {
    console.log(`Running the cron job for user: ${user.userId}`);
    const fileDownloaded = await getGoogleFormFile(user.userId, user.fileId);
    if (fileDownloaded.length > 0) {
      await processStudenResearchNewSubmission(fileDownloaded, user);
    }
  });
};

module.exports = { scheduleCronJobForUser };
