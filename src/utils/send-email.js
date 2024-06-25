const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const {
  FROM_EMAIL,
  EMAIL_HOST,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
} = require("../configs/server.config");
const { StatusCodes } = require("http-status-codes");
const AppErrors = require("./error-handling");

const sendEmail = async (email, subject, payload, template) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  const source = fs.readFileSync(path.join(__dirname, template), "utf8");

  // const compiledTemplate = handlebars.compile(source);
  const options = {
    from: {
      name: "GrowStack AI System",
      address: FROM_EMAIL,
    },
    to: email,
    subject: subject,
    html: compiledTemplate(payload),
  };

  try {
    transporter.sendMail(options);
    return true;
  } catch (error) {
    throw new AppErrors(
      "EmailError",
      error?.message,
      "Error while sending mail",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = sendEmail;
