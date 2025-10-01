#!/bin/bash
# SPIRAL Navigation Audit Runner
# This script provides npm-style command access to the navigation audit

echo "🚀 Running SPIRAL Navigation Audit..."
node scripts/nav_audit_simple.mjs
echo ""
echo "📄 View latest reports in docs/reports/"
echo "🔍 To run manually: node scripts/nav_audit_simple.mjs"