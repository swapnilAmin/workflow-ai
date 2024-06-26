const mongoose = require("mongoose");

const RunSchema = mongoose.Schema({
  run_id: {
    type: String, //arp_AebESodX73jVh10LRPO4xBlO
    required: true,
  },
  actions_id: {
    type: String,
    required: true,
  },
  credit_used: {
    type: Number,
  },
  started_at: {
    type: Date,
    default: new Date(),
  },
  ended_at: {
    type: Date,
  },
  input: {
    model: {
      type: String,
    },
    prompt: {
      type: String,
    },
  },
  output: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Failed", "Success"],
  },
});

const RunnerOutput = mongoose.Schema({
  workflow_run_id: {
    type: String, //rnp_qMnD7Xy48bfB2ENZPl
  },
  workflow_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workflows",
    required: true,
  },
  actions_with_runs: [
    {
      action: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "actions",
        required: true,
      },
      run: [RunSchema],
    },
  ],
});

const WorkflowRun = mongoose.model("workflow-runner", RunnerOutput);
module.exports = WorkflowRun;
