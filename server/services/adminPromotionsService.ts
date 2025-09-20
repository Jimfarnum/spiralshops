import { cpostDoc, cfind } from '../utils/cloudantCore.js';

export interface CreatePromoInput {
  name: string;
  multiplier: number; // e.g., 5 for 5x
  starts_at: string;
  ends_at: string;
  scope: 'global'|'mall'|'retailer';
  mallId?: string;
  retailerId?: string;
}

export async function createPromo(input: CreatePromoInput){
  const doc = {
    _id: `promo_${Date.now()}`,
    type: 'spirals_promo',
    ...input,
    created_at: new Date().toISOString(),
    status: 'pending' // must be approved by SPIRAL admin
  };
  await cpostDoc(doc);
  return { ok:true, id: doc._id };
}

export async function listPromos(limit=50){
  const res = await cfind({ selector: { type:'spirals_promo' }, sort:[{created_at:'desc'}], limit });
  return { promos: res.docs || [] };
}

export async function approvePromo(id:string){
  // In production, fetch + update with _rev. Here we create an approval event doc (immutable log).
  const doc = { _id:`promo_approval_${id}_${Date.now()}`, type:'promo_approval', promoId:id, approved_by:'admin', approved_at:new Date().toISOString() };
  await cpostDoc(doc);
  return { ok:true };
}