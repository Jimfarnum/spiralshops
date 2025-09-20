import fetch from 'node-fetch';

const URL = process.env.CLOUDANT_URL!;
const APIKEY = process.env.CLOUDANT_APIKEY!;
const DB = process.env.CLOUDANT_DBNAME!;

if (!URL?.startsWith('https://')) {
  console.warn('[Cloudant] CLOUDANT_URL should start with https:// but is misconfigured');
}

const BASE = `${URL.replace(/\/$/,'')}/${encodeURIComponent(DB)}`;
const AUTH = 'Basic ' + Buffer.from('apikey:' + APIKEY).toString('base64');

async function sleep(ms:number){ return new Promise(r=>setTimeout(r,ms)); }

async function req(path:string, init:RequestInit, tries=3){
  let last:any;
  for (let i=0;i<tries;i++){
    try{
      const res = await fetch(BASE+path, {
        ...init,
        headers: {
          'Authorization': AUTH,
          ...(init.headers||{}),
        },
      } as any);
      if (!res.ok) {
        const t = await res.text().catch(()=> '');
        throw new Error(`Cloudant ${res.status}: ${t}`);
      }
      const ct = res.headers.get('content-type')||'';
      return ct.includes('application/json') ? res.json() : res.text();
    }catch(e){
      last = e; if (i<tries-1) await sleep(300*(i+1));
    }
  }
  throw last;
}

export async function cfind(body:any){ 
  return req('/_find', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }); 
}
export async function cgetDoc(id:string){
  return req('/'+encodeURIComponent(id), { method:'GET' });
}
export async function cputDoc(doc:any){
  return req('/'+encodeURIComponent(doc._id), { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(doc) });
}
export async function cpostDoc(doc:any){
  return req('/', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(doc) });
}
export async function cdelete(id:string, rev:string){
  return req('/'+encodeURIComponent(id)+'?rev='+encodeURIComponent(rev), { method:'DELETE' });
}