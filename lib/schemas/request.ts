import { z } from "zod";

export const requestSchema = z.object({
  name: z.string().trim().min(2, "Ім'я занадто коротке").max(100),
  phone: z.string().trim().min(7, "Телефон занадто короткий").max(20),
  comment: z.string().trim().max(1000).optional(),
  // Honeypot-поле: реальні користувачі його не бачать і не заповнюють.
  website: z.string().max(0).optional(),
});

export type RequestInput = z.infer<typeof requestSchema>;
