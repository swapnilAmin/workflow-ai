const mongoose = require("mongoose");

const WorkflowSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    workflow_id: {
      type: String,
    },
    inputs: [
      {
        label: {
          type: String,
          required: true,
        },
        placeholder: {
          type: String,
        },
      },
    ],
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
