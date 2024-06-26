const mongoose = require("mongoose");
const OutputSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["PLAIN_TEXT", "MARKDOWN", "VIDEO"],
      required: true,
    },
    display_name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OutputConfig = mongoose.model("output-configs", OutputSchema);

module.exports = OutputConfig;
