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
    adminName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    adminEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    adminPassword: {
      type: String,
      required: true,
      minlength: 6,
    },
    adminAddress: {
      type: String,
      maxlength: 200,
    },
    adminIsVerified: {
      type: Boolean,
      default: false,
    },
    adminPasswordResetToken: {
      type: String,
      default: null,
    },
    adminPasswordExpirationDate: {
      type: Date,
      default: null,
    },
    adminVerificationToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    adminRole: {
      type: String,
      enum: ["super-admin", "admin-manager"],
      default: "super-admin",
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
  if (!this.isModified("adminPassword")) return next();
  this.adminPassword = await bcrypt.hash(this.adminPassword, 10);
  next();
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.adminPassword);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.adminEmail,
      adminname: this.adminName,
      role: this.adminRole,
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

const admin = mongoose.model("User", adminSchema);
export default admin;
