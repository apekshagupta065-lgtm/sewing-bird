import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, BrandSettings, CartItem, FilterState } from '../types';
import { defaultBrandSettings, initialProducts } from '../data/initialData';
import {
  fetchProducts,
  saveProduct as persistProduct,
  deleteProduct as persistDeleteProduct,
  saveBulkProducts as persistBulkProducts,
  resetToDefaultCatalogue,
  fetchBrandSettings,
  saveBrandSettings as persistBrandSettings,
  getSavedWishlist,
  saveWishlist,
  getSavedCart,
  saveCart,
  getRecentlyViewed,
  addRecentlyViewed,
  checkAdminSession,
  setAdminSession,
  recordOutfitHeart
} from '../utils/storage';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export type AppView = 'home' | 'catalogue' | 'product-detail' | 'admin' | 'about' | 'contact';

interface ModalState {
  type: 'quickView' | 'enquiry' | 'search' | 'wishlistDrawer' | 'cartDrawer' | 'adminAuth';
  product?: Product;
  selectedSize?: string;
  selectedColour?: string;
}

interface CatalogueContextType {
  products: Product[];
  isLoading: boolean;
  brandSettings: BrandSettings;
  updateBrandSettings: (newSettings: Partial<BrandSettings>) => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  bulkSaveProducts: (products: Product[]) => Promise<void>;
  resetCatalogue: () => Promise<void>;
  
  // Navigation & Deep linking
  currentView: AppView;
  selectedProductId: string | null;
  navigateTo: (view: AppView, productIdOrSlug?: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Cart (for Mode B e-commerce)
  cart: CartItem[];
  addToCart: (product: Product, selectedSize: string, selectedColour: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  cartCount: number;

  // Recently viewed
  recentlyViewedProducts: Product[];
  recordProductView: (productId: string) => void;

  // Modals & Drawers
  activeModal: ModalState | null;
  openQuickView: (product: Product) => void;
  openEnquiryModal: (product: Product, size?: string, colour?: string) => void;
  openModal: (type: ModalState['type'], extra?: Partial<ModalState>) => void;
  closeModal: () => void;

  // Filters state
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Admin
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'All Outfits',
  sizes: [],
  colours: [],
  priceRange: [0, 150],
  availability: 'all',
  tags: [],
  sortBy: 'featured'
};

const CatalogueContext = createContext<CatalogueContextType | undefined>(undefined);

export function CatalogueProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(defaultBrandSettings);
  
  // Navigation state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Wishlist & Cart
  const [wishlist, setWishlistState] = useState<string[]>([]);
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Modals
  const [activeModal, setActiveModal] = useState<ModalState | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Initialize data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [loadedProducts, loadedSettings] = await Promise.all([
          fetchProducts(),
          fetchBrandSettings()
        ]);
        setProducts(loadedProducts);
        setBrandSettings(loadedSettings);
      } catch (err) {
        console.error('Error loading initial catalogue data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
    setWishlistState(getSavedWishlist());
    setCartState(getSavedCart());
    setRecentIds(getRecentlyViewed());
    setIsAdminLoggedIn(checkAdminSession());

    // Check URL parameters for direct product deep-link or view routing
    const params = new URLSearchParams(window.location.search);
    const prodParam = params.get('product');
    const viewParam = params.get('view') as AppView | null;
    const catParam = params.get('category');

    if (prodParam) {
      setSelectedProductId(prodParam);
      setCurrentView('product-detail');
    } else if (viewParam) {
      setCurrentView(viewParam);
    }

    if (catParam) {
      setFilters(prev => ({ ...prev, category: catParam }));
    }
  }, []);

