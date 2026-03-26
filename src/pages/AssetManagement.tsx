import React, { useState, useMemo } from 'react';
import { FilterBar, FilterSchemaItem } from '../components/FilterBar';
import { AssetDrawer } from '../components/AssetDrawer';
import { SortControl, SortField, SortOrder } from '../components/SortControl';
import { AssetCard } from '../components/AssetCard';
import { AssetTable } from '../components/AssetTable';
import { mockAssets, VideoAsset } from '../mock/data';
import { User, CheckCircle, Tag, MapPin, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store';
import { formatBytes, formatDuration } from '../utils/format';
import clsx from 'clsx';

const filterSchema: FilterSchemaItem[] = [
  {
    key: 'uploader',
    label: '上传人',
    icon: <User className="w-4 h-4" />,
    type: 'select',
    placeholder: '全部上传人',
    options: [
      { label: '陈志明', value: '陈志明' },
      { label: '李华', value: '李华' },
      { label: '王强', value: '王强' },
      { label: '张美', value: '张美' },
    ],
  },
  {
    key: 'status',
    label: '审核状态',
    icon: <CheckCircle className="w-4 h-4" />,
    type: 'select',
    placeholder: '全部',
    options: [
      { label: '已通过', value: 'approved' },
      { label: '待审核', value: 'pending' },
      { label: '已驳回', value: 'rejected' },
    ],
  },
  {
    key: 'tags',
    label: '标签',
    icon: <Tag className="w-4 h-4" />,
    type: 'select',
    placeholder: '选择标签',
    options: [
      { label: '航拍', value: '航拍' },
      { label: '人物', value: '人物' },
      { label: '夜景', value: '夜景' },
      { label: '4K', value: '4K' },
    ],
  },
  {
    key: 'city',
    label: '所属城市',
    icon: <MapPin className="w-4 h-4" />,
    type: 'select',
    placeholder: '所有城市',
    options: [
      { label: '北京', value: '北京' },
      { label: '上海', value: '上海' },
      { label: '广州', value: '广州' },
      { label: '深圳', value: '深圳' },
    ],
  },
];

/**
 * 素材管理页面
 * 提供搜索、多维度过滤、排序、视图切换以及分页功能。
 */
export const AssetManagement: React.FC = () => {
  const { searchQuery } = useAppStore();
  // 素材列表状态
  const [assets, setAssets] = useState<VideoAsset[]>(mockAssets);
  // 过滤条件状态
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  // 排序字段与顺序
  const [sortField, setSortField] = useState<SortField>('uploadTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  // 当前选中的素材 (用于抽屉详情展示)
  const [selectedAsset, setSelectedAsset] = useState<VideoAsset | null>(null);
  // 视图模式: 卡片或表格
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  /**
   * 核心过滤与排序逻辑
   * 结合全局搜索、侧边栏过滤项以及排序配置进行计算
   */
  const filteredAssets = useMemo(() => {
    let result = [...assets];
    
    // 1. 全局搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.uploader.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // 2. 侧边栏多条件过滤
    if (filterValues.uploader) result = result.filter(a => a.uploader === filterValues.uploader);
    if (filterValues.status) result = result.filter(a => a.status === filterValues.status);
    if (filterValues.city) result = result.filter(a => a.city === filterValues.city);
    if (filterValues.tags) result = result.filter(a => a.tags.includes(filterValues.tags));

    // 3. 排序逻辑
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'uploadTime') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [filterValues, sortField, sortOrder, searchQuery]);

  // 当过滤或搜索条件变化时，重置页码到第一页
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterValues, sortField, sortOrder, searchQuery]);

  // 分页计算
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredAssets.length);
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  const handleUpdateAsset = (updatedAsset: VideoAsset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
    setSelectedAsset(updatedAsset);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">素材管理</h1>
        <p className="text-on-surface-variant max-w-2xl">管理、组织并监控您全球制作流水线中的高保真电影素材。</p>
      </div>

      <section className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-slate-200">
        <FilterBar
          schema={filterSchema}
          value={filterValues}
          onChange={setFilterValues}
          onReset={() => setFilterValues({})}
        />
        <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SortControl
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortField(field);
              setSortOrder(order);
            }}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setViewMode('card')}
              className={clsx("p-2 rounded-lg transition-colors", viewMode === 'card' ? "bg-surface-container text-primary" : "text-slate-400 hover:text-slate-600")}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={clsx("p-2 rounded-lg transition-colors", viewMode === 'table' ? "bg-surface-container text-primary" : "text-slate-400 hover:text-slate-600")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {paginatedAssets.map(asset => (
            <AssetCard 
              key={asset.id} 
              asset={asset} 
              onClick={setSelectedAsset} 
            />
          ))}
        </div>
      ) : (
        <AssetTable 
          assets={paginatedAssets} 
          onRowClick={setSelectedAsset} 
        />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div className="text-xs text-on-surface-variant font-medium">
          第 {filteredAssets.length === 0 ? 0 : startIndex + 1} 到 {endIndex} 条，共 {filteredAssets.length} 条素材
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none py-1">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              if (totalPages > 5) {
                if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                  if (page === 2 || page === totalPages - 1) {
                    return <div key={page} className="px-1 text-slate-400 text-xs">•••</div>;
                  }
                  return null;
                }
              }
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    "w-8 h-8 shrink-0 flex items-center justify-center rounded border text-xs transition-all",
                    currentPage === page
                      ? "border-primary bg-primary text-white font-bold shadow-sm"
                      : "border-slate-200 text-slate-600 font-medium hover:border-primary hover:text-primary"
                  )}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AssetDrawer
        visible={!!selectedAsset}
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onUpdateAsset={handleUpdateAsset}
      />
    </div>
  );
};
