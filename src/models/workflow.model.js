const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const { SALT } = require("../configs/server.config");
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail, "Please provide a valid email address"],
      unique: true,
    },
    password: {
      type: String,
    },
    google_id: {
      type: String,
    },
    facebook_id: {
      type: String,
    },
    instagram_access_token: {
      type: String,
    },
    instagram_refresh_token: {
      type: String,
    },
    instagram_access_token_expiry: {
      type: Date,
    },
    twitter_access_token: {
      type: String,
    },
    twitter_access_token_secret: {
      type: String,
    },
    twitter_oauth_token_secret: {
      type: String,
    },
    // twitter_token_obtain_at: {
    //   type: Date,
    // },
    // twitter_refresh_token_expiry: {
    //   type: Date,
    // },
    twitter_profile: {
      username: {
        type: String,
      },
      id: {
        type: String,
      },
      image_url: {
        type: String,
      },
      display_name: {
        type: String,
      },
    },
    linkedin_access_token: {
      type: String,
    },
    linkedin_refresh_token: {
      type: String,
    },
    linkedin_access_token_expiry: {
      type: Date,
    },
    linkedin_refresh_token_expiry: {
      type: Date,
    },
    linkedin_profile: {
      id: {
        type: String,
      },
      image_url: {
        type: String,
      },
      display_name: {
        type: String,
      },
      username: {
        type: String,
      },
    },
    google_mybusiness_access_token: {
      type: String,
    },
    google_mybusiness_refresh_token: {
      type: String,
    },
    google_mybusiness_access_token_expiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  this.email = this.email.trim();
  this.email = this.email.toLowerCase();
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, SALT);
  }

  next();
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
