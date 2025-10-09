import { asyncHandler } from "../utils/async-handler";

const validate = (schema) => asyncHandler(async (req, res, next) =>{
    schema.parse(req.body);
    next();
})

export { validate }