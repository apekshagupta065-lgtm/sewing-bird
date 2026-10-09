import { Product, BrandSettings } from '../types';

export const defaultBrandSettings: BrandSettings = {
  brandName: 'The Sewing Bird',
  secondaryName: "Children's Clothing Boutique",
  tagline: "Handcrafted Children's Clothing Catalogue",
  announcements: [
    '✨ Handcrafted children’s clothing made with love and gentle care',
    '🌿 Cut from 100% breathable organic cotton & skin-kind natural weaves',
    '💬 Direct WhatsApp enquiries & custom size tailoring available',
    '🌸 Made for tiny moments and cherished memories'
  ],
  announcementIntervalSec: 5,
  whatsappNumber: '+1 234 567 8900', // Owner can change in Admin panel
  whatsappPrefillMessage: 'Hello {brandName}! I would like to enquire about the {productName} (Ref: {sku}){sizeText}{colourText}. Could you share availability and ordering details? Link: {productUrl}',
  enquiryEmail: 'hello@thesewingbird.com',
  currencySymbol: '$',
  catalogueMode: 'enquiry', // 'enquiry' (Mode A) or 'ecommerce' (Mode B)
  enablePrices: true,
  instagramHandle: '@thesewingbird',
  supportPhone: '+1 (555) 019-2834',
  aboutStory: {
    heroTitle: 'Crafted for Soft Mornings & Barefoot Adventures',
    subtitle: 'From delicate smocking to heirloom cotton stitches, we believe childhood clothes should feel like a gentle hug.',
    paragraphs: [
      'Founded with a heart for slow, intentional craftsmanship, The Sewing Bird creates thoughtful children\'s clothing that bridges the charm of vintage heirlooms with the carefree ease of modern play.',
      'Every dress, romper, and co-ord set is cut from premium GOTS-certified organic cotton, airy double gauze, and washed linens. We obsess over the quiet details—flat-felled French seams that never scratch tender skin, coconut shell buttons, and soft elastic bands that allow curious minds to climb, twirl, and explore unhindered.'
    ],
    values: [
      {
        title: '100% Breathable Organic Cotton',
        description: 'Naturally hypoallergenic, skin-kind, and pre-washed for zero shrinkage and butter-soft touch.',
        icon: 'Feather'
      },
      {
        title: 'Heirloom Handcrafting',
        description: 'Tender hand-smocking, reinforced knees, and French seams designed to be passed down through siblings.',
        icon: 'Heart'
      },
      {
        title: 'Play-Tested Comfort',
        description: 'Generous cuts that accommodate diapers and dynamic movement without pinch points.',
        icon: 'Sparkles'
      },
      {
        title: 'Conscious & Sustainable',
        description: 'Zero plastic packaging, plant-based dyes, and zero-waste fabric offcut recycling.',
        icon: 'Leaf'
      }
    ]
  }
};

