import Router from "express"
import { validate } from "../../core/middleware/validate.js"
import { loginSchema, registerSchema, resetPasswordSchema } from "../../shared/validators/auth.validator.js"
import { forgotPasswordMail, getAccessToken, logInUser, logoutUser, registerUser, resetPassword, verifyUserMail } from "./auth.controller.js"
import { isLoggedIn } from "../../core/middleware/isLoggedIn.js"

const authRouter = Router()

authRouter.post("/register-user", validate(registerSchema), registerUser)
authRouter.post("/login-user", validate(loginSchema), logInUser)
authRouter.post("/logout-user", isLoggedIn, logoutUser)
authRouter.get("/verify/:token", verifyUserMail)
authRouter.get("/get-access-token", getAccessToken)
authRouter.get("/forgot-password-mail", forgotPasswordMail)
authRouter.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword)

export default authRouter