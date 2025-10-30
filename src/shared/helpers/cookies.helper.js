import { asyncHandler } from "../../core/utils/async-handler.js";

const storeLoginCookies = (res, accessToken, refreshToken, role) => {
    console.log(role);
    
    const normalizedRole = role?.toLowerCase();

    console.log("Hello World");

    const accessTokenName = `${normalizedRole}AccessToken`;
    const refreshTokenName = `${normalizedRole}RefreshToken`;

    res.cookie(accessTokenName, accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        samesite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 *1000,
    });
};

const storeAccessToken = asyncHandler(async(res, accessToken, role = "user") => {
    const normalizedRole = role?.toLowerCase() || "user";
    const accessTokenName = `${normalizedRole}AccessToken`;

    res.cookie(accessTokenName, accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60 * 1000,
    });
});

export{storeLoginCookies, storeAccessToken};