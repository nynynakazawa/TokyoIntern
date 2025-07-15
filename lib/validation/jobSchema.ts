// src/lib/validation/jobSchema.ts
import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(1, "仕事内容は必須です"),
  wageMin: z.number().min(1, "給与下限は必須です"),
  wageMax: z.number().optional(),
  conditions: z.string().optional(),
  duties: z.string().optional(),
  notes: z.string().optional(),
  companyId: z.string().min(1, "企業IDは必須です"),
  thumbnail: z.string().optional(),
  area: z.string().optional(),
  occupation: z.string().optional(),
  companyLogo: z.string().optional(),
  companyName: z.string().optional(),
}).superRefine((val, ctx) => {
  if (
    typeof val.wageMax === "number" &&
    typeof val.wageMin === "number" &&
    val.wageMax < val.wageMin
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "上限は下限以上で入力してください",
      path: ["wageMax"],
    });
  }
});
export type JobFormInput = z.infer<typeof jobSchema>;