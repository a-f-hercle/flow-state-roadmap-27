
import * as z from "zod";

export const ProjectFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  team: z.string().min(1, { message: "Team is required" }),
  owner: z.string().optional(),
  owner_id: z.string().optional(),
  tags: z.string().optional(),
  displayOnRoadmap: z.boolean().default(false),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  approvers: z.array(z.string()).optional(),
  builders: z.array(z.string()).optional(),
});
