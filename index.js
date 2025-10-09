import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();
const PORT = process.env.PORT || 8000;


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server in running on port ${PORT}`);
    });
}).catch(() => {
    console.error("MongoDB Connection Error:",err);
    process.exit(1);
})