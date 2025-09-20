// SOAP G Reporting Helper for QR Code Activities
export default async function soapGReport({ agent, action, data }) {
  try {
    // Internal SOAP G endpoint for cross-agent reporting
    const response = await fetch(`${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/api/soap-g/cross-agent-report`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Internal-Request": "true"
      },
      body: JSON.stringify({
        sourceAgent: agent,
        action,
        data,
        timestamp: new Date().toISOString(),
        reportType: 'qr_activity'
      }),
    });

    if (response.ok) {
      console.log(`✅ SOAP G Report: ${agent} -> ${action}`);
    } else {
      console.log(`⚠️ SOAP G Report failed: ${response.status}`);
    }
  } catch (err) {
    console.log("⚠️ SOAP G report error:", err.message);
    // Don't throw - QR functionality should work even if SOAP G reporting fails
  }
}