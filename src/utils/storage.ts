import { Product, BrandSettings, CartItem } from '../types';
import { initialProducts, defaultBrandSettings } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'cotton_blossom_products_v2',
  SETTINGS: 'cotton_blossom_settings_v2',
  WISHLIST: 'cotton_blossom_wishlist_v2',
  CART: 'cotton_blossom_cart_v2',
  RECENTLY_VIEWED: 'cotton_blossom_recently_viewed_v2',
  ADMIN_AUTH: 'cotton_blossom_admin_auth_v2'
};

// --- Product Storage & Sync ---

export async function fetchProducts(): Promise<Product[]> {
  // First attempt to load from server backend
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Cache locally for offline backup
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
        return data;
      }
    }
  } catch {
    // Backend offline or running standalone dev, fall through to client storage
  }

  // Fallback to localStorage
  const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sync to server in background
        fetch('/api/products/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        }).catch(() => {});
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse cached products', e);
    }
  }

  // Seed default products
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  // Sync seed to server
  fetch('/api/products/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(initialProducts)
  }).catch(() => {});
  return initialProducts;
}

export async function saveProduct(product: Product): Promise<Product[]> {
  const current = await fetchProducts();
  const index = current.findIndex(p => p.id === product.id);
  let updated: Product[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...product, updatedAt: new Date().toISOString() };
  } else {
    updated = [product, ...current];
  }

  // Save to backend if available
  try {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
  } catch {
    // Ignore backend failure, persist locally
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  return updated;
}

export async function deleteProduct(productId: string): Promise<Product[]> {
  const current = await fetchProducts();
  const updated = current.filter(p => p.id !== productId);

  try {
    await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
  } catch {
    // Fallback
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  return updated;
}

export async function saveBulkProducts(newProducts: Product[]): Promise<Product[]> {
  const current = await fetchProducts();
  // Merge: replace existing if matching id, else prepend
  const map = new Map<string, Product>();
  newProducts.forEach(p => map.set(p.id, p));
  current.forEach(p => {
    if (!map.has(p.id)) map.set(p.id, p);
  });
  const updated = Array.from(map.values());

  try {
    await fetch('/api/products/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProducts)
    });
  } catch {
    // Local fallback
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  return updated;
}

export async function resetToDefaultCatalogue(): Promise<Product[]> {
  try {
    await fetch('/api/products/reset', { method: 'POST' });
  } catch {
    // Local fallback
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  return initialProducts;
}

// --- Brand Settings Storage ---

export async function fetchBrandSettings(): Promise<BrandSettings> {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && data.brandName) {
        if (data.brandName === 'Cotton Blossom Co.') {
          data.brandName = 'The Sewing Bird';
          data.secondaryName = "Children's Clothing Boutique";
          data.enquiryEmail = 'hello@thesewingbird.com';
          data.instagramHandle = '@thesewingbird';
        }
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
        return data;
      }
    }
  } catch {
    // Fallback
  }

  const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.brandName === 'Cotton Blossom Co.') {
        parsed.brandName = 'The Sewing Bird';
        parsed.secondaryName = "Children's Clothing Boutique";
        parsed.enquiryEmail = 'hello@thesewingbird.com';
        parsed.instagramHandle = '@thesewingbird';
      }
      return { ...defaultBrandSettings, ...parsed };
    } catch {
      // Fallback
    }
  }

  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultBrandSettings));
  return defaultBrandSettings;
}

export async function saveBrandSettings(settings: BrandSettings): Promise<BrandSettings> {
  try {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
  } catch {
    // Fallback
  }
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  return settings;
}

// --- Wishlist Management ---

export function getSavedWishlist(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(ids: string[]): void {
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(ids));
}

// --- Customer Likes & Hearts Analytics ---

export async function recordOutfitHeart(productId: string, productName?: string, sku?: string): Promise<void> {
  try {
    await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, productName, sku })
    });
  } catch {
    // Backend offline fallback
  }

  // Also cache locally
  try {
    const raw = localStorage.getItem('the_sewing_bird_likes') || '{}';
    const counts = JSON.parse(raw);
    counts[productId] = (counts[productId] || 0) + 1;
    localStorage.setItem('the_sewing_bird_likes', JSON.stringify(counts));
  } catch {}
}

export async function fetchOutfitLikes(): Promise<{ counts: Record<string, number>; activity: Array<{ productId: string; productName: string; sku: string; timestamp: string }> }> {
  try {
    const res = await fetch('/api/likes');
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  try {
    const raw = localStorage.getItem('the_sewing_bird_likes') || '{}';
    return { counts: JSON.parse(raw), activity: [] };
  } catch {
    return { counts: {}, activity: [] };
  }
}

// --- Cart Management (For Mode B) ---

export function getSavedCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
}

// --- Recently Viewed ---

export function getRecentlyViewed(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(productId: string): string[] {
  const current = getRecentlyViewed().filter(id => id !== productId);
  const updated = [productId, ...current].slice(0, 8);
  localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(updated));
  return updated;
}

// --- Admin Auth ---

export function checkAdminSession(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
}

export function setAdminSession(authenticated: boolean): void {
  if (authenticated) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
}

// --- WhatsApp & Enquiry Link Generator ---

export function generateWhatsAppLink(
  product: Product,
  settings: BrandSettings,
  selectedSize?: string,
  selectedColour?: string
): string {
  const rawNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const productUrl = `${window.location.origin}/?product=${product.slug || product.id}`;
  
  const sizeText = selectedSize ? ` (Size: ${selectedSize})` : '';
  const colourText = selectedColour ? ` (Colour: ${selectedColour})` : '';
  
  let msg = settings.whatsappPrefillMessage || 
    'Hi {brandName}! I would like to enquire about the {productName} (Ref: {sku}){sizeText}{colourText}. Link: {productUrl}';
  
  msg = msg
    .replace('{brandName}', settings.brandName)
    .replace('{productName}', product.name)
    .replace('{sku}', product.sku || product.id)
    .replace('{sizeText}', sizeText)
    .replace('{colourText}', colourText)
    .replace('{productUrl}', productUrl);

  const encodedMsg = encodeURIComponent(msg);
  return `https://wa.me/${rawNumber}?text=${encodedMsg}`;
}

export function generateEmailEnquiry(
  product: Product,
  settings: BrandSettings,
  selectedSize?: string,
  selectedColour?: string
): string {
  const subject = encodeURIComponent(`Outfit Enquiry: ${product.name} (Ref: ${product.sku})`);
  const productUrl = `${window.location.origin}/?product=${product.slug || product.id}`;
  const body = encodeURIComponent(
    `Hello ${settings.brandName},\n\n` +
    `I am interested in enquiring about:\n` +
    `• Product: ${product.name}\n` +
    `• Reference / SKU: ${product.sku}\n` +
    (selectedSize ? `• Size: ${selectedSize}\n` : '') +
    (selectedColour ? `• Colour: ${selectedColour}\n` : '') +
    (product.price ? `• Listed Price: ${settings.currencySymbol}${product.price}\n` : '') +
    `• Link: ${productUrl}\n\n` +
    `Please let me know availability and how I can place an order.\n\nThank you!`
  );

  return `mailto:${settings.enquiryEmail}?subject=${subject}&body=${body}`;
}
