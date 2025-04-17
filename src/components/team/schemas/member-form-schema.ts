
import { z } from "zod";

export const addMemberSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string().min(2, { message: "Role must be at least 2 characters" }),
});

export type AddMemberFormValues = z.infer<typeof addMemberSchema>;
