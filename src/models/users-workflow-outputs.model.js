const mongoose = require("mongoose");

const UsersWorkflowOutputs = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  history: [
    {
      workflow_name: {
        type: String,
        required: true,
      },
      workflow_output_link: {
        type: String,
        required: true,
      },
    },
  ],
});
