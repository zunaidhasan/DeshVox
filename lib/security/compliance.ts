import { createHash } from "crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeBdPhone } from "./validation";

const DEMO_TENANT_ID = "00000000-0000-0000-0000-000000000001";

const demoDncNumbers = new Set(["+8801711111111", "+8801811111111"]);

type ComplianceEvent = {
  tenantId?: string;
  callSessionId?: string;
  phone?: string;
  eventType: "RECORDING_CONSENT" | "DNC_CHECK" | "CALL_JOIN" | "CALL_END";
  consentGiven?: boolean;
  dncBlocked?: boolean;
  details?: Prisma.InputJsonObject;
};

export function getTenantId(tenantId?: string) {
  return tenantId ?? process.env.DEMO_TENANT_ID ?? DEMO_TENANT_ID;
}

export function hashPhone(phone: string) {
  return createHash("sha256").update(normalizeBdPhone(phone)).digest("hex");
}

export async function checkDnc(tenantId: string, phone: string) {
  const normalized = normalizeBdPhone(phone);
  const phoneHash = hashPhone(normalized);

  try {
    const match = await prisma.dncEntry.findUnique({
      where: {
        tenantId_phoneHash: {
          tenantId,
          phoneHash
        }
      }
    });

    return { blocked: Boolean(match), phoneHash, source: match ? "database" : "database-clear" };
  } catch {
    return { blocked: demoDncNumbers.has(normalized), phoneHash, source: "demo-fallback" };
  }
}

export async function logCompliance(event: ComplianceEvent) {
  const tenantId = getTenantId(event.tenantId);
  const phoneHash = event.phone ? hashPhone(event.phone) : undefined;

  try {
    await prisma.complianceLog.create({
      data: {
        tenantId,
        callSessionId: event.callSessionId,
        eventType: event.eventType,
        phoneHash,
        consentGiven: event.consentGiven,
        dncBlocked: event.dncBlocked,
        details: event.details
      }
    });
  } catch {
    console.info("Compliance log fallback", {
      tenantId,
      eventType: event.eventType,
      phoneHash,
      consentGiven: event.consentGiven,
      dncBlocked: event.dncBlocked,
      details: event.details
    });
  }
}
