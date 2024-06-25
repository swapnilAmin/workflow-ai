const mongoose = require("mongoose");

const InputSchema = mongoose.Schema({
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
});
const WorkflowSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    workflow_id: {
      type: String,
    },
    inputs: [InputSchema],
    workflow: [
      {
        provider: {
          type: String,
          required: true,
        },
        action: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Workflow = mongoose.model("workflows", WorkflowSchema);

module.exports = Workflow;
