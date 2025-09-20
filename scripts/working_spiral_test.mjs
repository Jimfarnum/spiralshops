const BASE = process.env.BASE || 'https://27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev';
let pass=0, fail=0; const out=[];
const ok=(n,c,d='')=>{ c?(pass++,out.push(`✅ ${n}`)):(fail++,out.push(`❌ ${n}${d?` — ${d}`:''}`)) };
const j=async r=>{ const t=await r.text(); try{return JSON.parse(t)}catch{throw new Error('Invalid JSON: '+t.slice(0,100))} };

(async()=>{
  try{
    // Core health check
    let r=await fetch(`${BASE}/api/health`); ok('GET /api/health', r.ok); 
    let d=await j(r); ok('health status healthy', d?.data?.status==='healthy');
    
    // Product listings
    r=await fetch(`${BASE}/api/products/featured`); ok('GET /api/products/featured', r.ok); 
    d=await j(r); ok('products array returned', Array.isArray(d?.products) && d.products.length > 0);
    ok('product has required fields', d?.products[0]?.name && d?.products[0]?.price);
    
    // Store directory
    r=await fetch(`${BASE}/api/stores`); ok('GET /api/stores', r.ok); 
    d=await j(r); ok('stores data returned', d?.data?.stores && Array.isArray(d.data.stores));
    ok('store has required fields', d?.data?.stores[0]?.name && d?.data?.stores[0]?.address);
    
    // Promotions
    r=await fetch(`${BASE}/api/promotions`); ok('GET /api/promotions', r.ok); 
    d=await j(r); ok('promotions array returned', Array.isArray(d?.promotions));
    
    // Mall events
    r=await fetch(`${BASE}/api/mall-events`); ok('GET /api/mall-events', r.ok); 
    d=await j(r); ok('events array returned', Array.isArray(d?.events));
    
    // AI recommendations
    r=await fetch(`${BASE}/api/recommend?context=homepage&limit=5`); ok('GET /api/recommend', r.ok); 
    d=await j(r); ok('recommendations returned', d?.data?.recommendations);
    
    // Admin features
    r=await fetch(`${BASE}/api/admin/system-status`); ok('GET /api/admin/system-status', r.ok || r.status === 401); // 401 is fine for auth-protected
    
    // Authentication check
    r=await fetch(`${BASE}/api/auth/check-username?username=testuser`); ok('GET /api/auth/check-username', r.ok);
    
    // Support system
    r=await fetch(`${BASE}/api/support/faq`); ok('GET /api/support/faq', r.ok);
    
  }catch(e){ fail++; out.push('❌ Exception: '+(e?.message||e)); }
  finally{ 
    out.forEach(l=>console.log(l)); 
    console.log(`\n🎯 SPIRAL API Test Summary: ${pass} passed, ${fail} failed, ${pass+fail} total.`);
    console.log(`📊 Success Rate: ${Math.round((pass/(pass+fail))*100)}%`);
    if(fail>0) process.exit(1); 
  }
})();
