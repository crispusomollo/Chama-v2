import { z } from "zod";

export const createMemberSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  nationalId: z.string().optional(),
});
