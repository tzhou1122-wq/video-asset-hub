import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoAsset } from '../mock/data';
import { assetService } from '../services/assetService';

/**
 * 全局状态管理 (Zustand)
 * 处理应用的主题切换、搜索查询以及用户对视频详情字段的展示偏好。
 */
export interface FieldPreferences {
  title: boolean;
  uploader: boolean;
  city: boolean;
  tags: boolean;
  duration: boolean;
  uploadTime: boolean;
  fileSize: boolean;
}

interface AppState {
  // 素材列表
  assets: VideoAsset[];
  isLoading: boolean;
  fetchAssets: () => Promise<void>;
  updateAsset: (id: string, updates: Partial<VideoAsset>) => Promise<void>;
  
  // 当前激活的标签页: 素材管理 (assets) 或 数据看板 (dashboard)
  activeTab: 'assets' | 'dashboard';
  setActiveTab: (tab: 'assets' | 'dashboard') => void;
  // 全局搜索关键词
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // 详情页字段显示偏好 (持久化存储)
  fieldPreferences: FieldPreferences;
  toggleFieldPreference: (field: keyof FieldPreferences) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      assets: [],
      isLoading: false,
      fetchAssets: async () => {
        set({ isLoading: true });
        try {
          const assets = await assetService.getAssets();
          set({ assets, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch assets:', error);
          set({ isLoading: false });
        }
      },
      updateAsset: async (id, updates) => {
        try {
          const updated = await assetService.updateAsset(id, updates);
          set((state) => ({
            assets: state.assets.map((a) => (a.id === id ? updated : a)),
          }));
        } catch (error) {
          console.error('Failed to update asset:', error);
          throw error;
        }
      },
      activeTab: 'assets',
      setActiveTab: (tab) => set({ activeTab: tab }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      fieldPreferences: {
        title: true,
        uploader: true,
        city: true,
        tags: true,
        duration: true,
        uploadTime: true,
        fileSize: true,
      },
      toggleFieldPreference: (field) =>
        set((state) => ({
          fieldPreferences: {
            ...state.fieldPreferences,
            [field]: !state.fieldPreferences[field],
          },
        })),
    }),
    {
      name: 'cinematic-ledger-storage',
      // 仅持久化 fieldPreferences 字段到 localStorage
      partialize: (state) => ({ fieldPreferences: state.fieldPreferences }),
    }
  )
);
