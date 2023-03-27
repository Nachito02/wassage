import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    chatrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" }],
    password: {
      type: String,
      required: true,
      trim: true,
    },

    profile_img: {
      type: String,
      default: "",
    },

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }, { type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    token: {
      type: String,
    },

    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.verifyPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
