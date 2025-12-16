// Dynamic Product Management System
// This file manages products that can be added/edited through the admin panel

import { products as staticProducts, type Product } from './products';

export interface AdminProduct {
  id: number;
  productCode: string;
  title: string;
  price: string;
  image: string;
  images?: string[];
  description?: string;
  category: string;
  isActive: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  // Teknik Özellikler
  specifications?: {
    dimensions?: string; // Boyutlar (örn: "200cm x 100cm x 15cm")
    weight?: string; // Ağırlık (örn: "450 kg")
    thickness?: string; // Kalınlık (örn: "15 cm")
    surfaceFinish?: string; // Yüzey İşlemi (örn: "Doğal Mermer Cilalı")
    warranty?: string; // Garanti (örn: "10 Yıl Garanti")
    installationTime?: string; // Kurulum Süresi (örn: "1-2 Gün")
  };
}

const STORAGE_KEY = 'mezarisim_admin_products';

// Cached products to avoid repeated localStorage access
let cachedProducts: Product[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 1000; // 1 second cache - reduced for better responsiveness

// Get all products (static + dynamic) - Include ALL active products
export function getAllProducts(): Product[] {
  try {
    // Check if cache is manually cleared
    const cacheFlag = localStorage.getItem('mezarisim_products_cache');
    if (cacheFlag === 'clear') {
      cachedProducts = null;
      lastCacheTime = 0;
      localStorage.removeItem('mezarisim_products_cache');
    }
    
    // Use cache if available and not expired
    const now = Date.now();
    if (cachedProducts && (now - lastCacheTime) < CACHE_DURATION) {
      return cachedProducts;
    }

    const dynamicProducts = getDynamicProducts();
    const adminProducts = dynamicProducts
      .filter(dp => dp.isActive) // Only get active dynamic products
      .map(convertAdminProductToProduct);
    
    // Combine static products with active dynamic products
    const combinedProducts = [...staticProducts, ...adminProducts];
    
    // Update cache
    cachedProducts = combinedProducts;
    lastCacheTime = now;
    
    console.log('📊 getAllProducts(): Found', {
      staticCount: staticProducts.length,
      dynamicCount: adminProducts.length,
      totalCount: combinedProducts.length,
      cached: false
    });
    
    return combinedProducts;
  } catch (error) {
    console.error('Error getting all products:', error);
    return staticProducts; // Fallback to static products only
  }
}

// Clear cache when products are updated
export function clearProductsCache(): void {
  console.log('🧹 Clearing products cache');
  cachedProducts = null;
  lastCacheTime = 0;
  // Also clear any local storage cache flags
  localStorage.removeItem('mezarisim_products_cache');
}

// Get products for specific pages
export function getProductsForPricingPage(): Product[] {
  const allProducts = getAllProducts();
  return allProducts.filter(product => 
    product.category === 'tek-kisilik-mermer' || 
    product.category === 'tek-kisilik-granit' || 
    product.category === 'iki-kisilik-mermer' ||
    product.category === 'iki-kisilik-granit' ||
    product.category === 'modern' ||
    product.category === 'lahit' ||
    product.category === 'sutunlu'
  );
}

export function getProductsForModelsPage(): Product[] {
  const allProducts = getAllProducts();
  return allProducts.filter(product => 
    product.category === 'granit' || 
    product.category === 'mermer' || 
    product.category === 'mozaik' ||
    product.category === 'laht'
  );
}

// Get featured products
export function getFeaturedProducts(): Product[] {
  const allProducts = getAllProducts();
  const dynamicProducts = getDynamicProducts();
  
  return allProducts.filter(product => {
    const dynamicProduct = dynamicProducts.find(dp => dp.id === product.id);
    return dynamicProduct ? dynamicProduct.featured : false;
  });
}

// Convert AdminProduct to Product format
function convertAdminProductToProduct(adminProduct: AdminProduct): Product {
  return {
    id: adminProduct.id,
    productCode: adminProduct.productCode,
    title: adminProduct.title,
    price: adminProduct.price,
    image: adminProduct.image,
    images: adminProduct.images,
    description: adminProduct.description,
    category: adminProduct.category
  };
}

// Get dynamic products from localStorage
function getDynamicProducts(): AdminProduct[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading dynamic products:', error);
    return [];
  }
}

