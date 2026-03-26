import { z } from "zod";


export const registerSchema= z.object({
    name :z.string().min(4,"Name must be at least 4 characters"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters").max(30,"Password must be at most 30 characters"),
    role: z.enum(["doctor","patient"])
})

export type RegisterFormValues= z.infer<typeof registerSchema>;