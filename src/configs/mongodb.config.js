const mongoose = require("mongoose");
const { DB_PASSWORD, DB_USERNAME } = require("./server.config");
const DB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@growstackai.l1y9cng.mongodb.net/?retryWrites=true&w=majority&appName=growStackAI`;

const connectDb = async () => {
  mongoose
    .connect(DB_URI)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((error) => {
      console.log("could not able to connect to the database", error);
    });
};
module.exports = connectDb;
