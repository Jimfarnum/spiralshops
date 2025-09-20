#!/bin/bash
# =============================================================================
# SPIRAL — Site Audit & Optimization Report (Replit one-shot generator)
# Paste this entire block into the Replit Shell and press Enter.
# It will create a complete, versioned report set you can share with investors,
# engineers, and onboarding teams.
# Outputs:
#   docs/reports/spiral_site_audit_<DATE>.md      (human-readable report)
#   docs/reports/spiral_site_audit_<DATE>.json    (structured for agents/automation)
#   docs/reports/spiral_site_todo_<DATE>.md       (actionable checklist)
#   docs/reports/spiral_site_audit_<DATE>.html    (lightweight HTML view)
# Then commits them to git with a clear message.
# =============================================================================

set -euo pipefail

ts="$(date +%Y-%m-%d)"
stamp="$(date +%Y%m%d-%H%M%S)"
out_dir="docs/reports"
mkdir -p "$out_dir"

md="$out_dir/spiral_site_audit_${stamp}.md"
json="$out_dir/spiral_site_audit_${stamp}.json"
todo="$out_dir/spiral_site_todo_${stamp}.md"
html="$out_dir/spiral_site_audit_${stamp}.html"

# -----------------------------
# 1) Markdown Report
# -----------------------------
cat > "$md" <<'EOF'
# SPIRAL Site Audit & Optimization Plan
Date: {{DATE}}

## Executive Summary
SPIRAL (spiralshops.com) is positioned as a **local-first retail platform** for all shops and malls. To compete head-to-head with Amazon/Shopify/Target/Walmart, the site needs (a) **trust parity** features (guarantees, reviews, returns clarity), (b) **frictionless onboarding** for retailers/malls and shoppers, (c) **unified multi-merchant checkout**, and (d) **AI-driven personalization and growth loops**. This report outlines gaps, a 90-day action plan, AI tooling, and required APIs.

---

## Current Snapshot (high level)
- Domain live and reachable.
- Concept/brand: Local-first, shop & mall friendly.
- Platform goal: One cart across shops/malls, same-day pickup, 5-minute returns at kiosks, perks/loyalty.

> Note: Screenshots & large artifacts from TechWatch/Funnel modules should not be stored in-repo to preserve reliability of Replit checkpoints.

---

## Gaps Identified

### A) Retailer & Mall Offering
- **POS integrations** missing or limited (Square, Lightspeed, Clover).
- **Retailer analytics** (conversion, repeat %, cart analytics) not deep enough.
- **Mall operator dashboard** (aggregate sales, traffic, promotions) needed.

### B) Shopper Experience
- **Unified cart/checkout** must be < 3 steps with wallets by default.
- **Real-time inventory sync** essential for pickup confidence.
- **Trust surfaces**: visible buyer guarantee, verified shop badges, return promise.
- **Reviews engine**: local-first reviews to build credibility.
- **Discovery/personalization**: "Explore your mall" feed, recs by preference & behavior.
- **Payments variety**: Apple/Google Pay, PayPal; BNPL (Phase 2); gift cards/credits.

### C) Growth & Marketing
- **SEO/Schema**: metadata, sitemaps, structured data.
- **Content engine**: "Local-first" blog/stories; retailer/mall case studies.
- **Lifecycle messaging**: email/SMS for welcome, abandoned cart, pickup reminders, re-order nudges.
- **Referral loops**: retailer-led invites + shopper referrals.

### D) Performance, Security, Accessibility
- **Speed**: CDN, lazy-load, image compression.
- **Accessibility**: WCAG 2.1 AA practices, semantic HTML, ARIA.
- **Security**: Ongoing ZAP, Snyk, npm audit, Newman suites; CSP/headers; rate limiting.
- **Observability**: GA4/Amplitude/Mixpanel funnels; Sentry errors.

---

## 90-Day Plan (Phased)

