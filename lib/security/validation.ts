import { z } from "zod";

export const bdPhoneSchema = z
  .string()
  .trim()
  .regex(/^(\+?8801|01)[3-9]\d{8}$/, "Use a valid Bangladesh mobile number.");

export const tenantIdSchema = z.string().uuid().optional();

export const createLiveCallSchema = z.object({
  callerName: z.string().trim().min(2).max(80),
  callerPhone: bdPhoneSchema,
  department: z.enum(["Sales", "Support", "Billing", "Operations", "Marketing", "Front Desk"]),
  consentGiven: z.boolean(),
  tenantId: tenantIdSchema
});

export const joinLiveCallSchema = z.object({
  callSessionId: z.string().uuid(),
  consentGiven: z.boolean()
});

export const endLiveCallSchema = z.object({
  callSessionId: z.string().uuid()
});

export function normalizeBdPhone(phone: string) {
  const trimmed = phone.replace(/\s|-/g, "");
  if (trimmed.startsWith("+880")) return trimmed;
  if (trimmed.startsWith("880")) return `+${trimmed}`;
  if (trimmed.startsWith("01")) return `+88${trimmed}`;
  return trimmed;
}
