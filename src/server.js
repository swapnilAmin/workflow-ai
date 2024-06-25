const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { PORT, DEV_MODE, SESSION_SECRET } = require("./configs/server.config");
const connectDb = require("./configs/mongodb.config");
const router = require("./routes/index");

const startServer = () => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "*",
  };

  app.use(cors(corsOptions));
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  if (DEV_MODE == "true") {
    process.env.DEV_MODE = "false";
    connectDb();
  }

  app.use("/workflow", bodyParser.json(), router);

  app.listen(PORT, () => {
    console.log("server is up at ", PORT);
  });
};

startServer();
