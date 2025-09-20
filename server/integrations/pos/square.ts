export async function syncSquareInventory(retailerId: string) {
  // TODO: real Square SDK; placeholder for now
  return { ok:true, retailerId, source:"square", synced: true, items: 120 };
}