// Save dynamic products to localStorage
export function saveDynamicProducts(products: AdminProduct[], skipEvent = false): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    clearProductsCache(); // Clear cache when products are saved
    // Trigger storage event to notify other components (unless skipped)
    if (!skipEvent) {
      window.dispatchEvent(new Event('mezarisim-products-updated'));
      window.dispatchEvent(new Event('mezarisim-force-rerender'));
    }
  } catch (error) {
    console.error('Error saving dynamic products:', error);
  }
}

// Add new product
export function addDynamicProduct(product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>): AdminProduct {
  const dynamicProducts = getDynamicProducts();
  const allProducts = getAllProducts();
  const now = new Date().toISOString();
  
  // Generate unique ID starting from 1000000 to avoid conflicts
  let newId = 1000000;
  const existingIds = new Set(allProducts.map(p => p.id));
  while (existingIds.has(newId)) {
    newId++;
  }
  
  const newProduct: AdminProduct = {
    ...product,
    id: newId,
    createdAt: now,
    updatedAt: now
  };
  
  const updatedProducts = [...dynamicProducts, newProduct];
  clearProductsCache(); // Clear cache before save
  saveDynamicProducts(updatedProducts);
  
  return newProduct;
}

// Import static products to admin system
export function importStaticProductsToAdmin(): void {
  try {
    // Check if already imported to prevent duplicate imports
    const importFlag = localStorage.getItem('mezarisim_static_imported');
    if (importFlag === 'true') {
      return;
    }

    const existingProducts = getDynamicProducts();
    const existingIds = new Set(existingProducts.map(p => p.id)); // Use Set for faster lookup
    
    // Convert static products to admin products
    const staticAdminProducts: AdminProduct[] = [];
    
    for (const staticProduct of staticProducts) {
      // Only import if not already exists
      if (existingIds.has(staticProduct.id)) {
        continue;
      }
      
      // Map static categories to admin categories
      const getCategoryForAdmin = (staticCategory: string): string => {
        const categoryMap: { [key: string]: string } = {
          'tek-kisilik-mermer': 'Tek Kişilik Mermer Modeller',
          'tek-kisilik-granit': 'Tek Kişilik Granit Modeller',
          'iki-kisilik-mermer': 'İki Kişilik Mermer Modeller',
          'iki-kisilik-granit': 'İki Kişilik Granit Modeller',
          'sutunlu': 'Sütunlu Mezar Modelleri',
          'modern': 'Mezar Modelleri',
          'lahit': 'Mezar Modelleri'
        };
        return categoryMap[staticCategory] || 'Mezar Modelleri';
      };
      
      staticAdminProducts.push({
        id: staticProduct.id,
        productCode: staticProduct.productCode,
        title: staticProduct.title,
        price: staticProduct.price,
        image: staticProduct.image,
        images: staticProduct.images,
        description: staticProduct.description,
        category: getCategoryForAdmin(staticProduct.category),
        isActive: true,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    // Save imported products
    if (staticAdminProducts.length > 0) {
      const allProducts = [...existingProducts, ...staticAdminProducts];
      // Save without triggering events during import
      saveDynamicProducts(allProducts, true);
      console.log('📦 Static products imported to admin:', staticAdminProducts.length, 'products');
    }
    
    // Mark as imported
    localStorage.setItem('mezarisim_static_imported', 'true');
  } catch (error) {
    console.error('Error importing static products:', error);
  }
}

// Initialize with demo products if storage is empty (for testing)
export function initializeDemoProducts(): void {
  try {
    // Check if already initialized to prevent multiple calls
    const initFlag = localStorage.getItem('mezarisim_products_initialized');
    if (initFlag === 'true') {
      return;
    }

    const existingProducts = getDynamicProducts();
    
    // First, import all static products
    importStaticProductsToAdmin();
    
    // Then add demo products only if still empty
    const afterImport = getDynamicProducts();
    if (afterImport.length === 0) {
      const demoProducts: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          productCode: "MBT001",
          title: "Siyah Granit Mezar Baş Taşı - Modern Tasarım",
          price: "Fiyat İçin Arayınız",
          image: "https://images.unsplash.com/photo-1578948856697-db91d246b7b8?w=800&h=600&fit=crop",
          description: "Modern tasarım siyah granit mezar baş taşı, yüksek kalite işçilik",
          category: "Mezar Baş Taşı Modelleri",
          isActive: true,
          featured: false
        },
        {
          productCode: "MSH001", 
          title: "Mermer Şuluk Modeli - Klasik Tasarım",
          price: "Fiyat İçin Arayınız",
          image: "https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=800&h=600&fit=crop",
          description: "Beyaz mermer malzemeden üretilen klasik şuluk modeli",
          category: "Mezar Şuluk Modelleri",
          isActive: true,
          featured: false
        },
        {
          productCode: "MST001",
          title: "Granit Sütun Modeli - Dekoratif",
          price: "Fiyat İçin Arayınız", 
          image: "https://images.unsplash.com/photo-1578948854345-1b9b2e5f3b9c?w=800&h=600&fit=crop",
          description: "Dekoratif granit sütun modeli, dayanıklı ve estetik",
          category: "Mezar Sütun Modelleri",
          isActive: true,
          featured: false
        }
      ];
      
      // Add products without triggering events during initialization
      const allProducts = [...existingProducts];
      const allExistingProducts = getAllProducts();
      const existingIds = new Set(allExistingProducts.map(p => p.id));
      
      demoProducts.forEach(product => {
        const now = new Date().toISOString();
        // Generate unique ID starting from 1000000
        let newId = 1000000;
        while (existingIds.has(newId)) {
          newId++;
        }
        existingIds.add(newId);
        
        const newProduct: AdminProduct = {
          ...product,
          id: newId,
          createdAt: now,
          updatedAt: now
        };
        allProducts.push(newProduct);
      });
      
      // Save without triggering events
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProducts));
    }
    
    // Mark as initialized
    localStorage.setItem('mezarisim_products_initialized', 'true');
  } catch (error) {
    console.error('Error initializing demo products:', error);
  }
}

