// src/lib/validation/jobSchema.ts
import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(1, "仕事内容は必須です"),
  wage: z.string().min(1, "給与は必須です"),
  conditions: z.string().optional(),
  duties: z.string().optional(),
  notes: z.string().optional(),
  companyId: z.string().min(1, "企業IDは必須です"),
  thumbnail: z.string().optional(),
  area: z.string().optional(),
  occupation: z.string().optional(),
  companyLogo: z.string().optional(),
  companyName: z.string().optional(),
});
export type JobFormInput = z.infer<typeof jobSchema>;