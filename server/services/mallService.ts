import { cfind } from '../utils/cloudantCore.js';

export async function listMalls(limit=50){
  const res = await cfind({
    selector: { type:'mall', active: true },
    fields:['_id','name','city','state','hero_image','stats'],
    limit
  });
  return { malls: (res as any).docs || [] };
}

export async function listMallStores(mallId: string, limit=100){
  const res = await cfind({
    selector: { type:'store', mallId, active: true },
    fields:['_id','name','retailerId','category','hours','image'],
    limit
  }).catch(()=>({docs:[]}));
  return { stores: (res as any).docs || [] };
}

export async function listMallEvents(mallId: string, limit=50){
  const res = await cfind({
    selector: { type:'mall_event', mallId, active: true },
    sort: [{ starts_at: 'asc' }],
    limit
  }).catch(()=>({docs:[]}));
  return { events: (res as any).docs || [] };
}

export async function getMallDashboard(mallId: string){
  try {
    // Get mall stores
    const storesRes = await listMallStores(mallId);
    
    // Get mall events  
    const eventsRes = await listMallEvents(mallId);
    
    // Get analytics (simplified for demo - could be enhanced with real data)
    const analyticsRes = await cfind({
      selector: { type:'mall_analytics', mallId },
      fields: ['visitors', 'sales', 'stores_count', 'events_count'],
      limit: 1
    }).catch(()=>({docs:[]}));
    
    const analytics = (analyticsRes as any).docs?.[0] || {
      visitors: Math.floor(Math.random() * 10000) + 5000, // Demo data
      sales: Math.floor(Math.random() * 100000) + 50000,
      stores_count: storesRes.stores.length,
      events_count: eventsRes.events.length
    };
    
    return {
      mallId,
      dashboard: {
        stores: storesRes.stores,
        events: eventsRes.events,
        analytics
      }
    };
  } catch (error: any) {
    // Graceful fallback if database is down
    return {
      mallId,
      dashboard: {
        stores: [],
        events: [],
        analytics: {
          visitors: 7500,
          sales: 75000,
          stores_count: 0,
          events_count: 0
        }
      }
    };
  }
}