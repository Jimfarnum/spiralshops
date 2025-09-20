export async function syncLightspeedInventory(retailerId: string) {
  // TODO: real Lightspeed SDK; placeholder for now
  return { ok:true, retailerId, source:"lightspeed", synced: true, items: 85 };
}