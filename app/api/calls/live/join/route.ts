import { NextRequest, NextResponse } from "next/server";
import { getStoredCall, updateStoredCall } from "@/lib/calls/store";
import { logCompliance } from "@/lib/security/compliance";
import { rateLimit } from "@/lib/security/rate-limit";
import { joinLiveCallSchema } from "@/lib/security/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "calls-live-join");
  if (limited) return limited;

  const payload = joinLiveCallSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json({ error: "Invalid join request", issues: payload.error.flatten() }, { status: 400 });
  }

  if (!payload.data.consentGiven) {
    return NextResponse.json({ error: "Agent must confirm recording consent notice before joining." }, { status: 412 });
  }

  const call = await getStoredCall(payload.data.callSessionId);
  if (!call) return NextResponse.json({ error: "Call session not found." }, { status: 404 });
  if (call.dncBlocked) return NextResponse.json({ error: "Cannot join a DNC-blocked call." }, { status: 409 });

  await updateStoredCall(call.id, "ONGOING");
  await logCompliance({
    callSessionId: call.id,
    phone: call.callerPhone,
    eventType: "CALL_JOIN",
    consentGiven: payload.data.consentGiven,
    details: {
      provider: call.provider,
      provider_call_id: call.providerCallId
    }
  });

  return NextResponse.json({
    call: { ...call, status: "ONGOING" },
    accessToken: call.accessToken,
    canStartBrowserAudio: Boolean(call.accessToken && call.provider === "RETELL"),
    message: call.accessToken
      ? "Use accessToken with RetellWebClient.startCall."
      : "The full Retell access token is intentionally not persisted. Create the call in this runtime or add encrypted token storage."
  });
}
