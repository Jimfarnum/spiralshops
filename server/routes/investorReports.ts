import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const router = express.Router();

// Utility: Generate branded PDF
function generateInvestorPDF(data: any, filePath: string) {
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Branding Header with SPIRAL colors
  const headerGradient = doc.linearGradient(0, 0, doc.page.width, 0);
  headerGradient.stop(0, "#00B894").stop(1, "#0984E3"); // SPIRAL Green to Blue
  doc.rect(0, 0, doc.page.width, 80).fill(headerGradient);
  
  doc.fillColor("white")
     .fontSize(22)
     .font("Helvetica-Bold")
     .text("SPIRAL Launch Snapshot Report", 50, 25, { align: "center" });
  
  doc.fontSize(14)
     .text(`Generated: ${new Date().toLocaleString()}`, 50, 50, { align: "center" });

  doc.moveDown(4);
  doc.fillColor("#2D3436");

  // Metrics Section
  doc.fontSize(18)
     .fillColor("#00B894")
     .text("📊 Key Performance Metrics", { underline: true });
  doc.moveDown(1.5);

  // Create metrics in a clean table format
  let yPosition = doc.y;
  Object.entries(data).forEach(([key, value], index) => {
    // Alternate row backgrounds for better readability
    if (index % 2 === 0) {
      doc.rect(50, yPosition - 5, doc.page.width - 100, 25).fill("#F8F9FA");
    }
    
    doc.fillColor("#2D3436")
       .fontSize(12)
       .font("Helvetica-Bold")
       .text(key + ":", 60, yPosition);
    
    doc.fillColor("#00B894")
       .fontSize(12)
       .font("Helvetica")
       .text(String(value), 300, yPosition);
    
    yPosition += 25;
    doc.y = yPosition;
  });

  doc.moveDown(3);

  // Additional insights section
  doc.fillColor("#0984E3")
     .fontSize(16)
     .font("Helvetica-Bold")
     .text("🚀 Platform Highlights", { underline: true });
  
  doc.moveDown(1);
  doc.fillColor("#2D3436")
     .fontSize(12)
     .font("Helvetica")
     .text("• Multi-mall commerce platform operational", { bulletRadius: 3 })
     .text("• AI-powered business intelligence active", { bulletRadius: 3 })
     .text("• SPIRAL loyalty program driving engagement", { bulletRadius: 3 })
     .text("• Real-time inventory and sales tracking", { bulletRadius: 3 })
     .text("• Cross-platform mobile apps deployed", { bulletRadius: 3 });

  // Footer with branding
  const footerY = doc.page.height - 80;
  doc.rect(0, footerY, doc.page.width, 80).fill("#F8F9FA");
  
  doc.fillColor("#636E72")
     .fontSize(12)
     .font("Helvetica-Bold")
     .text("Powered by SPIRALshops.com", 50, footerY + 30, { align: "center" });
  
  doc.fontSize(10)
     .font("Helvetica")
     .text("Leading Local Commerce Platform", 50, footerY + 50, { align: "center" });

  doc.end();
  return stream;
}

// Route: Mock report generation
router.get("/mock-report", async (req, res) => {
  try {
    const sampleData = {
      "Retailers Onboarded": 42,
      "Malls Connected": 5,
      "Shoppers Active": 3500,
      "SPIRAL Sales": "$450,000",
      "SPIRALs Earned": 125000,
      "SPIRALs Redeemed": 48000,
      "Campaigns Running": 3,
      "AI Agents Active": 18,
      "Mobile App Downloads": 2800,
      "Average Order Value": "$67.50",
      "Customer Retention": "87%",
      "Platform Uptime": "99.8%"
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `SPIRAL_Mock_Launch_Report_${timestamp}.pdf`;
    const filePath = path.join(process.cwd(), "exports", fileName);
    
    // Ensure exports directory exists
    const exportsDir = path.join(process.cwd(), "exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    generateInvestorPDF(sampleData, filePath);

    // Wait for file to be written
    setTimeout(() => {
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error("Download error:", err);
          res.status(500).json({ ok: false, error: "Failed to download file" });
        }
      });
    }, 1000);

  } catch (err: any) {
    console.error("Report generation error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Route: Get report status and available files
router.get("/reports/list", async (req, res) => {
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