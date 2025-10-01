import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CloudantV1 } from '@ibm-cloud/cloudant';
import csvParse from 'csv-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { CLOUDANT_URL, CLOUDANT_APIKEY, CLOUDANT_DB = 'spiral' } = process.env;
if (!CLOUDANT_URL || !CLOUDANT_APIKEY) {
  console.error('Missing CLOUDANT_URL or CLOUDANT_APIKEY envs.');
  process.exit(1);
}

// Cloudant SDK creates its own authenticator under the hood when using newInstance()
const client = CloudantV1.newInstance({});
client.setServiceUrl(CLOUDANT_URL);

async function ensureDb(db) {
  const dbs = (await client.getAllDbs()).result;
  if (!dbs.includes(db)) {
    await client.putDatabase({ db });
    console.log(`Created DB: ${db}`);
  }
}

function parseCsv(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(csvParse({ columns: true, trim: true }))
      .on('data', (row) => records.push(row))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
}

async function upsertDocs(db, docs, idField) {
  const bulk = docs.map((d) => {
    const _id = d[idField];
    if (typeof d.price === 'string' && d.price !== '') d.price = parseFloat(d.price);
    if (typeof d.stock === 'string' && d.stock !== '') d.stock = parseInt(d.stock, 10);
    if (typeof d.acceptsSpirals === 'string') d.acceptsSpirals = d.acceptsSpirals.toLowerCase() === 'true';
    if (typeof d.lat === 'string' && d.lat !== '') d.lat = parseFloat(d.lat);
    if (typeof d.lng === 'string' && d.lng !== '') d.lng = parseFloat(d.lng);
    return { _id, ...d, updatedAt: new Date().toISOString() };
  });

  const res = await client.postBulkDocs({ db, bulkDocs: { docs: bulk } });
  const results = res.result;
  const errors = results.filter((r) => r.error);
  return { total: bulk.length, errors: errors.length, errorsList: errors.slice(0, 5) };
}

async function main() {
  const retailersCsv = process.argv[2] || path.join(__dirname, '../seed/retailers.csv');
  const productsCsv  = process.argv[3] || path.join(__dirname, '../seed/products.csv');

  await ensureDb(CLOUDANT_DB);

  console.log('Parsing retailers CSV…');
  const retailers = await parseCsv(retailersCsv);
  retailers.forEach((r) => (r.type = 'retailer'));
  const r = await upsertDocs(CLOUDANT_DB, retailers, 'slug');
  console.log(`Retailers upserted: ${r.total}, errors: ${r.errors}`);

  console.log('Parsing products CSV…');
  const products = await parseCsv(productsCsv);
  products.forEach((p) => (p.type = 'product'));
  const p = await upsertDocs(CLOUDANT_DB, products, 'sku');
  console.log(`Products upserted: ${p.total}, errors: ${p.errors}`);

  if (r.errors || p.errors) {
    console.warn('Some upserts had errors:', { retailerErrors: r.errors, productErrors: p.errors });
    console.warn('Examples:', r.errorsList, p.errorsList);
  } else {
    console.log('Seed complete with no errors.');
  }
}

main().catch((e) => { console.error('Seed failed:', e); process.exit(1); });