import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: "https://placehold.co/600x400?text=User\nName",
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    userPassword: {
      type: String,
      required: true,
      minlength: 6,
    },
    userAddress: {
      type: String,
      maxlength: 200,
    },
    userIsVerified: {
      type: Boolean,
      default: false,
    },
    userPasswordResetToken: {
      type: String,
      default: null,
    },
    userPasswordExpirationDate: {
      type: Date,
      default: null,
    },
    userVerificationToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    userRole: {
      type: String,
      enum: ["buyer", "store-admin", "factory-admin", "admin"],
      default: "buyer",
    },
    phoneNumber: {
      type: String,
      maxlength: 20,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("userPassword")) return next();
  this.userPassword = await bcrypt.hash(this.userPassword, 10);
  next();
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.userPassword);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.userEmail,
      username: this.userName,
      role: this.userRole,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};


userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes

  return { unHashedToken, hashedToken, tokenExpiry };
};

const User = mongoose.model("User", userSchema);
export default User;
