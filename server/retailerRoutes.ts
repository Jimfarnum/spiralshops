import { Express } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import { db } from "./db";
import { 
  retailerAccounts, 
  onboardingStatus, 
  retailerProducts, 
  productUploadBatches,
  malls 
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";

// Multer setup for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// Middleware to verify retailer JWT
const verifyRetailerToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.retailerId = decoded.retailerId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export function registerRetailerRoutes(app: Express) {
  
  // Retailer signup
  app.post('/api/retailers/signup', async (req, res) => {
    try {
      const {
        email,
        password,
        businessName,
        contactName,
        phone,
        website,
        address,
        city,
        state,
        zipCode,
        bio,
        socialLinks,
        taxId,
        preferredMallId
      } = req.body;

      // Check if email already exists
      const existingRetailer = await db.select().from(retailerAccounts).where(eq(retailerAccounts.email, email));
      if (existingRetailer.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create retailer account
      const [retailer] = await db.insert(retailerAccounts).values({
        email,
        passwordHash,
        businessName,
        contactName,
        phone,
        website,
        address,
        city,
        state,
        zipCode,
        bio,
        socialLinks,
        taxId,
        preferredMallId: preferredMallId ? parseInt(preferredMallId) : null,
      }).returning();

      // Create initial onboarding status
      await db.insert(onboardingStatus).values({
        retailerId: retailer.id,
        step: 'signup',
        status: 'completed',
        completedAt: new Date(),
      });

      await db.insert(onboardingStatus).values({
        retailerId: retailer.id,
        step: 'profile',
        status: 'pending',
      });

      // Generate JWT token
      const token = jwt.sign(
        { retailerId: retailer.id, email: retailer.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        retailer: {
          id: retailer.id,
          email: retailer.email,
          businessName: retailer.businessName,
          isApproved: retailer.isApproved,
        },
        token,
        message: 'Account created successfully. Please complete your profile.',
      });
    } catch (error) {
      console.error('Retailer signup error:', error);
      res.status(500).json({ error: 'Failed to create account' });
    }
  });

  // Retailer login
  app.post('/api/retailers/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const [retailer] = await db.select().from(retailerAccounts).where(eq(retailerAccounts.email, email));
      if (!retailer) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, retailer.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      if (!retailer.isActive) {
        return res.status(403).json({ error: 'Account is suspended' });
      }

      // Update last login
      await db.update(retailerAccounts)
        .set({ lastLoginAt: new Date() })
        .where(eq(retailerAccounts.id, retailer.id));

      // Generate JWT token
      const token = jwt.sign(
        { retailerId: retailer.id, email: retailer.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        retailer: {
          id: retailer.id,
          email: retailer.email,
          businessName: retailer.businessName,
          isApproved: retailer.isApproved,
        },
        token,
      });
    } catch (error) {
      console.error('Retailer login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Get retailer profile
  app.get('/api/retailers/profile', verifyRetailerToken, async (req: any, res) => {
    try {
      const [retailer] = await db.select().from(retailerAccounts)
        .where(eq(retailerAccounts.id, req.retailerId));

      if (!retailer) {
        return res.status(404).json({ error: 'Retailer not found' });
      }

      // Get onboarding status
      const statuses = await db.select().from(onboardingStatus)
        .where(eq(onboardingStatus.retailerId, req.retailerId))
        .orderBy(desc(onboardingStatus.createdAt));

      res.json({
        success: true,
        retailer: {
          ...retailer,
          passwordHash: undefined, // Don't send password hash
        },
        onboardingStatuses: statuses,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  // Update retailer profile
  app.put('/api/retailers/profile', verifyRetailerToken, async (req: any, res) => {
    try {
      const updates = req.body;
      delete updates.id;
      delete updates.passwordHash;
      delete updates.email;
      delete updates.createdAt;

      const [retailer] = await db.update(retailerAccounts)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(retailerAccounts.id, req.retailerId))
        .returning();

      // Update onboarding status if profile is complete
      if (retailer.businessName && retailer.address && retailer.contactName) {
        await db.update(onboardingStatus)
          .set({ 
            status: 'completed',
            completedAt: new Date()
          })
          .where(and(
            eq(onboardingStatus.retailerId, req.retailerId),
            eq(onboardingStatus.step, 'profile')
          ));

        // Create inventory step if it doesn't exist
        const inventoryStatus = await db.select().from(onboardingStatus)
          .where(and(
            eq(onboardingStatus.retailerId, req.retailerId),
            eq(onboardingStatus.step, 'inventory')
          ));

        if (inventoryStatus.length === 0) {
          await db.insert(onboardingStatus).values({
            retailerId: req.retailerId,
            step: 'inventory',
            status: 'pending',
          });
        }
      }

      res.json({
        success: true,
        retailer: {
          ...retailer,
          passwordHash: undefined,
        },
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Get retailer products
  app.get('/api/retailers/products', verifyRetailerToken, async (req: any, res) => {
    try {
      const products = await db.select().from(retailerProducts)
        .where(eq(retailerProducts.retailerId, req.retailerId))
        .orderBy(desc(retailerProducts.createdAt));

      res.json({
        success: true,
        products,
        total: products.length,
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Add product
  app.post('/api/retailers/products', verifyRetailerToken, async (req: any, res) => {
    try {
      const productData = {
        ...req.body,
        retailerId: req.retailerId,
      };

      const [product] = await db.insert(retailerProducts)
        .values(productData)
        .returning();

      // Update inventory onboarding status
      const productCount = await db.select().from(retailerProducts)
        .where(eq(retailerProducts.retailerId, req.retailerId));

      if (productCount.length >= 1) {
        await db.update(onboardingStatus)
          .set({ 
            status: 'completed',
            completedAt: new Date()
          })
          .where(and(
            eq(onboardingStatus.retailerId, req.retailerId),
            eq(onboardingStatus.step, 'inventory')
          ));
      }

      res.json({
        success: true,
        product,
        message: 'Product added successfully',
      });
    } catch (error) {
      console.error('Add product error:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });

  // Update product
  app.put('/api/retailers/products/:id', verifyRetailerToken, async (req: any, res) => {
    try {
      const productId = parseInt(req.params.id);
      const updates = req.body;
      delete updates.id;
      delete updates.retailerId;
      delete updates.createdAt;

      const [product] = await db.update(retailerProducts)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(
          eq(retailerProducts.id, productId),
          eq(retailerProducts.retailerId, req.retailerId)
        ))
        .returning();

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({
        success: true,
        product,
        message: 'Product updated successfully',
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  // Delete product
  app.delete('/api/retailers/products/:id', verifyRetailerToken, async (req: any, res) => {
    try {
      const productId = parseInt(req.params.id);

      const [product] = await db.delete(retailerProducts)
        .where(and(
          eq(retailerProducts.id, productId),
          eq(retailerProducts.retailerId, req.retailerId)
        ))
        .returning();

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // CSV upload endpoint
  app.post('/api/retailers/products/upload', verifyRetailerToken, upload.single('csvFile'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filename = req.file.originalname;
      const csvData = req.file.buffer.toString('utf8');

      // Create upload batch record
      const [batch] = await db.insert(productUploadBatches).values({
        retailerId: req.retailerId,
        filename,
        totalRows: 0,
        status: 'processing',
      }).returning();

      // Parse CSV
      const products: any[] = [];
      const errors: string[] = [];
      let totalRows = 0;

      const stream = Readable.from([csvData]);
      
      await new Promise((resolve, reject) => {
        stream
          .pipe(csv())
          .on('data', (row: any) => {
            totalRows++;
            
            // Validate required fields
            if (!row.title || !row.price || !row.category) {
              errors.push(`Row ${totalRows}: Missing required fields (title, price, category)`);
              return;
            }

            // Validate price
            const price = parseFloat(row.price);
            if (isNaN(price) || price <= 0) {
              errors.push(`Row ${totalRows}: Invalid price format`);
              return;
            }

            // Validate stock
            const stock = parseInt(row.stock) || 0;
            if (stock < 0) {
              errors.push(`Row ${totalRows}: Stock cannot be negative`);
              return;
            }

            products.push({
              retailerId: req.retailerId,
              title: row.title.trim(),
              description: row.description?.trim() || null,
              price: price.toString(),
              category: row.category.trim(),
              subcategory: row.subcategory?.trim() || null,
              brand: row.brand?.trim() || null,
              sku: row.sku?.trim() || null,
              stock,
              imageUrl: row.image_url?.trim() || null,
              tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
              weight: row.weight ? parseFloat(row.weight) : null,
              dimensions: row.dimensions?.trim() || null,
              spiralBonus: parseInt(row.spiral_bonus) || 0,
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });

      // Update batch with total rows
      await db.update(productUploadBatches)
        .set({ totalRows })
        .where(eq(productUploadBatches.id, batch.id));

      let successCount = 0;
      
      // Insert valid products
      for (const product of products) {
        try {
          await db.insert(retailerProducts).values(product);
          successCount++;
        } catch (error) {
          errors.push(`Failed to insert product "${product.title}": ${error}`);
        }
      }

      // Update batch with results
      await db.update(productUploadBatches)
        .set({
          successRows: successCount,
          errorRows: errors.length,
          errors,
          status: errors.length === 0 ? 'completed' : 'completed',
          completedAt: new Date(),
        })
        .where(eq(productUploadBatches.id, batch.id));

      // Update inventory onboarding status if first products
      if (successCount > 0) {
        await db.update(onboardingStatus)
          .set({ 
            status: 'completed',
            completedAt: new Date()
          })
          .where(and(
            eq(onboardingStatus.retailerId, req.retailerId),
            eq(onboardingStatus.step, 'inventory')
          ));
      }

      res.json({
        success: true,
        batch: {
          id: batch.id,
          filename,
          totalRows,
          successRows: successCount,
          errorRows: errors.length,
          errors: errors.slice(0, 10), // Return first 10 errors
        },
        message: `Upload completed. ${successCount} products added successfully.${errors.length > 0 ? ` ${errors.length} errors occurred.` : ''}`,
      });

    } catch (error) {
      console.error('CSV upload error:', error);
      res.status(500).json({ error: 'Failed to process CSV upload' });
    }
  });

  // Get upload history
  app.get('/api/retailers/uploads', verifyRetailerToken, async (req: any, res) => {
    try {
      const uploads = await db.select().from(productUploadBatches)
        .where(eq(productUploadBatches.retailerId, req.retailerId))
        .orderBy(desc(productUploadBatches.createdAt));

      res.json({
        success: true,
        uploads,
      });
    } catch (error) {
      console.error('Get uploads error:', error);
      res.status(500).json({ error: 'Failed to fetch upload history' });
    }
  });

  // Get available malls for dropdown
  app.get('/api/retailers/malls', async (req, res) => {
    try {
      const mallsList = await db.select({
        id: malls.id,
        name: malls.name,
        city: malls.city,
        state: malls.state,
      }).from(malls).where(eq(malls.isActive, true));

      res.json({
        success: true,
        malls: mallsList,
      });
    } catch (error) {
      console.error('Get malls error:', error);
      res.status(500).json({ error: 'Failed to fetch malls' });
    }
  });

  // Admin routes for retailer management
  app.get('/api/admin/retailers', async (req, res) => {
    try {
      const retailers = await db.select({
        id: retailerAccounts.id,
        email: retailerAccounts.email,
        businessName: retailerAccounts.businessName,
        contactName: retailerAccounts.contactName,
        phone: retailerAccounts.phone,
        city: retailerAccounts.city,
        state: retailerAccounts.state,
        isApproved: retailerAccounts.isApproved,
        isActive: retailerAccounts.isActive,
        createdAt: retailerAccounts.createdAt,
        lastLoginAt: retailerAccounts.lastLoginAt,
      }).from(retailerAccounts).orderBy(desc(retailerAccounts.createdAt));

      res.json({
        success: true,
        retailers,
        total: retailers.length,
      });
    } catch (error) {
      console.error('Get admin retailers error:', error);
      res.status(500).json({ error: 'Failed to fetch retailers' });
    }
  });

  // Admin approve/reject retailer
  app.post('/api/admin/retailers/:id/moderate', async (req, res) => {
    try {
      const retailerId = parseInt(req.params.id);
      const { action, notes } = req.body; // 'approve' or 'reject'

      const [retailer] = await db.update(retailerAccounts)
        .set({
          isApproved: action === 'approve',
          isActive: action === 'approve',
          updatedAt: new Date(),
        })
        .where(eq(retailerAccounts.id, retailerId))
        .returning();

      if (!retailer) {
        return res.status(404).json({ error: 'Retailer not found' });
      }

      // Update onboarding status
      if (action === 'approve') {
        await db.insert(onboardingStatus).values({
          retailerId,
          step: 'approved',
          status: 'completed',
          notes,
          completedAt: new Date(),
        });
      } else {
        await db.insert(onboardingStatus).values({
          retailerId,
          step: 'approved',
          status: 'rejected',
          notes,
        });
      }

      res.json({
        success: true,
        retailer,
        message: `Retailer ${action}d successfully`,
      });
    } catch (error) {
      console.error('Moderate retailer error:', error);
      res.status(500).json({ error: 'Failed to moderate retailer' });
    }
  });
}