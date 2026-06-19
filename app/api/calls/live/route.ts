import { NextRequest, NextResponse } from "next/server";
import { createStoredCall, listStoredCalls } from "@/lib/calls/store";
import { getRetellAgentId, getRetellClient } from "@/lib/retell";
import { checkDnc, getTenantId, logCompliance } from "@/lib/security/compliance";
import { rateLimit } from "@/lib/security/rate-limit";
import { createLiveCallSchema, normalizeBdPhone } from "@/lib/security/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, "calls-live-list");
  if (limited) return limited;

  const tenantId = request.nextUrl.searchParams.get("tenantId") ?? undefined;
  const calls = await listStoredCalls(tenantId);
  return NextResponse.json({ calls });
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "calls-live-create");
  if (limited) return limited;

  const payload = createLiveCallSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json({ error: "Invalid call request", issues: payload.error.flatten() }, { status: 400 });
  }

  const tenantId = getTenantId(payload.data.tenantId);
  const callerPhone = normalizeBdPhone(payload.data.callerPhone);

  await logCompliance({
    tenantId,
    phone: callerPhone,
    eventType: "RECORDING_CONSENT",
    consentGiven: payload.data.consentGiven,
    details: {
      channel: "dashboard-live-call",
      message: "Caller consent captured before web voice call creation."
    }
  });

  if (!payload.data.consentGiven) {
    return NextResponse.json({ error: "Call recording consent is required before starting a live AI call." }, { status: 412 });
  }

  const dnc = await checkDnc(tenantId, callerPhone);
  await logCompliance({
    tenantId,
    phone: callerPhone,
    eventType: "DNC_CHECK",
    dncBlocked: dnc.blocked,
    details: {
      source: dnc.source,
      result: dnc.blocked ? "blocked" : "clear"
    }
  });

  if (dnc.blocked) {
    return NextResponse.json({ error: "This number is on the simulated DNC list.", dncBlocked: true }, { status: 409 });
  }

  const retell = getRetellClient();
  const agentId = getRetellAgentId();
  let provider: "RETELL" | "DEMO" = "DEMO";
  let providerCallId = `demo_${crypto.randomUUID()}`;
  let accessToken = `demo_access_${crypto.randomUUID()}`;
  let status: "REGISTERED" | "ONGOING" | "ENDED" | "ERROR" = "REGISTERED";

  if (retell && agentId) {
    const webCall = await retell.call.createWebCall({
      agent_id: agentId,
      metadata: {
        tenant_id: tenantId,
        caller_name: payload.data.callerName,
        caller_phone_hash: dnc.phoneHash,
        department: payload.data.department,
        btrc_compliance: {
          recording_consent: true,
          dnc_checked: true
        }
      },
      retell_llm_dynamic_variables: {
        caller_name: payload.data.callerName,
        department: payload.data.department,
        locale: "bn-BD"
      }
    });

    provider = "RETELL";
    providerCallId = webCall.call_id;
    accessToken = webCall.access_token;
    status = webCall.call_status === "error" ? "ERROR" : "REGISTERED";
  }

  const call = await createStoredCall({
    tenantId,
    provider,
    providerCallId,
    accessToken,
    agentId,
    callerName: payload.data.callerName,
    callerPhone,
    department: payload.data.department,
    status,
    consentGiven: payload.data.consentGiven,
    dncBlocked: false
  });

  return NextResponse.json({
    call,
    retellConfigured: Boolean(retell && agentId)
  });
}
