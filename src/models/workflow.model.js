const mongoose = require("mongoose");

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
    input_configs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "input-configs",
        required: true,
      },
    ],
    output_configs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "output-configs",
        required: true,
      },
    ],
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
