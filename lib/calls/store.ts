import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/lib/security/compliance";

export type LiveCallSession = {
  id: string;
  provider: "RETELL" | "DEMO";
  providerCallId?: string | null;
  accessToken?: string;
  accessTokenPreview?: string | null;
  agentId?: string | null;
  callerName: string;
  callerPhone: string;
  department: string;
  status: "REGISTERED" | "ONGOING" | "ENDED" | "ERROR";
  consentGiven: boolean;
  dncBlocked: boolean;
  createdAt: string;
};

const memoryCalls = new Map<string, LiveCallSession>();

export async function createStoredCall(input: Omit<LiveCallSession, "id" | "createdAt"> & { tenantId?: string }) {
  const createdAt = new Date().toISOString();
  const accessTokenPreview = input.accessToken ? `${input.accessToken.slice(0, 8)}...` : input.accessTokenPreview;

  const memoryId = crypto.randomUUID();

  try {
    const record = await prisma.callSession.create({
      data: {
        tenantId: getTenantId(input.tenantId),
        provider: input.provider,
        providerCallId: input.providerCallId,
        accessTokenPreview,
        agentId: input.agentId,
        callerName: input.callerName,
        callerPhone: input.callerPhone,
        department: input.department,
        status: input.status,
        consentGiven: input.consentGiven,
        dncBlocked: input.dncBlocked,
        metadata: {
          source: "deshvox-live-call"
        }
      }
    });

    const session = {
      id: record.id,
      provider: record.provider,
      providerCallId: record.providerCallId,
      accessToken: input.accessToken,
      accessTokenPreview: record.accessTokenPreview,
      agentId: record.agentId,
      callerName: record.callerName ?? input.callerName,
      callerPhone: record.callerPhone ?? input.callerPhone,
      department: record.department ?? input.department,
      status: record.status,
      consentGiven: record.consentGiven,
      dncBlocked: record.dncBlocked,
      createdAt: record.createdAt.toISOString()
    } satisfies LiveCallSession;
    memoryCalls.set(session.id, { ...session, accessToken: input.accessToken });
    return session;
  } catch {
    const session: LiveCallSession = {
      id: memoryId,
      ...input,
      accessTokenPreview,
      createdAt
    };
    memoryCalls.set(session.id, session);
    return session;
  }
}

export async function updateStoredCall(callSessionId: string, status: LiveCallSession["status"]) {
  try {
    await prisma.callSession.update({
      where: { id: callSessionId },
      data: { status }
    });
  } catch {
    const current = memoryCalls.get(callSessionId);
    if (current) memoryCalls.set(callSessionId, { ...current, status });
  }
}

export async function getStoredCall(callSessionId: string) {
  const memoryCall = memoryCalls.get(callSessionId);
  if (memoryCall) return memoryCall;

  try {
    const row = await prisma.callSession.findUnique({
      where: { id: callSessionId }
    });
    if (!row) return null;
    return {
      id: row.id,
      provider: row.provider,
      providerCallId: row.providerCallId,
      accessToken: undefined,
      accessTokenPreview: row.accessTokenPreview,
      agentId: row.agentId,
      callerName: row.callerName ?? "Unknown caller",
      callerPhone: row.callerPhone ?? "",
      department: row.department ?? "Front Desk",
      status: row.status,
      consentGiven: row.consentGiven,
      dncBlocked: row.dncBlocked,
      createdAt: row.createdAt.toISOString()
    } satisfies LiveCallSession;
  } catch {
    return null;
  }
}

export async function listStoredCalls(tenantId?: string) {
  try {
    const rows = await prisma.callSession.findMany({
      where: { tenantId: getTenantId(tenantId) },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return rows.map((row) => ({
      id: row.id,
      provider: row.provider,
      providerCallId: row.providerCallId,
      accessTokenPreview: row.accessTokenPreview,
      agentId: row.agentId,
      callerName: row.callerName ?? "Unknown caller",
      callerPhone: row.callerPhone ?? "",
      department: row.department ?? "Front Desk",
      status: row.status,
      consentGiven: row.consentGiven,
      dncBlocked: row.dncBlocked,
      createdAt: row.createdAt.toISOString()
    })) satisfies LiveCallSession[];
  } catch {
    return Array.from(memoryCalls.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
