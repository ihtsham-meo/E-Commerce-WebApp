import {ApiError} from "../utils/api-error";

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user) {
            throw new ApiError (401, "Unauthorized - Please Log in First");
        }
        const userRole = req.user.userRole;
        const adminRole = req.user.adminRole;

        const currentRole = userRole || adminRole;

        if(!currentRole) {
            throw new ApiError (403, "Access denied - No role assigned")
        }

        if(!allowedRoles.includes(currentRole)) {
            throw new ApiError(403, `Access denied - Only [${allowedRoles.join(", ")}] can Access this route`)
        }
        next();
    }
}

export {authorizeRoles};