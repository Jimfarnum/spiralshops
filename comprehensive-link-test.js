// SPIRAL Comprehensive Link Testing Suite
import fs from 'fs';
import path from 'path';

async function extractAllRoutes() {
  console.log("🔍 Scanning SPIRAL codebase for all defined routes...");
  
  // Read App.tsx to get all defined routes
  const appTsxPath = 'client/src/App.tsx';
  const appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
  
  // Extract route patterns
  const routeMatches = appTsxContent.match(/path="([^"]+)"/g);
  const definedRoutes = routeMatches ? routeMatches.map(match => match.match(/path="([^"]+)"/)[1]) : [];
  
  console.log(`✅ Found ${definedRoutes.length} defined routes in App.tsx`);
  
  return definedRoutes;
}

async function extractLinksFromComponents() {
  console.log("🔍 Scanning components for referenced links...");
  
  const componentPaths = [
    'client/src/components/MobileNav.tsx',
    'client/src/components/quick-actions.tsx',
    'client/src/pages/home.tsx',
    'client/src/components/ShopperDashboard.tsx',
    'client/src/components/MobileNav.tsx'
  ];
  
  const referencedLinks = new Set();
  
  for (const componentPath of componentPaths) {
    try {
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Extract href and Link to patterns
        const hrefMatches = content.match(/(?:href|to)=["']([^"']+)["']/g);
        if (hrefMatches) {
          hrefMatches.forEach(match => {
            const link = match.match(/(?:href|to)=["']([^"']+)["']/)[1];
            if (link.startsWith('/') && !link.includes('http')) {
              referencedLinks.add(link);
            }
          });
        }
        
        // Extract path references from quickActions or similar arrays
        const pathMatches = content.match(/path:\s*['"]([^'"]+)['"]/g);
        if (pathMatches) {
          pathMatches.forEach(match => {
            const path = match.match(/path:\s*['"]([^'"]+)['"]/)[1];
            referencedLinks.add(path);
          });
        }
      }
    } catch (error) {
      console.log(`⚠️ Could not read ${componentPath}: ${error.message}`);
    }
  }
  
  return Array.from(referencedLinks);
}

async function testAllLinks() {
  console.log("🚀 Starting comprehensive SPIRAL link testing...\n");
  
  const definedRoutes = await extractAllRoutes();
  const referencedLinks = await extractLinksFromComponents();
  
  console.log("📋 Referenced links found in components:");
  referencedLinks.forEach(link => console.log(`   ${link}`));
  console.log();
  
  // Test all referenced links
  const baseUrl = 'http://localhost:5000';
  const results = {
    working: [],
    broken: [],
    missing: []
  };
  
  console.log("🔧 Testing all referenced links...\n");
  
  for (const link of referencedLinks) {
    try {
      const response = await fetch(`${baseUrl}${link}`);
      
      if (response.status === 200) {
        console.log(`✅ ${link}: Working`);
        results.working.push(link);
      } else if (response.status === 404) {
        console.log(`❌ ${link}: 404 Not Found`);
        results.broken.push(link);
        
        // Check if route is defined but page missing
        const isDefined = definedRoutes.includes(link);
        if (!isDefined) {
          console.log(`   ⚠️ Route not defined in App.tsx`);
        }
      } else {
        console.log(`⚠️ ${link}: Status ${response.status}`);
        results.broken.push(link);
      }
    } catch (error) {
      console.log(`❌ ${link}: Error - ${error.message}`);
      results.broken.push(link);
    }
  }
  
  // Check for routes defined but not referenced
  const unreferencedRoutes = definedRoutes.filter(route => 
    !referencedLinks.includes(route) && 
    !route.includes(':') && // Skip parameterized routes
    route !== '/' // Skip root
  );
  
  console.log("\n📊 SPIRAL Link Testing Results:");
  console.log(`   ✅ Working Links: ${results.working.length}`);
  console.log(`   ❌ Broken Links: ${results.broken.length}`);
  console.log(`   📋 Total Links Tested: ${referencedLinks.length}`);
  
  if (results.broken.length > 0) {
    console.log("\n🚨 BROKEN LINKS DETECTED:");
    results.broken.forEach(link => {
      const isDefined = definedRoutes.includes(link);
      console.log(`   ${link} - ${isDefined ? 'Route defined, page issue' : 'Route missing'}`);
    });
  }
  
  if (unreferencedRoutes.length > 0) {
    console.log("\n📝 Unreferenced Routes (defined but not linked):");
    unreferencedRoutes.slice(0, 10).forEach(route => console.log(`   ${route}`));
    if (unreferencedRoutes.length > 10) {
      console.log(`   ... and ${unreferencedRoutes.length - 10} more`);
    }
  }
  
  console.log("\n🔍 Why might the agent have missed these?");
  if (results.broken.length > 0) {
    console.log("   • Agent focused on Quick Actions menu specifically");
    console.log("   • Other broken links may be in different navigation components");
    console.log("   • Links might be dynamically generated or conditional");
    console.log("   • Some links may be in less obvious UI components");
  } else {
    console.log("   • All tested links are working - Quick Actions were the main issue");
  }
  
  return results;
}

// Enhanced test for specific components
async function testQuickActionsSpecifically() {
  console.log("\n🎯 Testing Quick Actions component specifically...");
  
  try {
    const mobileNavPath = 'client/src/components/MobileNav.tsx';
    if (fs.existsSync(mobileNavPath)) {
      const content = fs.readFileSync(mobileNavPath, 'utf8');
      
      // Extract quickActions array
      const quickActionsMatch = content.match(/const quickActions = \[[\s\S]*?\];/);
      if (quickActionsMatch) {
        const quickActionsText = quickActionsMatch[0];
        const pathMatches = quickActionsText.match(/path: ['"]([^'"]+)['"]/g);
        
        if (pathMatches) {
          console.log("🔍 Quick Actions paths found:");
          const quickActionPaths = pathMatches.map(match => match.match(/path: ['"]([^'"]+)['"]/)[1]);
          
          for (const path of quickActionPaths) {
            try {
              const response = await fetch(`http://localhost:5000${path}`);
              console.log(`   ${path}: ${response.status === 200 ? '✅ Working' : '❌ Status ' + response.status}`);
            } catch (error) {
              console.log(`   ${path}: ❌ Error - ${error.message}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(`⚠️ Could not analyze Quick Actions: ${error.message}`);
  }
}

// Run all tests
testAllLinks().then(results => {
  testQuickActionsSpecifically().then(() => {
    console.log("\n🎯 ANALYSIS COMPLETE");
    console.log("The agent initially found the Quick Actions 404 errors because they were");
    console.log("visible in user screenshots and reported as the primary issue.");
    console.log("This comprehensive scan reveals the full scope of any remaining issues.");
  });
}).catch(error => {
  console.error("Test failed:", error);
});