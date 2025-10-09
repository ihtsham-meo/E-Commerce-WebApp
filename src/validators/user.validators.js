import { z } from "zod";

const registerSchema = z.object({
    name: z.string("Name must be a string").min(3, "Name must be at least 3 characters long").required("Name is required"),
    email: z.email("Invalid email").required("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long").required("Password is required"),
    role: z.enum(["buyers", "store", "factory"]).default("buyers").optional()
})

export { registerSchema }