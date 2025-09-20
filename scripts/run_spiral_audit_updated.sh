#!/bin/bash
# Updated SPIRAL audit script with enhanced features
# Run this to generate the latest audit reports

set -euo pipefail

echo "Running updated SPIRAL Site Audit & Optimization Report generator..."

# Copy the latest version from attached assets
cp attached_assets/Pasted--SPIRAL-Site-Audi-1755524896333_1755524896335.txt /tmp/spiral_audit_latest.sh

# Make it executable and run
chmod +x /tmp/spiral_audit_latest.sh

# Execute the audit generation
bash /tmp/spiral_audit_latest.sh

echo "✅ Updated SPIRAL audit reports generated successfully"
echo "Reports available in docs/reports/"
ls -la docs/reports/ | tail -5