import { z } from "zod";

export { SiteCopySchema, type SiteCopy } from "@/templates/types";

export const OutreachSchema = z.object({
  subject: z.string().describe("Email subject line, under 8 words."),
  message: z.string().describe("The message body, plain text with line breaks. 90–140 words."),
});

export type OutreachDraft = z.infer<typeof OutreachSchema>;