export const initialProducts: Product[] = [
  {
    id: 'cbc-prod-001',
    name: 'Peony Blossom Smocked Cotton Dress',
    slug: 'peony-blossom-smocked-cotton-dress',
    sku: 'CBC-DR-001',
    category: 'Dresses',
    description: 'A timeless heirloom silhouette featuring intricate hand-smocking across the bodice, delicate flutter sleeves, and a generous twirl skirt. Cut from whisper-soft 100% organic cotton voile with a built-in breathable lining.',
    price: 48,
    originalPrice: 56,
    availableSizes: ['6-12M', '12-18M', '18-24M', '2-3Y', '3-4Y', '4-5Y'],
    availableColours: [
      { name: 'Blush Pink', hex: '#FAD2CF' },
      { name: 'Cream Ivory', hex: '#FAF5ED' },
      { name: 'Muted Sage', hex: '#D2DEC9' }
    ],
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['smocked', 'heirloom', 'dress', 'organic-cotton', 'bestseller'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    availabilityStatus: 'in_stock',
    material: '100% GOTS Certified Organic Cotton Voile with pure cotton lining',
    careInstructions: [
      'Gentle machine wash cold in laundry bag (30°C)',
      'Line dry in shade to preserve smocking elasticity',
      'Warm iron on reverse if desired',
      'Do not bleach or tumble dry'
    ],
    createdAt: '2026-03-01T10:00:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-002',
    name: 'Buttercup Meadow Ruffle Co-ord Set',
    slug: 'buttercup-meadow-ruffle-coord-set',
    sku: 'CBC-SET-002',
    category: 'Co-ord Sets',
    description: 'Charming two-piece ensemble comprising a ruffled peplum camisole top and matching bloomers with soft, non-marking leg elastics. Features hand-embroidered buttercup sprigs along the scalloped hem.',
    price: 42,
    availableSizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M', '2-3Y'],
    availableColours: [
      { name: 'Butter Yellow', hex: '#FCF1C8' },
      { name: 'Soft Peach', hex: '#FCE0D2' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ],
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['two-piece', 'bloomers', 'summer', 'yellow', 'organic'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    availabilityStatus: 'in_stock',
    material: '100% Organic Double Gauze Cotton',
    careInstructions: [
      'Machine wash delicate cycle 30°C',
      'Natural air dry recommended',
      'Low iron only'
    ],
    createdAt: '2026-03-05T12:00:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-003',
    name: 'Oatmeal Waffle Knit Bubble Romper',
    slug: 'oatmeal-waffle-knit-bubble-romper',
    sku: 'CBC-RM-003',
    category: 'Rompers & Onesies',
    description: 'Our most-loved gender-neutral bubble romper, tailored from tactile thermal waffle cotton. Features engraved coconut shell chest buttons and concealed snap closures along the inner leg for quick diaper changes.',
    price: 36,
    availableSizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
    availableColours: [
      { name: 'Oatmeal', hex: '#EBE4D8' },
      { name: 'Warm Terracotta', hex: '#E29A78' },
      { name: 'Eucalyptus Sage', hex: '#C7D8C6' }
    ],
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['gender-neutral', 'waffle-knit', 'romper', 'everyday', 'bestseller'],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    availabilityStatus: 'in_stock',
    material: '100% Organic Heavy Waffle Knit Cotton (280 GSM)',
    careInstructions: [
      'Machine wash cold with similar colours',
      'Tumble dry low or dry flat',
      'Do not wring'
    ],
    createdAt: '2026-02-15T09:00:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-004',
    name: 'French Linen Pinafore Dress & Bloomer Duo',
    slug: 'french-linen-pinafore-dress',
    sku: 'CBC-DR-004',
    category: 'Dresses',
    description: 'Cross-back pinafore dress made from softened stone-washed Normandy flax linen blended with organic cotton. Features adjustable coconut buttons on the straps to grow with your child over seasons.',
    price: 52,
    originalPrice: 62,
    availableSizes: ['12-18M', '18-24M', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    availableColours: [
      { name: 'Rose Dust', hex: '#E8B4B8' },
      { name: 'Flax Natural', hex: '#E2DAC8' },
      { name: 'Sage Green', hex: '#B8CDB8' }
    ],
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['linen', 'pinafore', 'cross-back', 'layering', 'autumn-spring'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    availabilityStatus: 'in_stock',
    material: '55% French Flax Linen, 45% Organic Cotton',
    careInstructions: [
      'Gentle cold wash',
      'Shake flat while damp to relax linen fibres',
      'Iron with steam while slightly damp'
    ],
    createdAt: '2026-03-08T14:30:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-005',
    name: 'Vintage Daisy Tiered Cotton Frock',
    slug: 'vintage-daisy-tiered-cotton-frock',
    sku: 'CBC-DR-005',
    category: 'Dresses',
    description: 'A cheerful sun-drenched frock with micro-daisy prints inspired by 1970s European prairie dresses. Three tiered gathers give it a full silhouette that twirls effortlessly during garden picnics.',
    price: 45,
    availableSizes: ['18-24M', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    availableColours: [
      { name: 'Daisy Yellow', hex: '#FDF0B5' },
      { name: 'Sky Blue', hex: '#CFE5F5' },
      { name: 'Soft Cream', hex: '#FAF8F0' }
    ],
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['floral', 'twirl-dress', 'vintage', 'summer', 'dresses'],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    availabilityStatus: 'in_stock',
    material: '100% Lightweight Organic Cambric Cotton',
    careInstructions: [
      'Machine wash 30°C inside out',
      'Hang dry in shade',
      'Medium heat iron'
    ],
    createdAt: '2026-03-02T16:00:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-006',
    name: 'Cinnamon Corduroy Overalls & Stripe Tee',
    slug: 'cinnamon-corduroy-overalls-stripe-tee',
    sku: 'CBC-EW-006',
    category: 'Everyday Wear',
    description: 'Plush baby-cord overalls in rich cinnamon brown accompanied by an ultra-soft Breton striped organic jersey tee. Roomy patch pockets in front hold precious pebbles, shells, and garden treasures.',
    price: 49,
    availableSizes: ['6-12M', '12-18M', '18-24M', '2-3Y', '3-4Y'],
    availableColours: [
      { name: 'Cinnamon', hex: '#C16A46' },
      { name: 'Forest Moss', hex: '#637059' },
      { name: 'Navy Stone', hex: '#3B4856' }
    ],
    images: [
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['corduroy', 'overalls', 'dungarees', 'playwear', 'bestseller'],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    availabilityStatus: 'in_stock',
    material: '100% Cotton Fine Wale Corduroy; Tee: 100% Organic Cotton Jersey',
    careInstructions: [
      'Wash inside out to protect cord nap',
      'Do not iron corduroy directly on face',
      'Tumble dry low'
    ],
    createdAt: '2026-02-20T11:00:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-007',
    name: 'Sweet Lavender Bow-Back Sundress',
    slug: 'sweet-lavender-bow-back-sundress',
    sku: 'CBC-DR-007',
    category: 'Dresses',
    description: 'A showstopper for birthdays and family celebrations. Cut with an open back featuring a dramatic self-fabric tie bow and delicate broderie anglaise eyelet detailing at the scalloped hem.',
    price: 54,
    availableSizes: ['12-18M', '18-24M', '2-3Y', '3-4Y', '4-5Y'],
    availableColours: [
      { name: 'Lavender Mist', hex: '#E5DCF2' },
      { name: 'Alabaster White', hex: '#FDFBF7' },
      { name: 'Blush Carnation', hex: '#F7CBD2' }
    ],
    images: [
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['occasion', 'bow-back', 'eyelet', 'party-dress', 'dresses'],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    availabilityStatus: 'low_stock',
    material: '100% Organic Broderie Anglaise Cotton',
    careInstructions: [
      'Hand wash or delicate machine wash cold',
      'Do not tumble dry',
      'Iron with pressing cloth'
    ],
    createdAt: '2026-03-04T15:00:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-008',
    name: 'Seafoam Gingham Kimono Romper',
    slug: 'seafoam-gingham-kimono-romper',
    sku: 'CBC-RM-008',
    category: 'Rompers & Onesies',
    description: 'Japanese-inspired cross-body kimono wrap romper in soft yarn-dyed seafoam green gingham. Fastened with gentle twill ribbon ties on the outer side and interior cotton snap anchors.',
    price: 38,
    availableSizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
    availableColours: [
      { name: 'Seafoam Gingham', hex: '#CBE5D9' },
      { name: 'Rose Gingham', hex: '#F7D6D8' },
      { name: 'Sand Gingham', hex: '#EADFC9' }
    ],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['kimono', 'gingham', 'newborn', 'romper', 'baby-gift'],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    availabilityStatus: 'in_stock',
    material: '100% Yarn-Dyed Combed Cotton Gauze',
    careInstructions: [
      'Wash at 30°C with mild liquid detergent',
      'Do not soak or bleach',
      'Dries quickly on a flat rack'
    ],
    createdAt: '2026-03-06T09:15:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-009',
    name: 'Starlight Organic Cotton Sleepwear Set',
    slug: 'starlight-organic-cotton-sleepwear-set',
    sku: 'CBC-SLP-009',
    category: 'Sleepwear',
    description: 'Buttery-soft two-piece pyjama set with gentle stretch rib cuffs that stay in place all night. Decorated with subtle celestial stars printed with certified eco water-based inks.',
    price: 34,
    availableSizes: ['12-18M', '18-24M', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    availableColours: [
      { name: 'Midnight Starlight', hex: '#D6E2E9' },
      { name: 'Cloud Pink', hex: '#F9DFE4' },
      { name: 'Vanilla Bean', hex: '#F8F5EB' }
    ],
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['sleepwear', 'pyjamas', 'cozy', 'organic', 'bedtime'],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    availabilityStatus: 'in_stock',
    material: '95% Organic Cotton, 5% Elastane for snug stretch retention',
    careInstructions: [
      'Machine wash warm 40°C',
      'Tumble dry gentle',
      'Safe for iron on reverse'
    ],
    createdAt: '2026-01-25T14:00:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-010',
    name: 'Terracotta Sunshine Tiered Playdress',
    slug: 'terracotta-sunshine-tiered-playdress',
    sku: 'CBC-DR-010',
    category: 'Dresses',
    description: 'An everyday celebration of warm, earthy colors. Cut from crinkled double-cloth cotton that requires zero ironing—perfect for busy parents and playful toddlers.',
    price: 44,
    availableSizes: ['12-18M', '18-24M', '2-3Y', '3-4Y', '4-5Y'],
    availableColours: [
      { name: 'Terracotta', hex: '#D97A53' },
      { name: 'Golden Honey', hex: '#EFC050' },
      { name: 'Oatmeal', hex: '#ECE3D4' }
    ],
    images: [
      'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['earth-tones', 'playdress', 'double-gauze', 'dresses'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    availabilityStatus: 'in_stock',
    material: '100% Crinkle Cotton Double Gauze',
    careInstructions: [
      'Wash cold, line dry for iconic crinkle texture',
      'No iron needed'
    ],
    createdAt: '2026-03-07T11:20:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-011',
    name: 'Eyelet Lace Cottagecore Blouse & Culottes',
    slug: 'eyelet-lace-cottagecore-blouse-culottes',
    sku: 'CBC-TB-011',
    category: 'Tops & Bottoms',
    description: 'Breezy Peter Pan collar blouse with eyelet lace trimming paired with wide-leg cropped culottes featuring an elasticated paperbag waist.',
    price: 46,
    availableSizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    availableColours: [
      { name: 'Antique White', hex: '#F9F7F1' },
      { name: 'Dusty Peach', hex: '#F5C6B8' }
    ],
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['peter-pan-collar', 'blouse', 'culottes', 'cottagecore'],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    availabilityStatus: 'in_stock',
    material: '100% Pre-Washed Cotton Slub',
    careInstructions: [
      'Delicate machine wash',
      'Iron collar flat'
    ],
    createdAt: '2026-02-18T10:00:00Z',
    isUserPhoto: false
  },
  {
    id: 'cbc-prod-012',
    name: 'Heirloom Pointelle Bonnet & Booties Set',
    slug: 'heirloom-pointelle-bonnet-booties-set',
    sku: 'CBC-ACC-012',
    category: 'Accessories',
    description: 'Delicate open-work pointelle knitted bonnet and matching soft tie booties crafted from silky pima cotton yarn. The ultimate keepsake gift for newborn arrivals.',
    price: 28,
    availableSizes: ['0-3M', '3-6M', '6-12M'],
    availableColours: [
      { name: 'Ivory Cream', hex: '#FAF7EE' },
      { name: 'Blush Powder', hex: '#FBE4E7' },
      { name: 'Sage Tint', hex: '#D7E2D7' }
    ],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    ],
    coverImageIndex: 0,
    tags: ['bonnet', 'booties', 'newborn-gift', 'keepsake', 'accessories'],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    availabilityStatus: 'in_stock',
    material: '100% Peruvian Pima Cotton Knit',
    careInstructions: [
      'Hand wash gently in tepid water with baby soap',
      'Dry flat between dry towels'
    ],
    createdAt: '2026-02-10T08:00:00Z',
    isUserPhoto: false
  }
];

export const CATEGORIES_LIST = [
  'All Outfits',
  'Dresses',
  'Co-ord Sets',
  'Rompers & Onesies',
  'Everyday Wear',
  'Tops & Bottoms',
  'Sleepwear',
  'Accessories'
] as const;

export const SIZES_LIST = [
  '0-3M',
  '3-6M',
  '6-12M',
  '12-18M',
  '18-24M',
  '2-3Y',
  '3-4Y',
  '4-5Y',
  '5-6Y'
] as const;

export const COLOUR_PALETTE_LIST = [
  { name: 'Blush Pink', hex: '#FAD2CF' },
  { name: 'Butter Yellow', hex: '#FCF1C8' },
  { name: 'Sage Green', hex: '#D2DEC9' },
  { name: 'Cream Ivory', hex: '#FAF5ED' },
  { name: 'Terracotta', hex: '#D97A53' },
  { name: 'Lavender Mist', hex: '#E5DCF2' },
  { name: 'Sky Blue', hex: '#CFE5F5' },
  { name: 'Oatmeal Natural', hex: '#EBE4D8' },
  { name: 'Pure White', hex: '#FFFFFF' }
];
