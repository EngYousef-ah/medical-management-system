import { z } from "zod";


export const loginValidation = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(30,"Password must be at most 30 characters")
});

export type LoginFormValues  = z.infer<typeof loginValidation>;