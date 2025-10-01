const BASE = process.env.BASE || `http://localhost:${process.env.PORT||4000}`;
let pass=0, fail=0; const out=[];
const ok=(n,c,d='')=>{ c?(pass++,out.push(`✅ ${n}`)):(fail++,out.push(`❌ ${n}${d?` — ${d}`:''}`)) };
const j=async r=>{ const t=await r.text(); try{return JSON.parse(t)}catch{throw new Error('Invalid JSON: '+t.slice(0,200))} };
(async()=>{
  try{
    let r=await fetch(`${BASE}/api/health`); ok('GET /api/health', r.ok); let d=await j(r); ok('health ok:true', d?.ok===true);
    r=await fetch(`${BASE}/api/retailers/onboarding/questions`); ok('GET onboarding', r.ok); d=await j(r); ok('has shipping_free_us', JSON.stringify(d).includes('shipping_free_us'));
    r=await fetch(`${BASE}/api/discounts/tier?volume=75000000`); ok('GET discounts/tier', r.ok); d=await j(r); ok('tier >=2', d && (d.tier===2 || d.tier===3));
    r=await fetch(`${BASE}/api/discounts/apply`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subtotal:100,shippingBase:8,annualVolumeUSD:75000000,parcelsPerMonth:20000,coupon:{type:'percent',value:10}})}); ok('POST discounts/apply', r.ok); d=await j(r); ok('total numeric', typeof d.total==='number');
    r=await fetch(`${BASE}/api/shipping/quote`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destinationZip:'55101',weightOz:16,speed:'standard',mode:'outbound'})}); ok('POST shipping/quote', r.ok); d=await j(r); ok('quote has carrier & cost', !!d.carrierChosen && typeof d.cost==='number');
    r=await fetch(`${BASE}/api/agents`); ok('GET agents', r.ok); const a=await j(r); ok('has shoppingLogistics', Array.isArray(a)&&a.includes('shoppingLogistics'));
    r=await fetch(`${BASE}/api/agents/run`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'shoppingLogistics'})}); ok('POST agents/run', r.ok); d=await j(r); ok('agent run ok', d?.ok===true);
    r=await fetch(`${BASE}/api/partnerships/upsert`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({partner:'FedEx',type:'logistics',tiers:[{label:'Tier 1',minVolume:0,maxVolume:10000,discountPct:10},{label:'Tier 2',minVolume:10000,maxVolume:100000,discountPct:20},{label:'Tier 3',minVolume:100000,discountPct:35}]})}); ok('POST partnerships/upsert', r.ok);
    r=await fetch(`${BASE}/api/partnerships/get?type=logistics&partner=FedEx`); ok('GET partnerships/get', r.ok); d=await j(r); ok('get tiers', Array.isArray(d?.tiers)&&d.tiers.length>0);
    r=await fetch(`${BASE}/api/retailers/apply`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({business_name:'SelfTest Boutique',categories:['apparel'],shipping_free_us:true,contact:{name:'Alex QA',email:'alex.qa@example.com'}})}); ok('POST retailers/apply', r.ok);
    r=await fetch(`${BASE}/api/malls/apply`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mall_name:'SelfTest Galleria',city:'Minneapolis',state:'MN',contact:{name:'Ops QA',email:'ops.qa@example.com'},wants_spiral_center:true})}); ok('POST malls/apply', r.ok);
    r=await fetch(`${BASE}/api/orders`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({retailerId:'ret_selftest',items:[{sku:'SKU1',name:'Demo',qty:1,price:25}],subtotal:25,shippingFee:5,shippingAddress:{name:'Jane',line1:'1 Main',city:'City',state:'NY',zip:'10001'},mode:'ship'})}); ok('POST orders', r.ok); d=await j(r); const orderId=d?.id; ok('order id', !!orderId);
    r=await fetch(`${BASE}/api/shipments`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId,carrier:'USPS',tracking:'TRKSELFTEST'})}); ok('POST shipments', r.ok);
    r=await fetch(`${BASE}/api/shipments/track`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tracking:'TRKSELFTEST'})}); ok('POST shipments/track', r.ok); d=await j(r); ok('track status', typeof d.status==='string');
  }catch(e){ fail++; out.push('❌ Exception: '+(e?.message||e)); }
  finally{ out.forEach(l=>console.log(l)); console.log(`\nSummary: ${pass} passed, ${fail} failed, ${pass+fail} total.`); if(fail>0) process.exit(1); }
})();
