const mongoose = require("mongoose");

const InputSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["SHORT_TEXT", "LONG_TEXT", "BOOLEAN", "FILE_UPLOAD", "NUMBER"],
      required: true,
    },
    display_name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
    },
    variable_name: {
      type: String,
    },
    required: {
      type: Boolean,
      default: false,
    },
    default_value: {
      type: String,
    },
    accept_multiples_files: {
      type: Boolean,
    },
    default_value: {
      type: String,
    },
    entered_value: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const InputConfig = mongoose.Schema("input-configs", InputSchema);

module.exports = InputConfig;
