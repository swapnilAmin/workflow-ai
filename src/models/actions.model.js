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
      type: String, //openai
      required: true,
    },
    subtype: {
      type: String, //gpt
    },
    presetJson: {
      body: {
        instruction: {
          type: String, //prompt
        },
        model: {
          type: String,
        },
      },
      mixed: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
    event_execute: {
      type: String,
    },
    built: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Actions = mongoose.model("actions", ActionSchema);

module.exports = Actions;
