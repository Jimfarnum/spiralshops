import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Replit Object Storage configuration
const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
const publicDir = process.env.PUBLIC_OBJECT_SEARCH_PATHS || 'public';
const privateDir = process.env.PRIVATE_OBJECT_DIR || '.private';

console.log('🔧 Object Storage Config:', { bucketId, publicDir, privateDir });

// Upload file to object storage (simplified for testing)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // For now, save locally but prepare for object storage migration
    const timestamp = Date.now();
    const filename = `${timestamp}-${req.file.originalname}`;
    const uploadDir = 'uploads/object-storage';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, req.file.buffer);

    res.json({
      success: true,
      filename,
      path: filepath,
      size: req.file.size,
      type: req.file.mimetype,
      message: 'File uploaded successfully (object storage integration pending)'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      message: error.message 
    });
  }
});

// Analyze files for migration (preparation step)
router.post('/migrate-assets', async (req, res) => {
  try {
    // Directories to analyze for migration
    const migrateDirectories = [
      'attached_assets',
      'security-reports', 
      'uploads',
      'backups'
    ];

    const results = [];
    let totalSize = 0;
    let totalFiles = 0;

    for (const dir of migrateDirectories) {
      if (fs.existsSync(dir)) {
        const dirStats = { directory: dir, files: [], size: 0 };
        
        const files = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const file of files) {
          if (file.isFile()) {
            const filePath = path.join(dir, file.name);
            const stats = fs.statSync(filePath);
            
            dirStats.files.push({
              name: file.name,
              path: filePath,
              size: stats.size,
              sizeKB: Math.round(stats.size / 1024),
              sizeMB: Math.round(stats.size / 1024 / 1024 * 100) / 100,
              modified: stats.mtime
            });
            
            dirStats.size += stats.size;
            totalSize += stats.size;
            totalFiles++;
          }
        }
        
        results.push(dirStats);
      }
    }

    res.json({
      success: true,
      message: `Analysis complete: ${totalFiles} files ready for migration`,
      totalFiles,
      totalSize,
      totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
      directories: results,
      recommendation: {
        action: 'Move to object storage',
        benefit: `Reduce workspace by ${Math.round(totalSize / 1024 / 1024)}MB`,
        performance: 'Faster checkpoints and loading'
      }
    });

  } catch (error) {
    console.error('Migration analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
});

// Get current workspace storage statistics
router.get('/storage-stats', async (req, res) => {
  try {
    const stats = {
      workspace: {},
      objectStorage: {
        configured: !!bucketId,
        bucketId: bucketId || 'Not configured'
      }
    };

    // Analyze workspace usage
    const analyzeDirectory = (dirPath) => {
      if (!fs.existsSync(dirPath)) return { files: 0, size: 0 };
      
      let files = 0;
      let size = 0;
      
      try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const item of items) {
          const fullPath = path.join(dirPath, item.name);
          if (item.isFile()) {
            const stat = fs.statSync(fullPath);
            files++;
            size += stat.size;
          } else if (item.isDirectory()) {
            const subStats = analyzeDirectory(fullPath);
            files += subStats.files;
            size += subStats.size;
          }
        }
      } catch (err) {
        // Skip inaccessible directories
      }
      
      return { files, size };
    };

    // Key directories to analyze
    const directories = [
      'attached_assets',
      'security-reports',
      'uploads',
      'backups',
      'server',
      'client',
      'mobile'
    ];

    for (const dir of directories) {
      stats.workspace[dir] = analyzeDirectory(dir);
      stats.workspace[dir].sizeMB = Math.round(stats.workspace[dir].size / 1024 / 1024 * 100) / 100;
    }

    // Calculate totals
    const totalFiles = Object.values(stats.workspace).reduce((sum, dir) => sum + dir.files, 0);
    const totalSize = Object.values(stats.workspace).reduce((sum, dir) => sum + dir.size, 0);

    res.json({
      success: true,
      stats: {
        totalFiles,
        totalSize,
        totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
        workspace: stats.workspace,
        objectStorage: stats.objectStorage,
        recommendations: {
          migrate: ['attached_assets', 'security-reports', 'uploads', 'backups'],
          keep: ['server', 'client', 'mobile'],
          potentialSavings: Math.round(
            (stats.workspace.attached_assets?.size || 0) +
            (stats.workspace['security-reports']?.size || 0) +
            (stats.workspace.uploads?.size || 0) +
            (stats.workspace.backups?.size || 0)
          ) / 1024 / 1024
        }
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      error: 'Stats retrieval failed',
      message: error.message 
    });
  }
});

// List workspace files ready for migration
router.get('/files', async (req, res) => {
  try {
    const { directory = 'attached_assets', limit = 50 } = req.query;
    
    if (!fs.existsSync(directory)) {
      return res.json({
        success: false,
        error: `Directory ${directory} not found`,
        available: ['attached_assets', 'security-reports', 'uploads', 'backups']
      });
    }

    const files = fs.readdirSync(directory, { withFileTypes: true })
      .filter(item => item.isFile())
      .slice(0, parseInt(limit))
      .map(file => {
        const filePath = path.join(directory, file.name);
        const stats = fs.statSync(filePath);
        return {
          name: file.name,
          path: filePath,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024),
          sizeMB: Math.round(stats.size / 1024 / 1024 * 100) / 100,
          modified: stats.mtime,
          extension: path.extname(file.name)
        };
      });

    res.json({
      success: true,
      directory,
      files,
      count: files.length,
      message: `Found ${files.length} files in ${directory}`
    });

  } catch (error) {
    console.error('File list error:', error);
    res.status(500).json({ 
      error: 'File listing failed',
      message: error.message 
    });
  }
});

export default router;