### Phase 1 (Days 0–30) — Trust & Friction Elimination
- **Unified Checkout (MVP)**: cart → pay → pickup code; Apple/Google/PayPal wallets.
- **Trust Layer**: SPIRAL Buyer Guarantee, Verified Local badge on PDP/checkout.
- **Returns**: "5-minute kiosk returns" copy + flow visuals on PDP/cart/receipt.
- **Analytics/Monitoring**: GA4, Sentry; basic retailer analytics dashboard (orders, CVR, repeat %, AOV).
- **SEO Foundations**: meta tags, open graph, sitemap.xml, robots.txt, schema markup.

**KPIs**: CVR +6–12%, abandoned cart –8–15%, pickup adoption rate baseline, refund turnaround < 24h.

### Phase 2 (Days 31–60) — Personalization & Lifecycle
- **Shopper Onboarding**: preferences, wallet/rewards (Local Hero v0).
- **Recommendations/Discovery**: "Explore your mall" AI feed; "Add from another shop" cross-sell.
- **Lifecycle Journeys**: welcome → abandoned cart (T+1h/T+24h) → pickup reminders → re-order bundles.
- **Reviews Engine**: seed first 50–100 reviews per mall/retailer with incentives.

**KPIs**: AOV +5–10%, repeat rate +10–15%, review coverage 50+ per mall.

### Phase 3 (Days 61–90) — Scale & Differentiation
- **Mall Command Center**: promotions, revenue shares, foot traffic and sales reporting.
- **POS Integrations**: Square, Clover, Lightspeed (inventory, pricing, orders).
- **Loyalty/Perks**: Local Hero (parking credits, food court credits, pickup perks).
- **BNPL & Gift Cards**: Affirm/Klarna integration + SPIRAL credits.
- **Public Trust Dashboard**: uptime, order success %, refund SLA, ready-by SLA.

**KPIs**: Repeat 30d +15–20%, pickup-ready-on-time > 95%, trust survey ≥ 70% "trust SPIRAL".

---

## AI Tools to Add (Ops + Marketing + UX)

**Operations & Product**
- **AI Onboarding Assistant (Retailers/Malls)**: step-by-step setup, POS linking, catalog checks.
- **AI Shopper Concierge**: search, Q&A, guided shopping ("pick up today" focus).
- **AI Funnel Optimizer**: automated A/B tests for headlines, CTAs, layouts.
- **Anomaly/Fraud Detection**: login/payment anomalies; policy abuse monitoring.

**Marketing & Content**
- **AI Copywriter**: product descriptions, meta, promo banners.
- **AI Personalization**: recs by behavior, preferences, locality.
- **AI R&D Watcher**: continuous tech scan + INITIATE tickets (already live).

---

## Required APIs & Providers (Recommended)

**Payments/Checkout**
- **Stripe** (cards, wallets, future subscriptions), **PayPal**, (Phase 2) **Affirm/Klarna** for BNPL.

**POS & Catalog**
- **Square POS**, **Clover**, **Lightspeed** (inventory/pricing/orders).
- **Shopify/WooCommerce** import APIs for migration.

**Comms & Maps**
- **SendGrid/Mailgun** (email), **Twilio** (SMS), **Google Maps** (store locator, kiosk directions).

**Analytics/Monitoring/Security**
- **GA4 + Amplitude/Mixpanel**, **Sentry**, **ZAP/Snyk/npm audit/Newman** (pipelines).

---

## Security & Compliance
- CSP, HSTS, secure cookies; rate-limits on auth/APIs.
- Daily checks: ZAP, Snyk, npm audit, Newman tests; triage → ticketing.
- PII minimization; secrets in Replit Secrets; rotate tokens; least privilege.

---

## Implementation Notes (Replit Hygiene)
- Exclude heavy artifacts from repo: `agents/techwatch/reports/*/shots/`, `agents/funnels/out/*/shots/`, `node_modules/`, build outputs.
- Keep **clean export** path for checkpoints; consider external storage (S3) for screenshots.

---

