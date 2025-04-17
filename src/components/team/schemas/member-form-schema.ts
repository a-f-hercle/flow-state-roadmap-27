
import { z } from "zod";

export const addMemberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.string().min(2, { message: "Role must be at least 2 characters" }),
});

export type AddMemberFormValues = z.infer<typeof addMemberSchema>;
