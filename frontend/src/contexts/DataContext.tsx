import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllProducts, type Product } from '../data/dynamicProducts';

// Admin data interfaces
interface SliderData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
}

interface KeywordData {
  id: number;
  text: string;
  images: string[];
  status: string;
}

interface CampaignData {
  id: string;
  title: string;
  description: string;
  images: string[];
  tag: string;
  date: string;
  isActive: boolean;
}

interface DataContextType {
  // Products
  products: Product[];
  refreshProducts: () => void;
  
  // Sliders
  sliders: SliderData[];
  refreshSliders: () => void;
  
  // Keywords (Recent Works)
  keywords: KeywordData[];
  refreshKeywords: () => void;
  
  // Campaigns
  campaigns: CampaignData[];
  refreshCampaigns: () => void;
  
  // General refresh
  refreshAll: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sliders, setSliders] = useState<SliderData[]>([]);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);

  // Default data
  const defaultSliders: SliderData[] = [
    {
      id: '1',
      title: 'Kaliteli Mezar Taşları',
      subtitle: 'Sevdikleriniz İçin En İyisi',
      description: 'Yüksek kaliteli mermer ve granit mezar taşları',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop',
      buttonText: 'Ürünleri İncele',
      buttonLink: '#products',
      isActive: true,
      order: 1
    }
  ];

  const defaultKeywords: KeywordData[] = [
    {
      id: 1,
      text: 'Şile Mezar Yapım İşleri / Ağva mezar yapımı / şile mezar modelleri / Şile Mezar Yapım / Şile Mermer Mezar Fiyatları',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      ],
      status: 'Active'
    },
    {
      id: 2,
      text: 'şile mezar yapım / şile mezar modelleri / şile mezar fiyatları / şile köy mezarlığı / şile mermer mezar yapım / şile-ağva mezar yapımı',
      images: [],
      status: 'Active'
    }
  ];

  const defaultCampaigns: CampaignData[] = [
    {
      id: '1',
      title: 'Yazlık Mezar Bakım Kampanyası',
      description: 'Yaz aylarında mezarlarınızın bakımı için özel indirimli paketlerimizden faydalanın!',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      ],
      tag: 'Kampanya',
      date: 'Haziran 2024',
      isActive: true
    },
    {
      id: '2', 
      title: 'Mermer Mezar Taşları %25 İndirim',
      description: 'Kaliteli mermer mezar taşlarında özel indirim fırsatı! Sınırlı süreyle geçerli.',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      ],
      tag: 'Kampanya',
      date: 'Mayıs 2024',
      isActive: true
    }
  ];

  // Load functions
  const loadProducts = () => {
    try {
      const allProducts = getAllProducts();
      console.log('🔄 DataContext: Loading products', allProducts.length);
      setProducts(allProducts);
    } catch (error) {
      console.error('❌ DataContext: Error loading products:', error);
    }
  };

  const loadSliders = () => {
    try {
      const stored = localStorage.getItem('mezarisim_sliders');
      const slidersData = stored ? JSON.parse(stored) : defaultSliders;
      console.log('🔄 DataContext: Loading sliders', slidersData.length);
      setSliders(slidersData);
    } catch (error) {
      console.error('❌ DataContext: Error loading sliders:', error);
      setSliders(defaultSliders);
    }
  };

  const loadKeywords = () => {
    try {
      const stored = localStorage.getItem('mezarisim_keywords');
      const keywordsData = stored ? JSON.parse(stored) : defaultKeywords;
      console.log('🔄 DataContext: Loading keywords', keywordsData.length);
      setKeywords(keywordsData);
    } catch (error) {
      console.error('❌ DataContext: Error loading keywords:', error);
      setKeywords(defaultKeywords);
    }
  };

  const loadCampaigns = () => {
    try {
      const stored = localStorage.getItem('mezarisim_campaigns');
      const campaignsData = stored ? JSON.parse(stored) : defaultCampaigns;
      console.log('🔄 DataContext: Loading campaigns', campaignsData.length);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('❌ DataContext: Error loading campaigns:', error);
      setCampaigns(defaultCampaigns);
    }
  };

  // Refresh functions
  const refreshProducts = () => {
    console.log('🔄 DataContext: Refreshing products');
    loadProducts();
  };

  const refreshSliders = () => {
    console.log('🔄 DataContext: Refreshing sliders');
    loadSliders();
  };

  const refreshKeywords = () => {
    console.log('🔄 DataContext: Refreshing keywords');
    loadKeywords();
  };

  const refreshCampaigns = () => {
    console.log('🔄 DataContext: Refreshing campaigns');
    loadCampaigns();
  };

  const refreshAll = () => {
    console.log('🔄 DataContext: Refreshing all data');
    loadProducts();
    loadSliders();
    loadKeywords();
    loadCampaigns();
  };

  // Initial load
  useEffect(() => {
    console.log('🚀 DataContext: Initial data load');
    refreshAll();
  }, []);

  // Listen to localStorage changes and admin events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      console.log('💾 DataContext: localStorage changed:', e.key);
      
      if (e.key === 'mezarisim_admin_products') {
        console.log('🔄 DataContext: Products localStorage changed, refreshing...');
        refreshProducts();
      } else if (e.key === 'mezarisim_sliders') {
        console.log('🔄 DataContext: Sliders localStorage changed, refreshing...');
        refreshSliders();
      } else if (e.key === 'mezarisim_keywords') {
        console.log('🔄 DataContext: Keywords localStorage changed, refreshing...');
        refreshKeywords();
      } else if (e.key === 'mezarisim_campaigns') {
        console.log('🔄 DataContext: Campaigns localStorage changed, refreshing...');
        refreshCampaigns();
      }
    };

    const handleProductsUpdate = () => {
      console.log('🔄 DataContext: Products update event received');
      refreshProducts();
    };

    const handleForceRerender = () => {
      console.log('🔄 DataContext: Force rerender event received');
      refreshAll();
    };

    const handleDataUpdate = () => {
      console.log('🔄 DataContext: General data update event received');
      refreshAll();
    };

    // Add all event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('mezarisim-products-updated', handleProductsUpdate);
    window.addEventListener('mezarisim-force-rerender', handleForceRerender);
    window.addEventListener('mezarisim-product-changed', handleProductsUpdate);
    window.addEventListener('mezarisim-data-updated', handleDataUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mezarisim-products-updated', handleProductsUpdate);
      window.removeEventListener('mezarisim-force-rerender', handleForceRerender);
      window.removeEventListener('mezarisim-product-changed', handleProductsUpdate);
      window.removeEventListener('mezarisim-data-updated', handleDataUpdate);
    };
  }, []);

  const value: DataContextType = {
    products,
    refreshProducts,
    sliders,
    refreshSliders,
    keywords,
    refreshKeywords,
    campaigns,
    refreshCampaigns,
    refreshAll
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Hook for products only
export function useProducts() {
  const { products, refreshProducts } = useData();
  return { products, refreshProducts };
}

// Hook for sliders only  
export function useSliders() {
  const { sliders, refreshSliders } = useData();
  return { sliders, refreshSliders };
}

// Hook for keywords only
export function useKeywords() {
  const { keywords, refreshKeywords } = useData();
  return { keywords, refreshKeywords };
}

// Hook for campaigns only
export function useCampaigns() {
  const { campaigns, refreshCampaigns } = useData();
  return { campaigns, refreshCampaigns };
}