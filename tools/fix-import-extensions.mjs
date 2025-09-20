import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// flags
const WRITE = process.argv.includes('--write');
const VERBOSE = process.argv.includes('--verbose');

// collect --dir flags (default to 'server' if none given)
const dirFlags = [];
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--dir' && process.argv[i+1]) {
    dirFlags.push(process.argv[i+1]);
    i++;
  }
}
const ROOTS = (dirFlags.length ? dirFlags : ['server']).map(d => path.resolve(process.cwd(), d));

const TS_EXTS = ['.ts', '.tsx'];
const JS_EXTS = ['.js', '.mjs', '.cjs'];

function* walk(dir) {
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function isTsFile(p) { return TS_EXTS.includes(path.extname(p)); }
function isRelative(spec) { return spec.startsWith('./') || spec.startsWith('../'); }

function resolveCandidate(importerDir, spec) {
  const asIs = path.resolve(importerDir, spec);
  if (fs.existsSync(asIs) && fs.statSync(asIs).isFile()) return asIs;

  const extInSpec = path.extname(spec);
  if (extInSpec) return asIs;

  const base = path.resolve(importerDir, spec);
  for (const ext of TS_EXTS) { if (fs.existsSync(base + ext)) return base + ext; }
  for (const ext of JS_EXTS) { if (fs.existsSync(base + ext)) return base + ext; }

  for (const ext of TS_EXTS) { const ix = path.join(base, 'index' + ext); if (fs.existsSync(ix)) return ix; }
  for (const ext of JS_EXTS) { const ix = path.join(base, 'index' + ext); if (fs.existsSync(ix)) return ix; }

  return null;
}

const IMPORT_RE = /(^\s*import\s+(?:[^'"]+?\s+from\s+)?|^\s*import\s*\(\s*)['"]([^'"]+)['"]\s*\)?/gm;

function transformFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const importerDir = path.dirname(filePath);

  const out = src.replace(IMPORT_RE, (m, lead, spec) => {
    if (!isRelative(spec)) return m;

    const resolved = resolveCandidate(importerDir, spec);
    if (!resolved) { VERBOSE && console.log(`~ skip unresolved: ${spec} (in ${filePath})`); return m; }

    const targetExt = path.extname(resolved);
    const hasExtInSpec = !!path.extname(spec);
    const isTargetTS = TS_EXTS.includes(targetExt);
    const isTargetJS = JS_EXTS.includes(targetExt);

    let newSpec = spec;

    if (isTargetTS) {
      if (hasExtInSpec) newSpec = spec.slice(0, -path.extname(spec).length);
    } else if (isTargetJS) {
      const specNoExt = hasExtInSpec ? spec.slice(0, -path.extname(spec).length) : spec;
      newSpec = specNoExt + '.js';
    } else {
      return m;
    }

    if (newSpec !== spec) {
      changed = true;
      VERBOSE && console.log(`fix: ${spec} -> ${newSpec}  (${path.relative(process.cwd(), filePath)})`);
      return lead.trim().startsWith('import(') ? `${lead}"${newSpec}")` : `${lead}"${newSpec}"`;
    }
    return m;
  });

  if (changed && WRITE) {
    const backup = filePath + '.' + new Date().toISOString().replace(/[:.]/g,'-') + '.bak';
    fs.copyFileSync(filePath, backup);
    fs.writeFileSync(filePath, out, 'utf8');
  }
  return { changed };
}

let total = 0, modified = 0;
for (const root of ROOTS) {
  for (const p of walk(root)) {
    if (!isTsFile(p)) continue;
    total++;
    const { changed } = transformFile(p);
    if (changed) modified++;
  }
}

console.log(`Scanned ${total} TS files across ${ROOTS.length} dir(s). ${modified} file(s) would be modified.` + (WRITE ? ' (changes written with backups)' : ' (dry-run)'));
