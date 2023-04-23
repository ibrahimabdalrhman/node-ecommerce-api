/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    username: {
      type: String,
      trim: true,
      required: [true, "username required"],
      maxLength: 30,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "email required"],
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "password required"],
      minLength: [6, "too short password"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "manager"],
      required: [true, "name required"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    ResetCode: String,
    ResetCodeExpireAt: Date,
    ResetCodeVerified:Boolean,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const { password } = this.getUpdate();
  if (!password) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    this.getUpdate().password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});


module.exports = mongoose.model('User', userSchema);