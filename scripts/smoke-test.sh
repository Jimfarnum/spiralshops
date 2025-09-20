#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   bash scripts/smoke-test.sh                 # uses https://spiralshops.com
#   BASE_URL=http://localhost:5000 bash scripts/smoke-test.sh
#   bash scripts/smoke-test.sh https://your-custom-domain.com
#
BASE_URL="${1:-${BASE_URL:-https://spiralshops.com}}"

GREEN="\033[32m"; RED="\033[31m"; YELLOW="\033[33m"; NC="\033[0m"
pass() { echo -e "${GREEN}PASS${NC}  $*"; }
fail() { echo -e "${RED}FAIL${NC}  $*"; FAILED=1; }
warn() { echo -e "${YELLOW}WARN${NC}  $*"; }

curl_json () {
  local method="$1"; shift
  local url="$1"; shift
  local data="${1:-}"
  local tmp="$(mktemp)"
  local code

  if [[ -n "$data" ]]; then
    code=$(curl -sS -o "$tmp" -w "%{http_code}" -H "Content-Type: application/json" -X "$method" "$url" --data "$data" || echo "000")
  else
    code=$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "$url" || echo "000")
  fi

  echo "$code" "$tmp"
}

check_json_contains () {
  local file="$1"; shift
  local needle="$1"; shift
  grep -qi -- "$needle" "$file"
}

FAILED=0
echo "🔎 Running SPIRAL smoke tests against: $BASE_URL"
echo "-----------------------------------------------"

# 1) Health
read -r code file < <(curl_json GET "$BASE_URL/health")
[[ "$code" =~ ^2 ]] && pass "/health HTTP $code" || fail "/health HTTP $code"
rm -f "$file"

# 2) Admin health KPIs
read -r code file < <(curl_json GET "$BASE_URL/api/admin/health")
if [[ "$code" =~ ^2 ]] && check_json_contains "$file" "search_p95_ms"; then
  pass "/api/admin/health HTTP $code & KPI keys present"
else
  fail "/api/admin/health HTTP $code or missing KPI keys"
fi
rm -f "$file"

# 3) Function Agent demo trigger (enabled = 200 OK, disabled = 410 Gone)
read -r code file < <(curl_json POST "$BASE_URL/api/function-agent/run")
if [[ "$code" == "200" ]] && (check_json_contains "$file" '"ok": true'); then
  pass "Function Agent enabled (200)"
elif [[ "$code" == "410" ]] && (check_json_contains "$file" 'disabled.*true'); then
  pass "Function Agent disabled (410)"
else
  fail "Function Agent endpoint unexpected response (HTTP $code)"
fi
rm -f "$file"

# 4) Cart reminder (example endpoint)
read -r code file < <(curl_json POST "$BASE_URL/api/cart/remind" '{"userId":"demo","cartId":"cart_demo"}')
if [[ "$code" =~ ^2 ]] && (check_json_contains "$file" "queued" || check_json_contains "$file" "reminder"); then
  pass "Cart reminder /api/cart/remind"
else
  warn "Cart reminder /api/cart/remind (HTTP $code) – optional if not wired yet"
fi
rm -f "$file"

# 5) SPA routes render (HTML presence checks)
check_html () {
  local path="$1"; shift
  local expect="$1"; shift
  local tmp="$(mktemp)"
  local code
  code=$(curl -sS -o "$tmp" -w "%{http_code}" "$BASE_URL$path" || echo "000")
  if [[ "$code" =~ ^2|^3 ]] && grep -qi -- "$expect" "$tmp"; then
    pass "Page $path (contains '$expect')"
  else
    fail "Page $path (HTTP $code or missing '$expect')"
  fi
  rm -f "$tmp"
}

check_html "/" "SPIRAL"
check_html "/spiral-admin-login" "SPIRAL Admin"
check_html "/admin" "Admin Dashboard"
check_html "/function-agent" "Function Agent"
check_html "/demo" "Demo"

# ---- Additional core API checks ----
read -r code _ < <(curl_json GET "$BASE_URL/api/version")
[[ "$code" =~ ^2 ]] && pass "/api/version" || fail "/api/version (HTTP $code)"

read -r code _ < <(curl_json GET "$BASE_URL/api/products")
[[ "$code" =~ ^2 ]] && pass "/api/products" || fail "/api/products (HTTP $code)"

read -r code _ < <(curl_json GET "$BASE_URL/api/stores")
[[ "$code" =~ ^2 ]] && pass "/api/stores" || fail "/api/stores (HTTP $code)"

echo "-----------------------------------------------"
if [[ "${FAILED:-0}" -ne 0 ]]; then
  echo -e "${RED}❌ Smoke tests found issues. See failures above.${NC}"
  exit 1
else
  echo -e "${GREEN}✅ All smoke tests passed.${NC}"
fi