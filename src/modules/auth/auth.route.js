import Router from "express";
import multer from "multer"; // 🧩 Added for handling file uploads
import { validate } from "../../core/middleware/validate.js";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../../shared/validators/auth.validators.js";
import {
  forgotPasswordMail,
  getAccessToken,
  logInUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUserMail,
} from "./auth.controller.js";
import { isLoggedIn } from "../../core/middleware/isLoggedIn.js";

const authRouter = Router();

// 🧱 Use Multer to handle image uploads in memory for AWS S3
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Register User (with optional profile image upload to AWS S3)
authRouter.post(
  "/register-user",
  // ⬅️ handles image upload for AWS
  upload.single("profileImage"),
  validate(registerSchema),
   
  registerUser
);

// 🔐 Login User
authRouter.post("/login-user", validate(loginSchema), logInUser);

// 🚪 Logout User
authRouter.post("/logout-user", isLoggedIn, logoutUser);

// ✉️ Verify Email
authRouter.get("/verify/:token", verifyUserMail);

// 🔁 Get Access Token
authRouter.get("/get-access-token", getAccessToken);

// 🔑 Forgot Password
authRouter.get("/forgot-password-mail", forgotPasswordMail);



// 🔒 Reset Password
authRouter.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword
);

export default authRouter;