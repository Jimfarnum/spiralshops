export async function verifyPresence({ name, address }) {
  // In production, plug IBM Watson Discovery or your business registry checks.
  // Here, simple heuristic: name + address exist → weak positive.
  const ok = !!(name && address);
  return {
    onlinePresenceFound: ok,
    signals: ok ? ["self-declared-address"] : []
  };
}