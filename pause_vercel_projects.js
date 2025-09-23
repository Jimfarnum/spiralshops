#!/usr/bin/env node

// 🔧 Vercel Project Management Script
// Pauses unused test/dev projects while keeping main spiralshops active

import fetch from 'node-fetch';

// 🎯 Projects to KEEP ACTIVE (production)
const KEEP_ACTIVE = [
  'spiralshops'  // Main production project serving spiralshops.com
];

// 🗑️ Projects to PAUSE (test/dev versions burning resources)
const PAUSE_PROJECTS = [
  'spiralshops-project',
  'spiralshops-lsa3', 
  'myspiralshops',
  'spiralshops-2025',
  'jimfarnumspiralshops',
  'spiralshops-websites', 
  'jfarnumspiralshops',
  'jimsspiralshops'
];

class VercelManager {
  constructor() {
    this.token = process.env.VERCEL_TOKEN;
    this.baseUrl = 'https://api.vercel.com';
    
    if (!this.token) {
      console.error('❌ VERCEL_TOKEN environment variable required');
      console.log('💡 Get your token from: https://vercel.com/account/tokens');
      process.exit(1);
    }
  }

  // 📋 Get all projects for the account
  async getProjects() {
    try {
      const response = await fetch(`${this.baseUrl}/v10/projects`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      return data.projects || [];
    } catch (error) {
      console.error('❌ Failed to fetch projects:', error.message);
      return [];
    }
  }

  // ⏸️ Pause a specific project by name
  async pauseProject(projectName, projectId) {
    try {
      console.log(`⏸️ Pausing: ${projectName}...`);
      
      const response = await fetch(`${this.baseUrl}/v1/projects/${projectId}/pause`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log(`✅ Successfully paused: ${projectName}`);
        return true;
      } else {
        const error = await response.text();
        console.log(`⚠️ Failed to pause ${projectName}: ${error}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error pausing ${projectName}:`, error.message);
      return false;
    }
  }

  // 🔍 Resume a project (opposite of pause)
  async resumeProject(projectName, projectId) {
    try {
      console.log(`▶️ Resuming: ${projectName}...`);
      
      const response = await fetch(`${this.baseUrl}/v1/projects/${projectId}/unpause`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log(`✅ Successfully resumed: ${projectName}`);
        return true;
      } else {
        const error = await response.text();
        console.log(`⚠️ Failed to resume ${projectName}: ${error}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error resuming ${projectName}:`, error.message);
      return false;
    }
  }

  // 🚀 Main execution function
  async run(action = 'pause') {
    console.log('🔧 Vercel Project Manager');
    console.log('========================');
    console.log(`🎯 Action: ${action.toUpperCase()}`);
    console.log(`✅ Keep active: ${KEEP_ACTIVE.join(', ')}`);
    console.log(`⏸️ Target projects: ${PAUSE_PROJECTS.join(', ')}`);
    console.log('');

    // Get all projects
    console.log('📋 Fetching your Vercel projects...');
    const projects = await this.getProjects();
    
    if (projects.length === 0) {
      console.log('❌ No projects found or API error');
      return;
    }

    console.log(`📊 Found ${projects.length} total projects`);
    console.log('');

    // Process each target project
    let successCount = 0;
    
    for (const targetName of PAUSE_PROJECTS) {
      const project = projects.find(p => p.name === targetName);
      
      if (!project) {
        console.log(`⚠️ Project not found: ${targetName}`);
        continue;
      }

      let success = false;
      if (action === 'pause') {
        success = await this.pauseProject(targetName, project.id);
      } else if (action === 'resume') {
        success = await this.resumeProject(targetName, project.id);
      }

      if (success) successCount++;
    }

    console.log('');
    console.log('🏆 Summary:');
    console.log(`✅ ${successCount}/${PAUSE_PROJECTS.length} projects ${action}d successfully`);
    
    // Show active projects
    const activeProjects = projects.filter(p => KEEP_ACTIVE.includes(p.name));
    console.log(`🚀 Active projects: ${activeProjects.map(p => p.name).join(', ')}`);
  }
}

// 🎯 CLI Interface
async function main() {
  const action = process.argv[2] || 'pause';
  
  if (!['pause', 'resume'].includes(action)) {
    console.log('Usage: node pause_vercel_projects.js [pause|resume]');
    console.log('');
    console.log('Examples:');
    console.log('  node pause_vercel_projects.js pause   # Pause unused projects');
    console.log('  node pause_vercel_projects.js resume  # Resume paused projects');
    process.exit(1);
  }

  const manager = new VercelManager();
  await manager.run(action);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { VercelManager };