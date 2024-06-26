const mongoose = require("mongoose");

const ActionSchema = mongoose.Schema(
  {
    action_id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    descrition: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    subtype: {
      type: String,
    },
    presetJson: {
      body: {
        instruction: {
          type: String,
        },
        model: {
          type: String,
        },
      },
    },
    event_execute: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Actions = mongoose.model("actions", ActionSchema);

module.exports = Actions;