  // Sync browser URL when view changes
  const navigateTo = useCallback((view: AppView, productIdOrSlug?: string) => {
    setCurrentView(view);
    const url = new URL(window.location.href);

    if (view === 'product-detail' && productIdOrSlug) {
      setSelectedProductId(productIdOrSlug);
      url.searchParams.set('product', productIdOrSlug);
      url.searchParams.delete('view');
    } else {
      setSelectedProductId(null);
      url.searchParams.delete('product');
      if (view === 'home') {
        url.searchParams.delete('view');
      } else {
        url.searchParams.set('view', view);
      }
    }
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const prodParam = params.get('product');
      const viewParam = params.get('view') as AppView | null;
      if (prodParam) {
        setSelectedProductId(prodParam);
        setCurrentView('product-detail');
      } else if (viewParam) {
        setCurrentView(viewParam);
        setSelectedProductId(null);
      } else {
        setCurrentView('home');
        setSelectedProductId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save product handlers
  const handleSaveProduct = async (product: Product) => {
    const updated = await persistProduct(product);
    setProducts(updated);
    showToast(`"${product.name}" saved successfully!`, 'success');
  };

  const handleDeleteProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    const updated = await persistDeleteProduct(id);
    setProducts(updated);
    showToast(`Removed "${product ? product.name : 'product'}" from catalogue`, 'info');
  };

  const handleBulkSaveProducts = async (newProducts: Product[]) => {
    const updated = await persistBulkProducts(newProducts);
    setProducts(updated);
    showToast(`Bulk updated ${newProducts.length} products!`, 'success');
  };

  const handleResetCatalogue = async () => {
    const defaultData = await resetToDefaultCatalogue();
    setProducts(defaultData);
    showToast('Reset catalogue to curated starter collection.', 'info');
  };

  const handleUpdateBrandSettings = async (newSettings: Partial<BrandSettings>) => {
    const merged = { ...brandSettings, ...newSettings };
    const saved = await persistBrandSettings(merged);
    setBrandSettings(saved);
    showToast('Brand settings updated.', 'success');
  };

  // Wishlist handlers
  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    let updated: string[];
    const product = products.find(p => p.id === productId);
    const title = product ? product.name : 'Outfit';

    if (exists) {
      updated = wishlist.filter(id => id !== productId);
      showToast(`Removed "${title}" from favourites`, 'info');
    } else {
      updated = [...wishlist, productId];
      recordOutfitHeart(productId, product?.name, product?.sku);
      showToast(`Loved "${title}"! Our studio has received your interest ❤️`, 'success');
    }
    setWishlistState(updated);
    saveWishlist(updated);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart handlers (Mode B)
  const addToCart = (product: Product, selectedSize: string, selectedColour: string, quantity = 1) => {
    const cartItemId = `${product.id}-${selectedSize}-${selectedColour}`;
    const existingIndex = cart.findIndex(item => item.id === cartItemId);
    let updated: CartItem[];

    if (existingIndex >= 0) {
      updated = [...cart];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [
        ...cart,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedSize,
          selectedColour,
          quantity
        }
      ];
    }
    setCartState(updated);
    saveCart(updated);
    showToast(`Added "${product.name}" (${selectedSize}) to bag!`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    const updated = cart.filter(item => item.id !== cartItemId);
    setCartState(updated);
    saveCart(updated);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updated = cart.map(item => item.id === cartItemId ? { ...item, quantity } : item);
    setCartState(updated);
    saveCart(updated);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Recently viewed
  const recordProductView = (productId: string) => {
    const updated = addRecentlyViewed(productId);
    setRecentIds(updated);
  };

  const recentlyViewedProducts = recentIds
    .map(id => products.find(p => p.id === id || p.slug === id))
    .filter((p): p is Product => Boolean(p));

  // Modal helpers
  const openQuickView = (product: Product) => {
    setActiveModal({ type: 'quickView', product });
  };

  const openEnquiryModal = (product: Product, size?: string, colour?: string) => {
    setActiveModal({
      type: 'enquiry',
      product,
      selectedSize: size || product.availableSizes[0],
      selectedColour: colour || product.availableColours[0]?.name
    });
  };

  const openModal = (type: ModalState['type'], extra?: Partial<ModalState>) => {
    setActiveModal({ type, ...extra });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Admin auth
  // Simple password gate for dashboard demonstration: 'blossom' or 'sewingbird' or custom
  const loginAdmin = (password: string) => {
    if (password === 'blossom' || password === 'sewingbird' || password === 'admin123') {
      setIsAdminLoggedIn(true);
      setAdminSession(true);
      showToast('Welcome to the Boutique Manager dashboard!', 'success');
      return true;
    }
    showToast('Incorrect passcode. Try "blossom"', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminSession(false);
    showToast('Logged out of Admin dashboard', 'info');
    navigateTo('home');
  };

  return (
    <CatalogueContext.Provider
      value={{
        products,
        isLoading,
        brandSettings,
        updateBrandSettings: handleUpdateBrandSettings,
        saveProduct: handleSaveProduct,
        deleteProduct: handleDeleteProduct,
        bulkSaveProducts: handleBulkSaveProducts,
        resetCatalogue: handleResetCatalogue,
        currentView,
        selectedProductId,
        navigateTo,
        wishlist,
        toggleWishlist,
        isInWishlist,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        cartCount,
        recentlyViewedProducts,
        recordProductView,
        activeModal,
        openQuickView,
        openEnquiryModal,
        openModal,
        closeModal,
        filters,
        setFilters,
        resetFilters,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </CatalogueContext.Provider>
  );
}

export function useCatalogue() {
  const context = useContext(CatalogueContext);
  if (!context) {
    throw new Error('useCatalogue must be used within a CatalogueProvider');
  }
  return context;
}
