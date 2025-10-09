import { ApiResponse } from "../../util/api-response";
import { asyncHandler } from "../../utils/async-handler";

const registerUser = asyncHandler(async(req, res) => {
    const { name, email ,password } = req.body;
    const existingUser = await UserActivation.findOne({email});
    if (existingUser){
        throw new ApiError(400, "User with this email already exists");
    }
    const user = await UserActivation.create({
        name,
        email,
        password: hashedPassword,
    });

    if (!user){
        throw new ApiError(500, "User registration failed");
    }

    //remove password before sending response
    const userData ={
        _id: user._id,
        name: user.name,
        email: user.email,
    };

    const response = new ApiResponse(201, userData, "User registered successfully");
    return res.status(response.statusCode).json(response);
})

export { registerUser }