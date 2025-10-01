// 🛠️ SPIRAL Auto-Diagnostic & Repair Tool
import fs from "fs";
import path from "path";

console.log("🔍 SPIRAL Diagnostic Started...\n");

// Test critical routes and components
const testRoutes = async () => {
  const routes = [
    "/", "/products", "/about-spiral", "/loyalty", "/cart",
    "/retailer-dashboard-new", "/shopper-dashboard", "/admin-login",
    "/complete-functionality-test", "/code-continuity-test", "/navigation-test"
  ];

  console.log("📋 Testing Routes:");
  const issues = [];
  
  for (const route of routes) {
    try {
      const response = await fetch(`http://localhost:5000${route}`);
      if (response.ok) {
        console.log(`✅ ${route}: OK`);
      } else {
        console.log(`❌ ${route}: ${response.status}`);
        issues.push(`Route ${route} returned ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${route}: Error - ${error.message}`);
      issues.push(`Route ${route} failed: ${error.message}`);
    }
  }
  
  return issues;
};

// Check critical files
const checkFiles = () => {
  console.log("\n📋 Checking Critical Files:");
  const files = [
    "client/src/App.tsx",
    "client/src/pages/home.tsx",
    "client/src/pages/about.tsx",
    "client/src/components/HeroSection.tsx",
    "client/src/components/header.tsx"
  ];
  
  const issues = [];
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}: Found`);
      
      // Check for common issues
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('href=') && !content.includes('import.*Link.*wouter')) {
        issues.push(`${file}: Uses href instead of to for Link components`);
      }
      if (content.includes('undefined') && content.includes('import')) {
        issues.push(`${file}: Potential undefined import`);
      }
    } else {
      console.log(`❌ ${file}: Missing`);
      issues.push(`Missing critical file: ${file}`);
    }
  }
  
  return issues;
};

// Fix App.tsx routing if needed
const fixRouting = () => {
  console.log("\n🔧 Checking App.tsx Routing:");
  const appPath = "client/src/App.tsx";
  
  if (!fs.existsSync(appPath)) {
    console.log("❌ App.tsx not found");
    return ["App.tsx file missing"];
  }
  
  const content = fs.readFileSync(appPath, 'utf8');
  const requiredRoutes = [
    '/about-spiral',
    '/complete-functionality-test',
    '/code-continuity-test'
  ];
  
  const issues = [];
  for (const route of requiredRoutes) {
    if (!content.includes(`path="${route}"`)) {
      issues.push(`Missing route definition for ${route}`);
    }
  }
  
  if (issues.length === 0) {
    console.log("✅ All critical routes defined");
  } else {
    console.log("❌ Missing route definitions:", issues);
  }
  
  return issues;
};

// Create robots.txt for security
const createRobotsTxt = () => {
  console.log("\n🔒 Creating robots.txt:");
  const robotsPath = "public/robots.txt";
  const robotsContent = `User-agent: *
Disallow: /admin-login
Disallow: /admin/
Disallow: /api/
Allow: /
`;
  
  try {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public", { recursive: true });
    }
    fs.writeFileSync(robotsPath, robotsContent);
    console.log("✅ robots.txt created successfully");
    return [];
  } catch (error) {
    console.log("❌ Failed to create robots.txt:", error.message);
    return [`Failed to create robots.txt: ${error.message}`];
  }
};

// Main diagnostic function
const runDiagnostic = async () => {
  try {
    console.log("🚀 SPIRAL Platform Diagnostic Tool\n");
    
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const routeIssues = await testRoutes();
    const fileIssues = checkFiles();
    const routingIssues = fixRouting();
    const robotsIssues = createRobotsTxt();
    
    const allIssues = [...routeIssues, ...fileIssues, ...routingIssues, ...robotsIssues];
    
    console.log("\n📊 DIAGNOSTIC SUMMARY:");
    console.log(`Total Issues Found: ${allIssues.length}`);
    
    if (allIssues.length === 0) {
      console.log("✅ SPIRAL Platform: All systems operational!");
      console.log("\nReady for testing:");
      console.log("- Homepage: http://localhost:5000/");
      console.log("- About SPIRAL: http://localhost:5000/about-spiral");
      console.log("- Complete Test Suite: http://localhost:5000/complete-functionality-test");
      console.log("- Admin Login: http://localhost:5000/admin-login");
    } else {
      console.log("❌ Issues requiring attention:");
      allIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }
    
    console.log("\n🔍 Diagnostic complete. Platform status verified.");
    
  } catch (error) {
    console.error("❌ Diagnostic failed:", error.message);
  }
};

// Run if called directly
if (require.main === module) {
  runDiagnostic();
}

module.exports = { runDiagnostic };