import express from "express";
import { upload } from "../../core/middleware/multer.js";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  verifyAdminMail,
  getAdminAccessToken,
  forgotAdminPasswordMail,
  resetAdminPassword,
  updateAdminProfileImage,
  deleteAdminProfileImage,
  updateAdminProfile,
  deleteAdminProfile
} from "../../modules/admin/admin.controller.js";

import { isLoggedIn } from "../../core/middleware/isLoggedIn.js";
import { validate } from "../../core/middleware/validate.js";
import {
  registerAdminSchema,
  loginAdminSchema,
  resetPasswordSchema
} from "../../shared/validators/admin.validation.js";

const adminRouter = express.Router();

// aut routes
adminRouter.post("/register",upload.single("adminProfileImage"), validate(registerAdminSchema), registerAdmin);
adminRouter.post("/login", validate(loginAdminSchema), loginAdmin);
adminRouter.get("/verify/:token", verifyAdminMail);
adminRouter.get("/forgot-password", forgotAdminPasswordMail);
adminRouter.post("/reset-password/:token", validate(resetPasswordSchema), resetAdminPassword);
adminRouter.post("/logout", isLoggedIn, logoutAdmin);
adminRouter.get("/get-access-token", getAdminAccessToken);

//Profile image route 
adminRouter.put(
  "/:adminId/profile-image",
  isLoggedIn,
  upload.single("adminProfileImage"), // expects `file` field in form-data
  updateAdminProfileImage
);

adminRouter.delete(
  "/:adminId/profile-image",
  isLoggedIn,
  deleteAdminProfileImage
);

adminRouter.put("/update/:adminId", isLoggedIn, updateAdminProfile);

// Delete Admin profile
adminRouter.delete("/:adminId", isLoggedIn, deleteAdminProfile);
export default adminRouter;
