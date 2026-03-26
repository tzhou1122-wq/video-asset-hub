import { VideoAsset, mockAssets } from '../mock/data';

/**
 * 素材服务层
 * 封装所有与素材相关的异步操作，模拟真实的 API 调用。
 */
export const assetService = {
  /**
   * 获取素材列表
   * 支持模拟网络延迟
   */
  async getAssets(): Promise<VideoAsset[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockAssets];
  },

  /**
   * 根据 ID 获取单个素材详情
   */
  async getAssetById(id: string): Promise<VideoAsset | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const asset = mockAssets.find(a => a.id === id);
    return asset ? { ...asset } : null;
  },

  /**
   * 更新素材信息
   */
  async updateAsset(id: string, updates: Partial<VideoAsset>): Promise<VideoAsset> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockAssets.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Asset not found');
    
    // 在真实应用中，这里会发送 PATCH 请求到后端
    const updatedAsset = { ...mockAssets[index], ...updates };
    mockAssets[index] = updatedAsset;
    
    return updatedAsset;
  }
};
