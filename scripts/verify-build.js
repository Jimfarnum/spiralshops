import { statSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const DIST_DIR = "dist";
const SERVER_ENTRY = join(DIST_DIR, "index.js");
const PUBLIC_DIR = join(DIST_DIR, "public");

function fail(msg) { console.error("❌", msg); process.exit(1); }
function ok(msg) { console.log("✅", msg); }

if (!existsSync(DIST_DIR)) fail("dist/ folder not found. Did build run?");
if (!existsSync(SERVER_ENTRY)) fail("dist/index.js not found.");
const size = statSync(SERVER_ENTRY).size;
if (size < 1024) fail(`dist/index.js too small (${size} bytes)`);

ok(`Server entry present (${(size/1024).toFixed(0)} KB)`);

if (!existsSync(PUBLIC_DIR)) fail("dist/public missing");
const assets = readdirSync(PUBLIC_DIR);
if (!assets.length) fail("dist/public is empty");
ok(`Client assets present: ${assets.length} files`);

const commit = execSync("git rev-parse --short HEAD").toString().trim();
const stamp = new Date().toISOString();
writeFileSync(join(DIST_DIR, "version.json"), JSON.stringify({ commit, stamp }, null, 2));
ok(`Version file written: commit ${commit}, time ${stamp}`);

console.log("🎉 Build verification passed");