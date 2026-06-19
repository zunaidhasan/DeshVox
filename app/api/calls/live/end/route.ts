import { NextRequest, NextResponse } from "next/server";
import { getStoredCall, updateStoredCall } from "@/lib/calls/store";
import { getRetellClient } from "@/lib/retell";
import { logCompliance } from "@/lib/security/compliance";
import { rateLimit } from "@/lib/security/rate-limit";
import { endLiveCallSchema } from "@/lib/security/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "calls-live-end");
  if (limited) return limited;

  const payload = endLiveCallSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json({ error: "Invalid end request", issues: payload.error.flatten() }, { status: 400 });
  }

  const call = await getStoredCall(payload.data.callSessionId);
  if (!call) return NextResponse.json({ error: "Call session not found." }, { status: 404 });

  const retell = getRetellClient();
  if (retell && call.provider === "RETELL" && call.providerCallId) {
    await retell.call.stop(call.providerCallId).catch(() => undefined);
  }

  await updateStoredCall(call.id, "ENDED");
  await logCompliance({
    callSessionId: call.id,
    phone: call.callerPhone,
    eventType: "CALL_END",
    details: {
      provider: call.provider,
      provider_call_id: call.providerCallId
    }
  });

  return NextResponse.json({ ok: true });
}
