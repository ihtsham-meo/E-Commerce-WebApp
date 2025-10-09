import { registerUser } from "../../controllers/users/user.controllers"
import { validate } from "../../middlewares/validate"
import { registerSchema } from "../../validators/users/user.validator"


const router = router()

router.post("/register-user", validate(registerSchema), registerUser)