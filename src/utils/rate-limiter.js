const { rateLimit } = require("express-rate-limit");
const signUpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
  },
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
  },
});
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
  },
});

module.exports = {
  signUpLimiter,
  loginLimiter,
  passwordLimiter,
};
