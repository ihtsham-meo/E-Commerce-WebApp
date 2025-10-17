import mongoose from "mongoose";
import { jwt } from "zod";
import { lowercase, required } from "zod/mini";
import { defaultErrorMap } from "zod/v3";

const adminSchema = new mongoose.Schema(
    {
        profileImage: {
            type: String,
            default: 'https://placehold.co/600x400?text=admin+Image',
        },
        
        adminName: {
            type: String,
            required: true,
            trim: true,
        },

        adminEmail: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        adminPassword: {
            type: String,
            required: true,
        },

        adminAddress: {
            type: String,
            trim: true,
            default: null,
        },

        adminPasswordResetToken: {
            type: String,
            default: null,
        },

        adminPasswordExpirationDate: {
            tpye: Date,
            default: null,
        },

        refreshToken: {
            type: String,
            default: null,
        },

        adminRole: {
            type: String,
            default: null,
        },

        phoneNumber: {
            type: String,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

    },
    {
        timestamps: true,
    }
);

adminSchema.pre("save",function(next){
    if(this.isModified("adminPassword")) {
        this.adminPassword = bcrypt.hashSync(this.adminPassword, 10)
    }
    next()
})

adminSchema.method.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.adminPassword);
};

adminSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            adminEmail: this.adminEmail,
            adminName: this.adminName,
            adminRole: this.adminRole,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expireIn: process.env.ACCESS_TOKEN_EXPIRY},
    );
};

adminSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expireIn: process.env.REFRESH_TOKEN_EXPIRY },
    );
};

adminSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashToken = crypto 
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");
    const tokenExpiry = Date.now() + 5 * 60 * 1000;
    
    return { unHashedToken, hashedToken, tokenExpiry };
};