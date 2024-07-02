const OPENAI = require("openai");
const { OPENAI_API_KEY } = require("../configs/server.config");
const AppErrors = require("../utils/error-handling");
const { StatusCodes } = require("http-status-codes");
const openai = new OPENAI(OPENAI_API_KEY);
const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic();

const anthropicChatCompletion = async (model, systemPrompt, userPrompt) => {
  try {
    const response = anthropic.messages.create(
      (model = "claude-3-5-sonnet-20240620"),
      // (max_tokens = 2048),
      (system = systemPrompt),
      (messages = [
        {
          role: "user",
          content: userPrompt,
        },
      ])
    );
    return response;
  } catch (error) {
    throw new AppErrors(
      "ServerError",
      "Could not able generate ai response",
      "Error occured while generating anthropic response",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const chatGPTProcess = async (
  messages,
  model = "gpt-4o",
  creativity,
  responseFormat
) => {
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
      response_format: responseFormat,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.log(error);
    throw new AppErrors(
      "ServerError",
      "Could not able generate ai response",
      "Error occured while generating gpt response",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  chatGPTProcess,
  anthropicChatCompletion,
};
