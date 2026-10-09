import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');
const PRODUCTS_FILE = path.resolve(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.resolve(DATA_DIR, 'settings.json');
const LIKES_FILE = path.resolve(DATA_DIR, 'likes.json');

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helpers to read/write JSON files safely
function readJSONFile(filePath: string, fallback: any) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJSONFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Pre-seed files if empty
if (!fs.existsSync(PRODUCTS_FILE)) {
  // Try to load initial seed from src/data/initialData.ts or seed
  try {
    // If not existing, let client push or initialize
  } catch {}
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Request body parsing with high limit for 50+ batch photo uploads
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // Serve persistent user uploaded media
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- REST API Endpoints ---

  // GET all products
  app.get('/api/products', (req, res) => {
    const products = readJSONFile(PRODUCTS_FILE, null);
    if (!products) {
      // Empty or not initialized yet, return 404 so client uses its seed or sends seed
      return res.status(200).json([]);
    }
    res.json(products);
  });

  // POST create or replace product
  app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    if (!newProduct || !newProduct.id) {
      return res.status(400).json({ error: 'Product data and ID are required' });
    }

    let products = readJSONFile(PRODUCTS_FILE, []);
    const idx = products.findIndex((p: any) => p.id === newProduct.id);
    if (idx >= 0) {
      products[idx] = newProduct;
    } else {
      products.unshift(newProduct);
    }

    writeJSONFile(PRODUCTS_FILE, products);
    res.json({ success: true, product: newProduct });
  });

  // POST bulk save products (e.g. initial upload or bulk matching)
  app.post('/api/products/bulk', (req, res) => {
    const incoming = req.body;
    if (!Array.isArray(incoming)) {
      return res.status(400).json({ error: 'Expected an array of products' });
    }

    let current = readJSONFile(PRODUCTS_FILE, []);
    const map = new Map();
    // Keep existing
    current.forEach((p: any) => map.set(p.id, p));
    // Overwrite with incoming
    incoming.forEach((p: any) => map.set(p.id, p));

    const combined = Array.from(map.values());
    writeJSONFile(PRODUCTS_FILE, combined);
    res.json({ success: true, count: combined.length });
  });

  // DELETE a product
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    let products = readJSONFile(PRODUCTS_FILE, []);
    products = products.filter((p: any) => p.id !== id);
    writeJSONFile(PRODUCTS_FILE, products);
    res.json({ success: true, deletedId: id });
  });

  // RESET catalogue
  app.post('/api/products/reset', (req, res) => {
    if (fs.existsSync(PRODUCTS_FILE)) {
      fs.unlinkSync(PRODUCTS_FILE);
    }
    res.json({ success: true, message: 'Products reset to defaults' });
  });

  // GET brand settings
  app.get('/api/settings', (req, res) => {
    const settings = readJSONFile(SETTINGS_FILE, null);
    res.json(settings || {});
  });

  // PUT brand settings
  app.put('/api/settings', (req, res) => {
    const settings = req.body;
    writeJSONFile(SETTINGS_FILE, settings);
    res.json({ success: true, settings });
  });

  // GET likes statistics and customer hearts
  app.get('/api/likes', (req, res) => {
    const data = readJSONFile(LIKES_FILE, { counts: {}, activity: [] });
    res.json(data);
  });

  // POST record a customer hearting an outfit
  app.post('/api/likes', (req, res) => {
    const { productId, productName, sku } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const data = readJSONFile(LIKES_FILE, { counts: {}, activity: [] });
    data.counts = data.counts || {};
    data.counts[productId] = (data.counts[productId] || 0) + 1;

    data.activity = data.activity || [];
    data.activity.unshift({
      productId,
      productName: productName || 'Outfit',
      sku: sku || '',
      timestamp: new Date().toISOString()
    });

    // Keep last 100 activity items
    if (data.activity.length > 100) {
      data.activity = data.activity.slice(0, 100);
    }

    writeJSONFile(LIKES_FILE, data);
    res.json({ success: true, count: data.counts[productId], totalLikes: Object.values(data.counts).reduce((a: any, b: any) => a + b, 0) });
  });

  // POST upload image (accepts base64 or multipart)
  app.post('/api/upload', (req, res) => {
    const { data, filename, mimeType } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    try {
      // Clean base64 string
      const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      const ext = filename ? path.extname(filename) : '.jpg';
      const safeExt = ext || '.jpg';
      const cleanName = `photo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${safeExt}`;
      const filePath = path.resolve(UPLOADS_DIR, cleanName);

      fs.writeFileSync(filePath, buffer);
      const url = `/uploads/${cleanName}`;

      res.json({ success: true, url, filename: cleanName });
    } catch (err: any) {
      console.error('Error saving image upload:', err);
      res.status(500).json({ error: 'Failed to save image file' });
    }
  });

  // --- Vite Dev Server or Production Static Serving ---
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 The Sewing Bird server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
