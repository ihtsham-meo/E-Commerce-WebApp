import mongoose from "mongoose";

const userSchema = new mongoose.schema({
    userAvatar: {
        type: String,
        deafault: "https://via.placeholder.com/200x200.png"
    },
    name: {
        type: string,
        required: [true, "Please provide a name"],
        trim: true
    },
    username: {
        type: string,
        required: [true, "Please provide a name"],
        unique: [true, "Username already exist"],
        lowercase: true,
        trim: true,
        index: true,
    },
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    );
};

userSchema.methods.generateTemporaryToken = function () {

    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");
    const tokenExpiry = Date.now() + 5 * 60 * 1000; // 20 minutes;

    return { unHashedToken, hashedToken, tokenExpiry };
};


const User = mongoose.model("User", userSchema)

export default User