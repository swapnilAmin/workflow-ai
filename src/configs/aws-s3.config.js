const AWS = require("aws-sdk");
const {
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_REGION,
} = require("./server.config");

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
});

module.exports = s3;
