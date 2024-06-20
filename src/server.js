const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const {
  PORT,
  DEV_MODE,
  AITOOLS_SERVICE,
  SESSION_SECRET,
} = require("./configs/server.config");
const connectDb = require("./configs/mongodb.config");
const router = require("./routes/index");
const { authenticateToken } = require("./middlewares/user.middleware");

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
  app.get("/dashboard", (req, res) => {
    res.send("<p>successfully logged in</p>");
  });

  app.use("/users", bodyParser.json(), router);

  var aitoolServiceProxyConfig = {
    target: AITOOLS_SERVICE,
    changeOrigin: true,
  };

  app.use(
    "/ai",
    // authenticateToken,
    createProxyMiddleware({
      ...aitoolServiceProxyConfig,
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader(
          "user",
          encodeURIComponent(JSON.stringify(req.user))
        );
      },
    })
  );

  app.listen(PORT, () => {
    console.log("server is up at ", PORT);
  });
};

startServer();
