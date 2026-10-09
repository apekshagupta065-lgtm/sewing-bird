import React, { useState, useRef, useEffect } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { Product, ProductCategory, AvailabilityStatus, ColourSwatch } from '../../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  X, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ExternalLink, 
  LogOut, 
  Save, 
  RefreshCw, 
  Download, 
  HelpCircle, 
  FileText, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  MessageCircle,
  Eye,
  Camera,
  CheckCircle2,
  AlertCircle,
  Heart
} from 'lucide-react';
import { CATEGORIES_LIST, SIZES_LIST, COLOUR_PALETTE_LIST } from '../../data/initialData';
import { fetchOutfitLikes } from '../../utils/storage';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    brandSettings, 
    updateBrandSettings, 
    saveProduct, 
    deleteProduct, 
    bulkSaveProducts, 
    resetCatalogue, 
    logoutAdmin, 
    navigateTo, 
    showToast 
  } = useCatalogue();

  const [activeTab, setActiveTab] = useState<'inventory' | 'batchUploader' | 'likes' | 'settings' | 'guide' | 'backup'>('inventory');
  
  // Likes & Heart Analytics State
  const [likesData, setLikesData] = useState<{ counts: Record<string, number>; activity: Array<{ productId: string; productName: string; sku: string; timestamp: string }> }>({ counts: {}, activity: [] });

  useEffect(() => {
    async function loadLikes() {
      const data = await fetchOutfitLikes();
      setLikesData(data);
    }
    loadLikes();
  }, [activeTab]);
  
  // Search & Filter in Inventory
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Delete Confirmation Modal State
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);

  // Edit / Add Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Batch Image Uploader State
  const [batchFiles, setBatchFiles] = useState<{ id: string; name: string; url: string; selected: boolean }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [targetProductForBatch, setTargetProductForBatch] = useState<string>('');
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  // Brand Settings Form State
  const [settingsForm, setSettingsForm] = useState(brandSettings);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  // Filtered Inventory List
  const filteredInventory = products.filter(p => {
    const term = searchFilter.toLowerCase();
    const matchesSearch = !term || p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term);
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Open Edit Outfit Modal
  const handleStartEdit = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setIsNewProduct(false);
  };

  // Open Create Outfit Modal
  const handleStartCreate = () => {
    const newId = `cbc-prod-${Date.now()}`;
    const emptyProduct: Product = {
      id: newId,
      name: '',
      slug: '',
      sku: `CBC-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Dresses',
      description: '',
      price: 45,
      availableSizes: ['6-12M', '12-18M', '18-24M', '2-3Y'],
      availableColours: [
        { name: 'Blush Pink', hex: '#FAD2CF' },
        { name: 'Cream Ivory', hex: '#FAF5ED' }
      ],
      images: [],
      coverImageIndex: 0,
      tags: ['organic-cotton', 'handmade'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      availabilityStatus: 'in_stock',
      material: '100% GOTS Certified Organic Cotton Voile',
      careInstructions: [
        'Gentle machine wash cold (30°C)',
        'Line dry in shade to preserve soft fibres',
        'Warm iron if desired'
      ],
      createdAt: new Date().toISOString(),
      isUserPhoto: true
    };
    setEditingProduct(emptyProduct);
    setIsNewProduct(true);
  };

  // Handle Save Product
  const handleSaveEditingProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      showToast('Please provide a name for the outfit', 'error');
      return;
    }
    if (editingProduct.images.length === 0) {
      showToast('Please upload or provide at least one photo for the outfit', 'error');
      return;
    }

    const slug = editingProduct.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const finalProduct: Product = {
      ...editingProduct,
      slug: slug || editingProduct.id,
      coverImageIndex: Math.min(editingProduct.coverImageIndex, editingProduct.images.length - 1)
    };

    await saveProduct(finalProduct);
    setEditingProduct(null);
  };

  // Handle File Upload for editing product
  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: base64, filename: file.name })
          });
          if (res.ok) {
            const data = await res.json();
            setEditingProduct(prev => prev ? {
              ...prev,
              images: [...prev.images, data.url],
              isUserPhoto: true
            } : null);
          } else {
            // Fallback to data URL
            setEditingProduct(prev => prev ? {
              ...prev,
              images: [...prev.images, base64],
              isUserPhoto: true
            } : null);
          }
        } catch {
          setEditingProduct(prev => prev ? {
            ...prev,
            images: [...prev.images, base64],
            isUserPhoto: true
          } : null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Batch Image Uploader File Drop / Pick Handler
  const handleBatchFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setUploadProgress(10);

    let completed = 0;
    const newBatchItems: { id: string; name: string; url: string; selected: boolean }[] = [];

    fileList.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        let savedUrl = base64;

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: base64, filename: file.name })
          });
          if (res.ok) {
            const data = await res.json();
            savedUrl = data.url;
          }
        } catch {
          // Keep base64 data URL
        }

        newBatchItems.push({
          id: `batch-${Date.now()}-${index}`,
          name: file.name,
          url: savedUrl,
          selected: true
        });

        completed++;
        setUploadProgress(Math.round((completed / fileList.length) * 100));

        if (completed === fileList.length) {
          setBatchFiles(prev => [...newBatchItems, ...prev]);
          showToast(`Uploaded ${completed} photographs to photo tray!`, 'success');
          setTimeout(() => setUploadProgress(null), 1200);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Attach Selected Photos to Existing Outfit
  const handleAttachBatchToProduct = async () => {
    const selectedUrls = batchFiles.filter(b => b.selected).map(b => b.url);
    if (selectedUrls.length === 0) {
      showToast('Please select at least one photo from the tray', 'error');
      return;
    }
    if (!targetProductForBatch) {
      showToast('Please select which outfit to attach these photos to', 'error');
      return;
    }

    const targetProd = products.find(p => p.id === targetProductForBatch);
    if (!targetProd) return;

    const updatedProd: Product = {
      ...targetProd,
      images: [...targetProd.images, ...selectedUrls],
      isUserPhoto: true,
      updatedAt: new Date().toISOString()
    };

    await saveProduct(updatedProd);
    // Remove attached files from tray
    setBatchFiles(prev => prev.filter(b => !b.selected));
    showToast(`Attached ${selectedUrls.length} photos to "${targetProd.name}"!`, 'success');
  };

  // Create New Outfit Directly from Selected Tray Photos
  const handleCreateOutfitFromBatch = () => {
    const selectedPhotos = batchFiles.filter(b => b.selected);
    if (selectedPhotos.length === 0) {
      showToast('Select photos from tray first', 'error');
      return;
    }

    const newId = `cbc-prod-${Date.now()}`;
    const firstFileName = selectedPhotos[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const autoTitle = firstFileName.charAt(0).toUpperCase() + firstFileName.slice(1);

    const draft: Product = {
      id: newId,
      name: autoTitle || 'New Cotton Outfit',
      slug: (autoTitle || 'new-cotton-outfit').toLowerCase().replace(/\s+/g, '-'),
      sku: `CBC-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Dresses',
      description: 'Handcrafted cotton outfit featuring breathable weave, gentle elastic gathers, and heirloom detailing.',
      price: 45,
      availableSizes: ['6-12M', '12-18M', '18-24M', '2-3Y', '3-4Y'],
      availableColours: [
        { name: 'Blush Pink', hex: '#FAD2CF' },
        { name: 'Ivory Cream', hex: '#FAF5ED' }
      ],
      images: selectedPhotos.map(b => b.url),
      coverImageIndex: 0,
      tags: ['handcrafted', 'organic-cotton', 'new'],
      isFeatured: true,
      isNewArrival: true,
      availabilityStatus: 'in_stock',
      material: '100% GOTS Certified Organic Cotton',
      careInstructions: [
        'Gentle machine wash cold 30°C',
        'Line dry in shade',
        'Warm iron on reverse'
      ],
      createdAt: new Date().toISOString(),
      isUserPhoto: true
    };

    setEditingProduct(draft);
    setIsNewProduct(true);
    // Remove attached files from tray
    setBatchFiles(prev => prev.filter(b => !b.selected));
  };

  // Save Brand Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBrandSettings(settingsForm);
  };

  // Export Catalogue as JSON
  const handleExportJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      brandSettings,
      products
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-sewing-bird-catalogue-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Catalogue backup downloaded successfully!', 'success');
  };

  // Import Catalogue JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (Array.isArray(parsed.products)) {
          await bulkSaveProducts(parsed.products);
          if (parsed.brandSettings) {
            await updateBrandSettings(parsed.brandSettings);
          }
          showToast(`Successfully imported ${parsed.products.length} outfits from backup!`, 'success');
        } else if (Array.isArray(parsed)) {
          await bulkSaveProducts(parsed);
          showToast(`Successfully imported ${parsed.length} outfits!`, 'success');
        } else {
          showToast('Invalid JSON file format', 'error');
        }
      } catch (err) {
        showToast('Failed to parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      
      {/* Top Header Bar */}
      <div className="bg-white border-b border-[#EAE1D3] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3DB5C3]/15 text-[#1C7F8C] rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-[#20242B] flex items-center gap-2">
                <span>Boutique Manager Dashboard</span>
                <span className="text-[10px] bg-[#E8F5F1] text-[#1F8769] font-sans px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Admin Active
                </span>
              </h1>
              <p className="text-xs text-[#717A88]">
                {brandSettings.brandName} · {products.length} outfits in catalogue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => navigateTo('catalogue')}
              className="px-3.5 py-2 text-xs font-semibold bg-[#FAF7F2] hover:bg-[#F2ECE0] text-[#2D3139] rounded-xl border border-[#DDD3C2] flex items-center gap-1.5 transition-colors"
            >
              <Eye size={14} />
              <span>Preview Live Store</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="p-2 text-[#7F8895] hover:text-[#DC2626] rounded-xl hover:bg-[#FEE2E2]/60 transition-colors"
              title="Logout from manager"
            >
              <LogOut size={16} />
            </button>
          </div>

        </div>

        {/* Tab Navigation Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'inventory'
                ? 'border-[#D96B43] text-[#D96B43]'
                : 'border-transparent text-[#616B78] hover:text-[#20242B]'
            }`}
          >
            <Layers size={14} />
            <span>Catalogue Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('batchUploader')}
            className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'batchUploader'
                ? 'border-[#D96B43] text-[#D96B43]'
                : 'border-transparent text-[#616B78] hover:text-[#20242B]'
            }`}
          >
            <Camera size={14} />
            <span className="font-bold text-[#1F8769]">Photo Batch Uploader</span>
            {batchFiles.length > 0 && (
              <span className="bg-[#1F8769] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {batchFiles.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('likes')}
            className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'likes'
                ? 'border-[#D96B43] text-[#D96B43]'
                : 'border-transparent text-[#616B78] hover:text-[#20242B]'
            }`}
          >
            <Heart size={14} className="text-[#E88065] fill-[#E88065]" />
            <span>Customer Hearts & Interest</span>
            {Object.keys(likesData.counts).length > 0 && (
              <span className="bg-[#E88065] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {Object.values(likesData.counts).reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'border-[#D96B43] text-[#D96B43]'
                : 'border-transparent text-[#616B78] hover:text-[#20242B]'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Brand & WhatsApp Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'guide'
                ? 'border-[#D96B43] text-[#D96B43]'
                : 'border-transparent text-[#616B78] hover:text-[#20242B]'
            }`}
          >
            <HelpCircle size={14} />
            <span>Photo Upload Instructions</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'border-[#D96B43] text-[#D96B43]'
                : 'border-transparent text-[#616B78] hover:text-[#20242B]'
            }`}
          >
            <Download size={14} />
            <span>Backup & Export</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ==================== TAB 1: INVENTORY MANAGEMENT ==================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Top Inventory Toolbar */}
            <div className="p-4 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs flex flex-wrap items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3 top-3 text-[#8A93A0]" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search outfit title or SKU..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#D96B43]"
                  />
                </div>

                {/* Category selector */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2D3139] focus:outline-hidden"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES_LIST.filter(c => c !== 'All Outfits').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('batchUploader')}
                  className="px-3.5 py-2.5 bg-[#E8F5F1] hover:bg-[#D4EFE6] text-[#1F8769] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-[#CDEAE0]"
                >
                  <Camera size={14} />
                  <span>Batch Upload Photos</span>
                </button>

                <button
                  onClick={handleStartCreate}
                  className="px-4 py-2.5 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus size={15} />
                  <span>Add New Outfit</span>
                </button>
              </div>

            </div>

            {/* Inventory Table / Cards */}
            <div className="bg-white rounded-2xl border border-[#EAE1D3] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#4A515D]">
                  <thead className="bg-[#FAF7F2] text-[#20242B] font-semibold border-b border-[#EAE1D3]">
                    <tr>
                      <th className="py-3 px-4">Outfit & Cover Photo</th>
                      <th className="py-3 px-4">SKU / Code</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Photos</th>
                      <th className="py-3 px-4">Status & Badges</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE1D3]">
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#8C95A2]">
                          No outfits found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredInventory.map((item) => (
                        <tr key={item.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-[#E0D7CA] bg-[#FAF7F2] flex-shrink-0">
                                <img
                                  src={item.images[item.coverImageIndex] || item.images[0]}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                                {item.isUserPhoto && (
                                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#1F8769]" title="Custom photo uploaded" />
                                )}
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <h4 className="font-serif font-bold text-sm text-[#20242B] truncate">
                                  {item.name}
                                </h4>
                                <span className="text-[11px] text-[#717A88]">
                                  {item.availableSizes.slice(0, 3).join(', ')}
                                  {item.availableSizes.length > 3 ? ` +${item.availableSizes.length - 3}` : ''}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="py-3 px-4 font-mono text-[11px] text-[#717A88]">
                            {item.sku}
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="font-medium text-[#2D3139]">
                              {item.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-bold text-[#2D3139]">
                            {item.price !== undefined ? `${brandSettings.currencySymbol}${item.price}` : 'On Request'}
                          </td>

                          {/* Photos count */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#DDD3C2] text-[11px] font-medium text-[#555E6B] hover:border-[#D96B43]"
                            >
                              <ImageIcon size={12} className="text-[#D96B43]" />
                              <span>{item.images.length} photos</span>
                            </button>
                          </td>

                          {/* Badges */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {item.isFeatured && (
                                <span className="px-1.5 py-0.5 bg-[#FEF3C7] text-[#92400E] text-[10px] font-semibold rounded-xs">
                                  Featured
                                </span>
                              )}
                              {item.isNewArrival && (
                                <span className="px-1.5 py-0.5 bg-[#E0E7FF] text-[#3730A3] text-[10px] font-semibold rounded-xs">
                                  New
                                </span>
                              )}
                              <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-xs ${
                                item.availabilityStatus === 'in_stock' 
                                  ? 'bg-[#DEF7EC] text-[#03543F]' 
                                  : 'bg-[#FEE2E2] text-[#991B1B]'
                              }`}>
                                {item.availabilityStatus === 'in_stock' ? 'In Stock' : 'Low Stock'}
                              </span>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="p-1.5 text-[#555E6B] hover:text-[#D96B43] rounded-lg hover:bg-white transition-colors"
                                title="Edit Outfit Details & Photos"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => setDeleteCandidate(item)}
                                className="p-1.5 text-[#868E9B] hover:text-[#DC2626] rounded-lg hover:bg-[#FEE2E2] transition-colors"
                                title="Delete Outfit"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 2: PHOTO BATCH UPLOADER & MATCHER ==================== */}
        {activeTab === 'batchUploader' && (
          <div className="space-y-8">
            
            {/* Guide Card for Batch Upload */}
            <div className="p-6 bg-white rounded-3xl border border-[#CDEAE0] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#E8F5F1] text-[#1F8769] rounded-2xl flex-shrink-0">
                  <Camera size={26} />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#20242B]">
                    Bulk Product Photo Tray & Matcher
                  </h2>
                  <p className="text-xs text-[#525B67] leading-relaxed mt-1">
                    Have photographs of your children's outfits on your computer or phone?
                    Drag and drop them all here at once. They will be stored in your persistent gallery tray where you can match them to existing outfits or create brand-new items in 1 click!
                  </p>
                </div>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div 
              onClick={() => batchFileInputRef.current?.click()}
              className="p-10 border-2 border-dashed border-[#D2C8B8] hover:border-[#D96B43] bg-white hover:bg-[#FAF7F2] rounded-3xl text-center cursor-pointer transition-all duration-200 group"
            >
              <input
                ref={batchFileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleBatchFileSelect}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] group-hover:bg-[#FCEBE7] text-[#D96B43] flex items-center justify-center mx-auto mb-4 transition-colors">
                <Upload size={30} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#20242B]">
                Click or Drag Multiple Clothing Photos Here
              </h3>
              <p className="text-xs text-[#717A88] mt-1.5 max-w-md mx-auto">
                Supports JPG, PNG, WEBP, and HEIC up to 50MB per batch. Photographs are saved to persistent disk storage and synced to your database.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#2D3139] text-white text-xs font-semibold rounded-xl group-hover:bg-[#D96B43] transition-colors shadow-xs">
                <span>Select Photos from Computer</span>
              </div>
            </div>

            {/* Upload Progress Bar if active */}
            {uploadProgress !== null && (
              <div className="p-5 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#2D3139]">
                  <span>Uploading and optimizing photographs...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E5DDD0]">
                  <div 
                    className="h-full bg-[#1F8769] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Photo Tray Area */}
            {batchFiles.length > 0 && (
              <div className="p-6 bg-white rounded-3xl border border-[#EAE1D3] shadow-xs space-y-6">
                
                {/* Tray Header & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAE1D3]">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#20242B]">
                      Uploaded Photo Tray ({batchFiles.length} Photos)
                    </h3>
                    <p className="text-xs text-[#717A88]">
                      Select photos to group them into an outfit or attach to an existing item
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBatchFiles(prev => prev.map(b => ({ ...b, selected: true })))}
                      className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE0] text-xs font-medium rounded-lg text-[#2D3139]"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setBatchFiles(prev => prev.map(b => ({ ...b, selected: false })))}
                      className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE0] text-xs font-medium rounded-lg text-[#2D3139]"
                    >
                      Deselect
                    </button>
                    <button
                      onClick={() => setBatchFiles([])}
                      className="px-3 py-1.5 bg-[#FEE2E2] hover:bg-[#FECACA] text-xs font-medium rounded-lg text-[#DC2626]"
                    >
                      Clear Tray
                    </button>
                  </div>
                </div>

                {/* Batch Action Toolbar */}
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E7DFD1] flex flex-wrap items-center justify-between gap-4">
                  
                  {/* Action 1: Create New Outfit from selected */}
                  <button
                    onClick={handleCreateOutfitFromBatch}
                    className="px-4 py-2.5 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus size={15} />
                    <span>Create New Outfit from Selected ({batchFiles.filter(b => b.selected).length})</span>
                  </button>

                  {/* Action 2: Attach to Existing Product */}
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <select
                      value={targetProductForBatch}
                      onChange={(e) => setTargetProductForBatch(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-[#DDD3C2] rounded-xl text-[#2D3139]"
                    >
                      <option value="">Choose Existing Outfit to Attach Photos To...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>

                    <button
                      onClick={handleAttachBatchToProduct}
                      className="px-4 py-2 bg-[#1F8769] hover:bg-[#186A53] text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
                    >
                      Attach Selected
                    </button>
                  </div>

                </div>

                {/* Photo Grid in Tray */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {batchFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => {
                        setBatchFiles(prev => prev.map(b => b.id === file.id ? { ...b, selected: !b.selected } : b));
                      }}
                      className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        file.selected
                          ? 'border-[#D96B43] ring-2 ring-[#D96B43]/30 scale-98'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      
                      {/* Selection checkbox overlay */}
                      <div className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                        file.selected ? 'bg-[#D96B43] text-white' : 'bg-black/50 text-white opacity-0 group-hover:opacity-100'
                      }`}>
                        {file.selected ? '✓' : ''}
                      </div>

                      {/* File name truncate */}
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[9px] text-white truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        )}

        {/* ==================== TAB: CUSTOMER HEARTS & INTEREST ==================== */}
        {activeTab === 'likes' && (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-3xl border border-[#FAD0C5] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FCEBE7] text-[#D96B43] rounded-2xl flex-shrink-0">
                  <Heart size={26} className="fill-[#D96B43]" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#20242B]">
                    Customer Hearts & Liked Outfits
                  </h2>
                  <p className="text-xs text-[#525B67] leading-relaxed mt-1">
                    Whenever visitors browse your catalogue and click the heart icon on any outfit, it is recorded here in real time. Use this customer feedback to know which silhouettes, sizes, and colors are in highest demand!
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs">
                <span className="text-[11px] font-semibold text-[#868E9B] uppercase tracking-wider block">
                  Total Customer Hearts
                </span>
                <span className="font-serif font-bold text-3xl text-[#2D3139] mt-1 block">
                  ❤️ {Object.values(likesData.counts).reduce((a, b) => a + b, 0)}
                </span>
                <span className="text-[11px] text-[#717A88] mt-1 block">
                  Across all catalogue pieces
                </span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs">
                <span className="text-[11px] font-semibold text-[#868E9B] uppercase tracking-wider block">
                  Distinct Outfits Loved
                </span>
                <span className="font-serif font-bold text-3xl text-[#1F8769] mt-1 block">
                  {Object.keys(likesData.counts).length} Pieces
                </span>
                <span className="text-[11px] text-[#717A88] mt-1 block">
                  Saved by visitors to favourites
                </span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs">
                <span className="text-[11px] font-semibold text-[#868E9B] uppercase tracking-wider block">
                  Most Loved Outfit
                </span>
                <span className="font-serif font-bold text-base text-[#D96B43] mt-1 truncate block">
                  {(() => {
                    const entries = Object.entries(likesData.counts);
                    if (entries.length === 0) return 'No hearts yet';
                    entries.sort((a, b) => b[1] - a[1]);
                    const topProduct = products.find(p => p.id === entries[0][0]);
                    return topProduct ? `${topProduct.name} (${entries[0][1]} hearts)` : `${entries[0][1]} hearts`;
                  })()}
                </span>
                <span className="text-[11px] text-[#717A88] mt-1 block">
                  Highest customer interest
                </span>
              </div>
            </div>

            {/* Ranked Table of Outfits by Hearts */}
            <div className="bg-white rounded-2xl border border-[#EAE1D3] shadow-xs overflow-hidden">
              <div className="p-5 border-b border-[#EAE1D3]">
                <h3 className="font-serif font-bold text-base text-[#20242B]">
                  Outfits Ranked by Customer Interest
                </h3>
                <p className="text-xs text-[#717A88]">
                  Sorted by total hearts received from visitors
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#4A515D]">
                  <thead className="bg-[#FAF7F2] text-[#20242B] font-semibold border-b border-[#EAE1D3]">
                    <tr>
                      <th className="py-3 px-4">Outfit</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Customer Hearts</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE1D3]">
                    {products
                      .map(p => ({ ...p, hearts: likesData.counts[p.id] || 0 }))
                      .sort((a, b) => b.hearts - a.hearts)
                      .map(item => (
                        <tr key={item.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.images[item.coverImageIndex] || item.images[0]}
                                alt={item.name}
                                className="w-10 h-12 rounded-lg object-cover border border-[#E5DDD0]"
                              />
                              <span className="font-serif font-bold text-[#20242B]">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-[#78818F]">{item.sku}</td>
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FCEBE7] text-[#D96B43] font-bold text-xs">
                              <Heart size={12} className="fill-[#D96B43]" />
                              <span>{item.hearts} {item.hearts === 1 ? 'Heart' : 'Hearts'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[11px] font-medium text-[#1F8769]">In Catalogue</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => navigateTo('product-detail', item.slug || item.id)}
                              className="text-xs font-semibold text-[#D96B43] hover:underline"
                            >
                              View Outfit →
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Activity Feed */}
            {likesData.activity && likesData.activity.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-[#EAE1D3] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#20242B]">
                  Recent Customer Heart Activity Log
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {likesData.activity.map((act, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#EDE5D8] text-xs">
                      <div className="flex items-center gap-2">
                        <Heart size={14} className="text-[#D96B43] fill-[#D96B43]" />
                        <span>A visitor hearted <strong>{act.productName}</strong> ({act.sku})</span>
                      </div>
                      <span className="text-[10px] text-[#868E9B] font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 3: BRAND & WHATSAPP SETTINGS ==================== */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-3xl border border-[#EAE1D3] shadow-xs space-y-6">
              
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#20242B]">
                  Brand Identity & Enquiry Settings
                </h2>
                <p className="text-xs text-[#717A88] mt-1">
                  Change the brand name, WhatsApp number, announcements, and catalogue mode
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#EAE1D3]">
                {/* Brand Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
                    Primary Brand Name:
                  </label>
                  <input
                    type="text"
                    value={settingsForm.brandName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:ring-1 focus:ring-[#D96B43]"
                    required
                  />
                  <p className="text-[10px] text-[#7E8896] mt-1">Changes the main title across the navbar, footer, and metadata.</p>
                </div>

                {/* Secondary Brand Name / Studio */}
                <div>
                  <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
                    Secondary Studio Subtitle:
                  </label>
                  <input
                    type="text"
                    value={settingsForm.secondaryName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, secondaryName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:ring-1 focus:ring-[#D96B43]"
                  />
                  <p className="text-[10px] text-[#7E8896] mt-1">e.g. The Sewing Bird</p>
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
                    Brand Tagline / Motto:
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:ring-1 focus:ring-[#D96B43]"
                  />
                </div>

                {/* Currency Symbol */}
                <div>
                  <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
                    Currency Symbol:
                  </label>
                  <input
                    type="text"
                    value={settingsForm.currencySymbol}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:ring-1 focus:ring-[#D96B43]"
                  />
                </div>

                {/* WhatsApp Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
                    WhatsApp Business Phone Number:
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:ring-1 focus:ring-[#D96B43]"
                  />
                  <p className="text-[10px] text-[#7E8896] mt-1">Include international country code with +.</p>
                </div>

                {/* Studio Enquiry Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
                    Studio Enquiry Email:
                  </label>
                  <input
                    type="email"
                    value={settingsForm.enquiryEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enquiryEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:ring-1 focus:ring-[#D96B43]"
                  />
                </div>
              </div>

              {/* Storefront Experience Info */}
              <div className="pt-6 border-t border-[#EAE1D3]">
                <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-2">
                  Storefront Catalogue Experience:
                </label>
                <div className="p-4 rounded-2xl border-2 border-[#1F8769] bg-[#E8F5F1] max-w-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-[#20242B]">
                      Pure Boutique Catalogue & Customer Hearts Tracker (Active)
                    </span>
                    <CheckCircle2 size={16} className="text-[#1F8769]" />
                  </div>
                  <p className="text-[11px] text-[#555E6B] leading-relaxed">
                    Buying option is disabled while operating as a boutique catalogue. Visitors can explore outfits, heart their favourite pieces (which logs directly into your Customer Hearts dashboard), and click "Enquire on WhatsApp" for direct bespoke assistance.
                  </p>
                </div>
              </div>

              {/* Announcement Bar Items */}
              <div className="pt-6 border-t border-[#EAE1D3] space-y-3">
                <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider">
                  Top Announcement Bar Messages:
                </label>
                <div className="space-y-2">
                  {settingsForm.announcements?.map((msg, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={msg}
                        onChange={(e) => {
                          const updated = [...settingsForm.announcements];
                          updated[idx] = e.target.value;
                          setSettingsForm({ ...settingsForm, announcements: updated });
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2D3139]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = settingsForm.announcements.filter((_, i) => i !== idx);
                          setSettingsForm({ ...settingsForm, announcements: updated });
                        }}
                        className="p-2 text-[#9CA3AF] hover:text-[#DC2626]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    placeholder="Add new announcement message..."
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-[#DDD3C2] rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newAnnouncement.trim()) return;
                      setSettingsForm({
                        ...settingsForm,
                        announcements: [...(settingsForm.announcements || []), newAnnouncement.trim()]
                      });
                      setNewAnnouncement('');
                    }}
                    className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F2ECE0] text-xs font-semibold rounded-xl text-[#2D3139] border border-[#DDD3C2]"
                  >
                    Add Message
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-[#EAE1D3] flex justify-end">
                <button
                  type="submit"
                  className="px-7 py-3 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Save size={14} />
                  <span>Save All Settings</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ==================== TAB 4: OWNER GUIDE & INSTRUCTIONS ==================== */}
        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-8 bg-white rounded-3xl border border-[#EAE1D3] shadow-xs space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D96B43] tracking-widest block mb-1">
                  Owner Documentation
                </span>
                <h2 className="font-serif font-bold text-2xl text-[#20242B]">
                  How to Upload & Organize Your Real Clothing Photographs
                </h2>
                <p className="text-xs text-[#717A88] mt-1">
                  Follow this straightforward guide to replace placeholders with your actual fashion catalogue photos.
                </p>
              </div>

              <div className="space-y-6 pt-4 border-t border-[#EAE1D3] text-xs text-[#4F5765] leading-relaxed">
                
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC9] space-y-2">
                  <h3 className="font-serif font-bold text-sm text-[#20242B] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2D3139] text-white text-[11px] flex items-center justify-center font-sans">1</span>
                    <span>Method A: Using the "Photo Batch Uploader" (Fastest)</span>
                  </h3>
                  <p>
                    1. Open the <strong>Photo Batch Uploader</strong> tab above.<br />
                    2. Drag and drop all your clothing photos (10, 20, or more) into the drop zone at once.<br />
                    3. They will immediately upload with a smooth progress bar and appear in your <strong>Photo Tray</strong>.<br />
                    4. Select the photos that belong to an outfit (e.g., front photo + back photo + fabric close-up), and click <strong>"Create New Outfit from Selected"</strong> or attach them to an existing product!
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC9] space-y-2">
                  <h3 className="font-serif font-bold text-sm text-[#20242B] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2D3139] text-white text-[11px] flex items-center justify-center font-sans">2</span>
                    <span>Method B: Replacing Photos on Existing Outfits Directly</span>
                  </h3>
                  <p>
                    1. In the <strong>Catalogue Inventory</strong> tab, click the <strong>Edit (Pencil)</strong> icon on any outfit.<br />
                    2. Under "Product Photographs", you can remove the starter placeholder photo with the trash icon.<br />
                    3. Click <strong>"Upload Photos from Computer"</strong> to select your real photographs.<br />
                    4. Click <strong>"Set as Cover"</strong> on your favourite front view angle!
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC9] space-y-2">
                  <h3 className="font-serif font-bold text-sm text-[#20242B] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2D3139] text-white text-[11px] flex items-center justify-center font-sans">3</span>
                    <span>How Multiple Photos Per Product Work</span>
                  </h3>
                  <p>
                    Each product can hold an unlimited number of photographs (Front, Back, Lifestyle, Close-up). On the customer-facing website:
                    <br />• On the product card in the Shop grid, hovering over the outfit automatically reveals the <strong>second photo</strong> (back view/lifestyle angle).
                    <br />• On the product detail page, customers can browse the thumbnail gallery or click <strong>"Zoom Photo"</strong> to inspect fine cotton stitching in full screen.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC9] space-y-2">
                  <h3 className="font-serif font-bold text-sm text-[#20242B] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2D3139] text-white text-[11px] flex items-center justify-center font-sans">4</span>
                    <span>Permanent Storage Guarantee</span>
                  </h3>
                  <p>
                    All uploaded photographs and edits are permanently saved to disk in the server's <code>/data/uploads</code> directory and <code>/data/products.json</code> file, as well as backed up in your browser storage. You can also export a complete JSON snapshot at any time in the <strong>Backup & Export</strong> tab.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: BACKUP & EXPORT ==================== */}
        {activeTab === 'backup' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-8 bg-white rounded-3xl border border-[#EAE1D3] shadow-xs space-y-6">
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#20242B]">
                  Catalogue Data Backup & Restoration
                </h2>
                <p className="text-xs text-[#717A88] mt-1">
                  Export all outfits, photo assignments, and brand settings into a single file
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EAE1D3]">
                {/* Export */}
                <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC9] space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1F8769] shadow-2xs">
                    <Download size={20} />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#20242B]">
                    Export Catalogue Backup
                  </h3>
                  <p className="text-xs text-[#636C79] leading-relaxed">
                    Downloads a clean JSON file containing all products, image links, sizes, prices, and brand configurations.
                  </p>
                  <button
                    onClick={handleExportJSON}
                    className="w-full py-2.5 px-4 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Download size={14} />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Import */}
                <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC9] space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#D96B43] shadow-2xs">
                    <Upload size={20} />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#20242B]">
                    Restore from JSON Backup
                  </h3>
                  <p className="text-xs text-[#636C79] leading-relaxed">
                    Upload a previously downloaded catalogue file to restore products or transfer between environments.
                  </p>
                  <label className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF7F2] border border-[#DDD3C2] text-[#2D3139] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload size={14} />
                    <span>Select JSON File to Restore</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset to starter collection */}
              <div className="pt-6 border-t border-[#EAE1D3] flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-[#DC2626]">
                    Reset to Initial Curated Starter Collection
                  </h4>
                  <p className="text-[11px] text-[#78818F]">
                    Restores the initial sample collection if you wish to start over.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to restore the initial starter collection?')) {
                      await resetCatalogue();
                    }
                  }}
                  className="px-4 py-2 bg-white hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-xl text-xs font-semibold transition-colors"
                >
                  Reset Defaults
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ==================== EDIT / CREATE OUTFIT MODAL ==================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div onClick={() => setEditingProduct(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#EAE1D3] my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#EAE1D3] flex items-center justify-between flex-shrink-0">
              <h3 className="font-serif font-bold text-lg text-[#20242B]">
                {isNewProduct ? 'Create New Outfit' : `Edit: ${editingProduct.name}`}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-1.5 text-[#78818F] hover:text-[#20242B]">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEditingProduct} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#20242B] uppercase tracking-wider mb-1">
                    Outfit Name:
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Peony Blossom Smocked Cotton Dress"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:ring-1 focus:ring-[#D96B43]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-semibold text-[#20242B] uppercase tracking-wider mb-1">
                    Category:
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl"
                  >
                    {CATEGORIES_LIST.filter(c => c !== 'All Outfits').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* SKU */}
                <div>
                  <label className="block font-semibold text-[#20242B] uppercase tracking-wider mb-1">
                    SKU / Reference Code:
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl font-mono"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block font-semibold text-[#20242B] uppercase tracking-wider mb-1">
                    Price ({brandSettings.currencySymbol}):
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price !== undefined ? editingProduct.price : ''}
                    onChange={(e) => setEditingProduct({ 
                      ...editingProduct, 
                      price: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                    placeholder="Leave blank for on-request"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl"
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block font-semibold text-[#20242B] uppercase tracking-wider mb-1">
                    Original Price (Optional strikethrough):
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice !== undefined ? editingProduct.originalPrice : ''}
                    onChange={(e) => setEditingProduct({ 
                      ...editingProduct, 
                      originalPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl"
                  />
                </div>

              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-[#20242B] uppercase tracking-wider mb-1">
                  Description:
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Describe the silhouette, twirl, gathers, and occasion..."
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl leading-relaxed"
                />
              </div>

              {/* MULTI-IMAGE UPLOADER & REORDERING */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E7DFD1] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[#20242B] uppercase tracking-wider text-[11px]">
                      Product Photographs ({editingProduct.images.length})
                    </h4>
                    <p className="text-[10px] text-[#717A88]">
                      Assign multiple photographs (front, back, details, close-up). Click "Set as Cover" on the main photo.
                    </p>
                  </div>

                  <label className="px-3 py-1.5 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors">
                    <Upload size={13} />
                    <span>Upload Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleSingleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Thumbnails & Cover designation */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {editingProduct.images.map((imgUrl, idx) => {
                    const isCover = idx === editingProduct.coverImageIndex;
                    return (
                      <div 
                        key={idx}
                        className={`relative aspect-4/5 rounded-xl overflow-hidden border-2 bg-white shadow-2xs group ${
                          isCover ? 'border-[#D96B43] ring-2 ring-[#D96B43]/20' : 'border-[#E0D7CA]'
                        }`}
                      >
                        <img src={imgUrl} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />

                        {/* Cover Badge */}
                        {isCover && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#D96B43] text-white text-[9px] font-bold rounded-xs shadow-xs">
                            Cover Image
                          </div>
                        )}

                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const nextImages = editingProduct.images.filter((_, i) => i !== idx);
                                setEditingProduct({
                                  ...editingProduct,
                                  images: nextImages,
                                  coverImageIndex: Math.max(0, editingProduct.coverImageIndex - (idx <= editingProduct.coverImageIndex ? 1 : 0))
                                });
                              }}
                              className="p-1 bg-[#EF4444] text-white rounded-md hover:bg-[#DC2626]"
                              title="Delete photo"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => setEditingProduct({ ...editingProduct, coverImageIndex: idx })}
                              className="w-full py-1 bg-white text-[#2D3139] hover:bg-[#D96B43] hover:text-white rounded-md text-[10px] font-bold transition-colors"
                            >
                              Set as Cover
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Paste direct Image URL option */}
                <div className="pt-2 border-t border-[#E0D7CA] flex gap-2">
                  <input
                    type="url"
                    id="manualUrlInput"
                    placeholder="Or paste external image URL..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#DDD3C2] rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('manualUrlInput') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        setEditingProduct({
                          ...editingProduct,
                          images: [...editingProduct.images, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }}
                    className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE0] border border-[#DDD3C2] text-[#2D3139] rounded-xl font-semibold text-xs"
                  >
                    Add URL
                  </button>
                </div>

              </div>

              {/* Sizes Available */}
              <div>
                <label className="block font-semibold text-[#20242B] uppercase tracking-wider mb-2">
                  Available Sizes:
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZES_LIST.map((sz) => {
                    const isChecked = editingProduct.availableSizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => {
                          const nextSizes = isChecked 
                            ? editingProduct.availableSizes.filter(s => s !== sz)
                            : [...editingProduct.availableSizes, sz];
                          setEditingProduct({ ...editingProduct, availableSizes: nextSizes });
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          isChecked 
                            ? 'bg-[#2D3139] text-white border-[#2D3139]' 
                            : 'bg-white text-[#525964] border-[#DDD3C2]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colours Available */}
              <div>
                <label className="block font-semibold text-[#20242B] uppercase tracking-wider mb-2">
                  Colours Available:
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOUR_PALETTE_LIST.map((pal) => {
                    const isChecked = editingProduct.availableColours.some(c => c.name.toLowerCase() === pal.name.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={pal.name}
                        onClick={() => {
                          const nextCols = isChecked
                            ? editingProduct.availableColours.filter(c => c.name.toLowerCase() !== pal.name.toLowerCase())
                            : [...editingProduct.availableColours, pal];
                          setEditingProduct({ ...editingProduct, availableColours: nextCols });
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                          isChecked
                            ? 'bg-[#FAF7F2] border-[#2D3139] font-bold text-[#2D3139]'
                            : 'bg-white border-[#DDD3C2] text-[#555C66]'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: pal.hex }} />
                        <span>{pal.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Toggles: Featured, New, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#E7DFD1] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#2D3139] rounded"
                  />
                  <span className="font-semibold text-[#2D3139]">Featured Outfit</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#E7DFD1] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNewArrival}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                    className="w-4 h-4 text-[#2D3139] rounded"
                  />
                  <span className="font-semibold text-[#2D3139]">New Arrival</span>
                </label>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7DFD1]">
                  <select
                    value={editingProduct.availabilityStatus}
                    onChange={(e) => setEditingProduct({ ...editingProduct, availabilityStatus: e.target.value as AvailabilityStatus })}
                    className="w-full bg-transparent font-semibold text-[#2D3139] focus:outline-hidden"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock (Few Left)</option>
                    <option value="made_to_order">Made to Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-6 border-t border-[#EAE1D3] flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#666F7B] hover:text-[#20242B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Save size={14} />
                  <span>Save Outfit</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDeleteCandidate(null)} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#EAE1D3] text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#20242B]">
                Delete Outfit?
              </h3>
              <p className="text-xs text-[#717A88] mt-1">
                Are you sure you want to permanently remove <strong>"{deleteCandidate.name}"</strong> ({deleteCandidate.sku}) from your catalogue?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2.5 text-xs font-semibold text-[#666F7B] bg-[#FAF7F2] rounded-xl hover:bg-[#F2ECE0]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteProduct(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-[#DC2626] rounded-xl hover:bg-[#B91C1C]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
