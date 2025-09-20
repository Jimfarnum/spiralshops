import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { z } from 'zod';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /csv|xlsx|xls/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = file.mimetype.includes('csv') || 
                     file.mimetype.includes('spreadsheet') || 
                     file.mimetype.includes('excel');
    
    if (mimetype || extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
    }
  }
});

// Product validation schema
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative integer'),
  variants: z.array(z.string()).optional(),
  discount: z.number().min(0).max(100).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional()
}).passthrough();

// In-memory storage for demo (replace with database in production)
let products: any[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    price: 24.99,
    quantity: 150,
    variants: ['Dark Roast', 'Medium Roast', 'Light Roast'],
    discount: 10,
    imageUrl: '/api/uploads/coffee-beans.jpg',
    category: 'Food & Beverage',
    sku: 'COF001',
    description: 'Premium arabica coffee beans sourced from sustainable farms',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 89.99,
    quantity: 75,
    variants: ['Black', 'White', 'Blue'],
    discount: 15,
    imageUrl: '/api/uploads/headphones.jpg',
    category: 'Electronics',
    sku: 'ELE001',
    description: 'High-quality wireless headphones with noise cancellation',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    name: 'Organic Face Cream',
    price: 34.50,
    quantity: 8, // Low stock example
    variants: ['50ml', '100ml'],
    imageUrl: '/api/uploads/face-cream.jpg',
    category: 'Beauty & Personal Care',
    sku: 'BPC001',
    description: 'Natural organic face cream with anti-aging properties',
    timestamp: new Date(Date.now() - 172800000).toISOString()
  }
];
let productIdCounter = 4;

// Parse CSV/Excel file and validate data
function parseInventoryFile(buffer: Buffer, filename: string) {
  const errors: string[] = [];
  const validProducts: any[] = [];
  let totalRows = 0;

  try {
    let workbook: XLSX.WorkBook;

    if (filename.toLowerCase().endsWith('.csv')) {
      const csvData = buffer.toString('utf8');
      workbook = XLSX.read(csvData, { type: 'string' });
    } else {
      workbook = XLSX.read(buffer, { type: 'buffer' });
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    totalRows = rows.length;

    rows.forEach((row: any, index: number) => {
      try {
        // Clean and transform the data
        const productData = {
          name: String(row.name || row.Name || '').trim(),
          price: parseFloat(String(row.price || row.Price || '0')),
          quantity: parseInt(String(row.quantity || row.Quantity || '0')),
          variants: row.variants || row.Variants ? 
            String(row.variants || row.Variants).split(',').map((v: string) => v.trim()).filter(Boolean) : 
            [],
          discount: row.discount || row.Discount ? 
            parseFloat(String(row.discount || row.Discount)) : 
            undefined,
          imageUrl: String(row.imageUrl || row.ImageUrl || row.image_url || '').trim(),
          category: String(row.category || row.Category || '').trim(),
          sku: String(row.sku || row.SKU || '').trim(),
          description: String(row.description || row.Description || '').trim()
        };

        // Validate the product data
        const validated = productSchema.parse(productData);
        
        // Add metadata
        validated.id = String(productIdCounter++);
        validated.timestamp = new Date().toISOString();
        
        validProducts.push(validated);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          errors.push(`Row ${index + 2}: ${validationError.errors.map(e => e.message).join(', ')}`);
        } else {
          errors.push(`Row ${index + 2}: Invalid data format`);
        }
      }
    });

  } catch (parseError) {
    errors.push('Failed to parse file. Please ensure it\'s a valid CSV or Excel file.');
  }

  return {
    totalRows,
    validProducts,
    errors
  };
}

// Routes

// Get all products
router.get('/products', (req, res) => {
  try {
    // Sort by timestamp, newest first
    const sortedProducts = [...products].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    res.json(sortedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Upload CSV/Excel inventory
router.post('/upload-csv', upload.single('csv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { totalRows, validProducts, errors } = parseInventoryFile(
      req.file.buffer, 
      req.file.originalname
    );

    // Add valid products to inventory
    products.push(...validProducts);

    const stats = {
      totalRows,
      successfulUploads: validProducts.length,
      errors
    };

    res.json({
      message: `✅ Inventory upload completed: ${validProducts.length}/${totalRows} products processed successfully`,
      products: [...products].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
      stats
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: '⚠️ Upload failed', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add single product
router.post('/products', async (req, res) => {
  try {
    const validated = productSchema.parse(req.body);
    
    const newProduct = {
      ...validated,
      id: String(productIdCounter++),
      timestamp: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    } else {
      res.status(500).json({ error: 'Failed to add product' });
    }
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const validated = productSchema.parse(req.body);
    
    products[productIndex] = {
      ...products[productIndex],
      ...validated,
      timestamp: new Date().toISOString()
    };
    
    res.json({
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    
    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get product by ID
router.get('/products/:id', (req, res) => {
  try {
    const productId = req.params.id;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get inventory statistics
router.get('/inventory/stats', (req, res) => {
  try {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockProducts = products.filter(p => p.quantity < 10).length;
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))).length;
    const outOfStockProducts = products.filter(p => p.quantity === 0).length;
    
    res.json({
      totalProducts,
      totalValue,
      lowStockProducts,
      outOfStockProducts,
      categories,
      averagePrice: totalProducts > 0 ? totalValue / totalProducts : 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch inventory statistics' });
  }
});

export default router;