## Success Criteria (90 Days)
- Phase 1 trust surfaces shipped and visible; **CVR uplift ≥ 6%**.
- Phase 2 personalization + reviews live; **repeat rate +10–15%**.
- Phase 3 mall dashboards + POS integrations piloted; **pickup on-time ≥ 95%**.
- Public trust page (radical transparency) published.

---

*Prepared for SPIRAL leadership, onboarding, engineering, and investor relations. Adapt this plan to your live data and mall/shop mix.*
EOF

# Replace placeholder date
sed -i "s/{{DATE}}/$ts/" "$md"

# -----------------------------
# 2) JSON (Structured for agents)
# -----------------------------
cat > "$json" <<'EOF'
{
  "meta": {
    "report": "SPIRAL Site Audit & Optimization Plan",
    "date": "{{DATE}}",
    "version": "1.0"
  },
  "gaps": {
    "retailer_mall": ["pos_integrations", "retailer_analytics_basic", "mall_operator_dashboard"],
    "shopper": ["unified_checkout_lt3_steps", "realtime_inventory_sync", "trust_surfaces", "reviews_engine", "personalization_discovery", "payments_variety"],
    "growth_marketing": ["seo_schema", "content_engine", "lifecycle_messaging", "referral_loops"],
    "platform": ["performance_speed", "accessibility", "security_pipeline", "observability"]
  },
  "plan_90d": {
    "phase_1": {
      "focus": "trust_and_friction",
      "items": ["unified_checkout_mvp", "buyer_guarantee", "verified_local_badge", "returns_copy_flow", "analytics_ga4_sentry", "seo_foundations"],
      "kpi_targets": {"cvr_delta_pct": 6, "abandon_delta_pct": -8, "refund_sla_hours": 24}
    },
    "phase_2": {
      "focus": "personalization_and_lifecycle",
      "items": ["shopper_onboarding_wallet", "recs_explore_mall", "email_sms_journeys", "reviews_seeding"],
      "kpi_targets": {"aov_delta_pct": 5, "repeat_rate_delta_pct": 10, "reviews_per_mall_min": 50}
    },
    "phase_3": {
      "focus": "scale_and_differentiation",
      "items": ["mall_command_center", "pos_integrations_square_clover_lightspeed", "loyalty_local_hero", "bnpl_giftcards", "public_trust_dashboard"],
      "kpi_targets": {"repeat_30d_delta_pct": 15, "pickup_on_time_pct": 95, "trust_survey_agree_pct": 70}
    }
  },
  "ai_tools": {
    "ops_product": ["ai_onboarding_assistant", "ai_shopper_concierge", "ai_funnel_optimizer", "anomaly_fraud_detection"],
    "marketing_content": ["ai_copywriter", "ai_personalization", "ai_rnd_watcher"]
  },
  "apis": {
    "payments": ["stripe", "paypal", "affirm_klarna_phase2"],
    "pos_catalog": ["square_pos", "clover", "lightspeed", "shopify_import", "woocommerce_import"],
    "comms_maps": ["sendgrid_mailgun", "twilio", "google_maps"],
    "analytics_security": ["ga4", "amplitude_mixpanel", "sentry", "zap", "snyk", "npm_audit", "newman"]
  },
  "security": {
    "headers": ["csp", "hsts", "secure_cookies"],
    "ops": ["rate_limits", "daily_security_scans", "ticket_triage"],
    "privacy": ["pii_minimization", "secrets_in_vault", "token_rotation"]
  },
  "hygiene": {
    "ignore_paths": [
      "agents/techwatch/reports/*/shots/",
      "agents/funnels/out/*/shots/",
      "node_modules/",
      "dist/",
      "build/",
      ".cache/",
      ".tmp/",
      ".turbo/",
      ".next/"
    ]
  }
}
EOF

sed -i "s/{{DATE}}/$ts/" "$json"

# -----------------------------
# 3) Actionable Checklist (To-Do)
# -----------------------------
cat > "$todo" <<'EOF'
# SPIRAL Site Optimization — Action Checklist

