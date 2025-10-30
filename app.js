import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import { errorHandler } from "./src/core/middleware/errorHandle.js";

import authRouter from "./src/modules/auth/auth.route.js";
import userRouter from "./src/modules/user/user.route.js";
import adminRouter from "./src/modules/admin/admin.routes.js";
import adminActionRouter from "./src/modules/admin/adminAction.route.js";

const app = express()

dotenv.config()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/admin/actions", adminActionRouter)


app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 Server is running smoothly - Module Structure',
        timestamp: new Date().toISOString()
    });
});

app.use(errorHandler)

export default app