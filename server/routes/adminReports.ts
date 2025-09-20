import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const router = express.Router();

// Generate Launch Report (Mock or Live)
router.get("/launch-report", async (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `SPIRAL_Launch_Report_${timestamp}.pdf`;
    const filepath = path.join(process.cwd(), "exports", filename);
    
    // Ensure exports directory exists
    const exportsDir = path.join(process.cwd(), "exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // SPIRAL Branding Header
    const headerGradient = doc.linearGradient(0, 0, doc.page.width, 0);
    headerGradient.stop(0, "#00B894").stop(1, "#0984E3"); // SPIRAL Green to Blue
    doc.rect(0, 0, doc.page.width, 80).fill(headerGradient);
    
    doc.fillColor("white")
       .fontSize(22)
       .font("Helvetica-Bold")
       .text("SPIRAL Launch Report", 50, 25, { align: "center" });
    
    doc.fontSize(12)
       .text("spiralshops.com | spiralmalls.com", 50, 50, { align: "center" });

    doc.moveDown(4);
    doc.fillColor("#2D3436");

    // Executive Summary
    doc.fontSize(16)
       .fillColor("#00B894")
       .text("Executive Summary", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11)
       .fillColor("#2D3436")
       .text("SPIRAL connects shoppers, retailers, and malls nationwide through a trusted community-driven platform. Our AI-powered ecosystem facilitates seamless commerce experiences while building local business relationships through our innovative SPIRAL loyalty program.");
    
    doc.moveDown(2);

    // Retailer Metrics Section
    doc.fontSize(16)
       .fillColor("#00B894")
       .text("Retailer Performance Metrics", { underline: true });
    doc.moveDown(0.5);
    
    const retailerMetrics = [
      "Total Retailers Onboarded: 42",
      "Verification Rate: 65%", 
      "Recognition Tiers: Premium (15) | Standard (18) | Growing (9)",
      "Average Monthly Sales: $12,500",
      "Platform Integration Rate: 89%"
    ];
    
    retailerMetrics.forEach(metric => {
      doc.fontSize(11).text(`• ${metric}`, { bulletRadius: 3 });
    });

    doc.moveDown(2);

    // Shopper Engagement Section
    doc.fontSize(16)
       .fillColor("#00B894")
       .text("Shopper Engagement Analytics", { underline: true });
    doc.moveDown(0.5);
    
    const shopperMetrics = [
      "Active Shoppers: 3,500",
      "Invite-to-Shop Conversion Rate: 22%",
      "Average SPIRAL Balance: 2,840 points",
      "Monthly Redemption Rate: 78%",
      "Cross-Mall Shopping Rate: 34%"
    ];
    
    shopperMetrics.forEach(metric => {
      doc.fontSize(11).text(`• ${metric}`, { bulletRadius: 3 });
    });

    // Add new page for platform metrics
    doc.addPage();
    
    // Platform Health Section
    doc.fontSize(16)
       .fillColor("#0984E3")
       .text("Platform Health & Technology", { underline: true });
    doc.moveDown(0.5);
    
    const platformMetrics = [
      "System Uptime: 99.8%",
      "AI Agents Active: 18",
      "Mobile App Downloads: 2,800",
      "API Response Time: <100ms",
      "Database Performance: Optimized"
    ];
    
    platformMetrics.forEach(metric => {
      doc.fontSize(11).text(`• ${metric}`, { bulletRadius: 3 });
    });

    doc.moveDown(2);

    // Financial Overview
    doc.fontSize(16)
       .fillColor("#0984E3")
       .text("Financial Performance", { underline: true });
    doc.moveDown(0.5);
    
    const financialMetrics = [
      "Total SPIRAL Sales: $450,000",
      "Average Order Value: $67.50",
      "Platform Transaction Fee Revenue: $18,500",
      "SPIRAL Points Circulation: 125,000",
      "Redemption Value: $48,000"
    ];
    
    financialMetrics.forEach(metric => {
      doc.fontSize(11).text(`• ${metric}`, { bulletRadius: 3 });
    });

    // Footer with branding
    const footerY = doc.page.height - 80;
    doc.rect(0, footerY, doc.page.width, 80).fill("#F8F9FA");
    
    doc.fillColor("#636E72")
       .fontSize(12)
       .font("Helvetica-Bold")
       .text("Powered by SPIRAL Local Commerce Platform", 50, footerY + 30, { align: "center" });
    
    doc.fontSize(10)
       .font("Helvetica")
       .text("Leading Multi-Mall Commerce & Loyalty Platform", 50, footerY + 50, { align: "center" });

    doc.end();
    
    stream.on("finish", () => {
      res.download(filepath, filename, (err) => {
        if (err) {
          console.error("Download error:", err);
          res.status(500).json({ ok: false, error: "Failed to download file" });
        }
      });
    });
  } catch (err: any) {
    console.error("Launch report generation error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get reports list for admin interface
router.get("/list", async (req, res) => {
  try {
    const exportsDir = path.join(process.cwd(), "exports");
    if (!fs.existsSync(exportsDir)) {
      return res.json({ ok: true, reports: [] });
    }

    const files = fs.readdirSync(exportsDir)
      .filter(file => file.endsWith('.pdf'))
      .map(file => {
        const filePath = path.join(exportsDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified.getTime() - a.modified.getTime());

    res.json({ ok: true, reports: files });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;