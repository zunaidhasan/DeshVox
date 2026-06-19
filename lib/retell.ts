import Retell from "retell-sdk";

export function getRetellClient() {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) return null;

  return new Retell({
    apiKey,
    timeout: 20_000,
    maxRetries: 1
  });
}

export function getRetellAgentId() {
  return process.env.RETELL_AGENT_ID;
}
