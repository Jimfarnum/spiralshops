import { cfind } from '../utils/cloudantCore.js';
import { getSpiralsBalance } from './spiralsService.js';

export async function getShopperProfile(userId: string){
  const res = await cfind({
    selector: { type:'shopper', userId },
    limit: 1
  });
  const profile = res.docs?.[0] || { userId, type:'shopper', created_at: new Date().toISOString() };
  const spirals = await getSpiralsBalance(userId);
  return { profile, spirals };
}

export async function getShopperOrders(userId: string, limit=50){
  const res = await cfind({
    selector: { type:'order', userId },
    sort: [{ created_at: 'desc' }],
    limit
  });
  return { orders: res.docs || [] };
}