## Phase 1 (Days 0–30) — Trust & Friction
- [ ] Unified Checkout (<3 steps) with Apple/Google/PayPal
- [ ] SPIRAL Buyer Guarantee visible on PDP/Cart/Checkout
- [ ] Verified Local Shop badge (PDP + Checkout)
- [ ] Returns UX: "5-minute kiosk returns" copy + flow visual
- [ ] GA4 + Sentry live; basic retailer analytics (CVR, repeat, AOV)
- [ ] SEO foundations: meta, OpenGraph, sitemap.xml, robots.txt, schema

## Phase 2 (Days 31–60) — Personalization & Lifecycle
- [ ] Shopper onboarding with preferences + wallet/rewards (Local Hero v0)
- [ ] Recommender & Explore-your-mall feed
- [ ] Lifecycle email/SMS: welcome, abandoned cart (T+1h/T+24h), pickup reminders, re-order bundles
- [ ] Seed first 50–100 reviews per mall/retailer

## Phase 3 (Days 61–90) — Scale & Differentiation
- [ ] Mall Command Center (promotions, revenue shares, analytics)
- [ ] POS integrations: Square, Clover, Lightspeed
- [ ] Loyalty: Local Hero (parking credits, food court credits, pickup perks)
- [ ] BNPL + Gift Cards/Credits
- [ ] Public Trust Dashboard (uptime, success %, refund SLA, ready-by SLA)

## Security & Hygiene (Ongoing)
- [ ] Daily: ZAP, Snyk, npm audit, Newman → triage → tickets
- [ ] Rate limits; CSP/HSTS; secure cookies
- [ ] Ignore heavy artifacts in repo (screenshots/build)
EOF

# -----------------------------
# 4) Lightweight HTML version
# -----------------------------
# Install markdown if not available
if ! command -v python3 &> /dev/null || ! python3 -c "import markdown" &> /dev/null; then
    echo "Installing python markdown module..."
    pip3 install markdown --quiet 2>/dev/null || echo "Note: markdown module not available"
fi

# Generate HTML with Python
SPIRAL_MD_PATH="$md" python3 - <<'PY' "$md" > "$html"
import sys
try:
    import markdown
    md_path = sys.argv[1]
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()
    html = markdown.markdown(content, extensions=["extra","toc"])
    print(f"""<!doctype html>
<html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>SPIRAL Site Audit</title>
<style>body{{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem;line-height:1.5}} pre,code{{background:#f6f8fa;padding:.2rem .4rem;border-radius:6px}} h1,h2,h3{{color:#1e293b}} ul{{margin:1rem 0}} li{{margin:0.25rem 0}}</style>
</head><body>
{html}
</body></html>""")
except ImportError:
    # Fallback without markdown processing
    md_path = sys.argv[1]
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read().replace('<', '&lt;').replace('>', '&gt;')
    print(f"""<!doctype html>
<html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>SPIRAL Site Audit</title>
<style>body{{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem;line-height:1.5}} pre{{background:#f6f8fa;padding:1rem;border-radius:6px;white-space:pre-wrap}}</style>
</head><body>
<pre>{content}</pre>
</body></html>""")
PY

# -----------------------------
# 5) Git snapshot
# -----------------------------
if [ ! -d .git ]; then git init >/dev/null 2>&1 || true; fi
git add "$md" "$json" "$todo" "$html" >/dev/null 2>&1 || true
git commit -m "Report: SPIRAL site audit & optimization plan (${ts})" >/dev/null 2>&1 || true

# -----------------------------
# 6) Output summary
# -----------------------------
echo
echo "==> Report files created:"
ls -lh "$md" "$json" "$todo" "$html" | sed 's/^/   /'
echo
echo "Open markdown: $md"
echo "Open HTML:     $html"
echo
echo "Next:"
echo "  • Share the HTML with investors/stakeholders."
echo "  • Work the checklist in $todo."
echo "  • Feed the JSON into your AI Ops/TechWatch to auto-create INITIATE tickets."