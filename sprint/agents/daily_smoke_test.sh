#!/usr/bin/env bash
set -e
TS="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="sprint/logs/smoke-test-${TS}.txt"
mkdir -p sprint/logs

echo "SPIRAL Daily Smoke Test - ${TS}" > "${LOG_FILE}"
echo "=================================" >> "${LOG_FILE}"

PASS=1
check_endpoint() {
  local url="$1"
  local name="$2"
  if curl -fsS "$url" >/dev/null 2>&1; then
    echo "✅ PASS: ${name} (${url})" >> "${LOG_FILE}"
  else
    echo "❌ FAIL: ${name} (${url})" >> "${LOG_FILE}"
    PASS=0
  fi
}

check_endpoint "http://localhost:5000/api/check" "Health Check"
check_endpoint "http://localhost:5000/api/products" "Products API"
check_endpoint "http://localhost:5000/api/stores" "Stores API"
check_endpoint "http://localhost:5000/api/promotions" "Promotions API"

if [ $PASS -eq 1 ]; then
  echo "✅ OVERALL: PASS - All endpoints responding" >> "${LOG_FILE}"
else
  echo "❌ OVERALL: FAIL - Some endpoints down" >> "${LOG_FILE}"
fi

echo "Test completed: ${TS}" >> "${LOG_FILE}"
cat "${LOG_FILE}"
