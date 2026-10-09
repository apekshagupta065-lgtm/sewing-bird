/**
 * Types for The Sewing Bird Children's Clothing Catalogue
 */

export type ProductCategory = 
  | 'Dresses'
  | 'Co-ord Sets'
  | 'Everyday Wear'
  | 'Rompers & Onesies'
  | 'Tops & Bottoms'
  | 'Sleepwear'
  | 'Accessories';

export type AvailabilityStatus = 
  | 'in_stock' 
  | 'low_stock' 
  | 'made_to_order' 
  | 'out_of_stock';

export interface ColourSwatch {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: ProductCategory | string;
  description: string;
  price?: number;
  originalPrice?: number;
  availableSizes: string[];
  availableColours: ColourSwatch[];
  images: string[];
  coverImageIndex: number;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller?: boolean;
  availabilityStatus: AvailabilityStatus;
  material: string;
  careInstructions: string[];
  createdAt: string;
  updatedAt?: string;
  isUserPhoto?: boolean; // flags whether user has substituted their own photo vs starter placeholder
}

export interface BrandSettings {
  brandName: string;
  secondaryName: string;
  tagline: string;
  announcements: string[];
  announcementIntervalSec: number;
  whatsappNumber: string;
  whatsappPrefillMessage: string;
  enquiryEmail: string;
  currencySymbol: string;
  catalogueMode: 'enquiry' | 'ecommerce';
  enablePrices: boolean;
  instagramHandle: string;
  supportPhone: string;
  aboutStory: {
    heroTitle: string;
    subtitle: string;
    paragraphs: string[];
    values: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
}

export interface FilterState {
  searchQuery: string;
  category: string;
  sizes: string[];
  colours: string[];
  priceRange: [number, number];
  availability: string;
  tags: string[];
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'name-asc';
}

export interface CartItem {
  id: string; // unique item uuid (product + size + colour)
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColour: string;
  quantity: number;
}

export interface EnquiryRequest {
  productId?: string;
  productName: string;
  sku: string;
  selectedSize?: string;
  selectedColour?: string;
  productUrl?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  message?: string;
}
