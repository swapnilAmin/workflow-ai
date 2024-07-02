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
const WorkflowSchema = mongoose.Schema(
  {
    workflow_id: {
      type: String,
      requireed: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    actions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "actions",
        required: true,
      },
    ],
    input_configs: [InputSchema],
    output_configs: [OutputSchema],
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

const Workflow = mongoose.model("workflows", WorkflowSchema);

module.exports = Workflow;