// Update existing product
export function updateDynamicProduct(productId: number, updates: Partial<AdminProduct>): boolean {
  try {
    const dynamicProducts = getDynamicProducts();
    const index = dynamicProducts.findIndex(p => p.id === productId);
    
    if (index >= 0) {
      dynamicProducts[index] = {
        ...dynamicProducts[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      console.log('🔄 updateDynamicProduct - Updating product:', {
        productId,
        currentImage: dynamicProducts[index].image?.substring(0, 50) + '...',
        updates: updates.image ? updates.image.substring(0, 50) + '...' : 'no image update'
      });
      
      clearProductsCache(); // Clear cache before save
      saveDynamicProducts(dynamicProducts);
      
      // Force cache clear flag
      localStorage.setItem('mezarisim_products_cache', 'clear');
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
}

// Delete product
export function deleteDynamicProduct(productId: number): boolean {
  try {
    const dynamicProducts = getDynamicProducts();
    const filteredProducts = dynamicProducts.filter(p => p.id !== productId);
    
    if (filteredProducts.length !== dynamicProducts.length) {
      clearProductsCache(); // Clear cache before save
      saveDynamicProducts(filteredProducts);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// Get product by ID
export function getDynamicProductById(productId: number): AdminProduct | undefined {
  const dynamicProducts = getDynamicProducts();
  return dynamicProducts.find(p => p.id === productId);
}

// Toggle product active status
export function toggleProductActive(productId: number): boolean {
  const dynamicProducts = getDynamicProducts();
  const product = dynamicProducts.find(p => p.id === productId);
  
  if (product) {
    return updateDynamicProduct(productId, { isActive: !product.isActive });
  }
  
  return false;
}

// Set product as featured
export function toggleProductFeatured(productId: number): boolean {
  const dynamicProducts = getDynamicProducts();
  const product = dynamicProducts.find(p => p.id === productId);
  
  if (product) {
    return updateDynamicProduct(productId, { featured: !product.featured });
  }
  
  return false;
}