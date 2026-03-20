import React, { useState, useMemo } from 'react';
import { FilterBar, FilterSchemaItem } from '../components/FilterBar';
import { AssetDrawer } from '../components/AssetDrawer';
import { mockAssets, VideoAsset } from '../mock/data';
import { User, CheckCircle, Tag, MapPin, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store';
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

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const AssetManagement: React.FC = () => {
  const { searchQuery } = useAppStore();
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [sortField, setSortField] = useState<'uploadTime' | 'fileSize'>('uploadTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedAsset, setSelectedAsset] = useState<VideoAsset | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const filteredAssets = useMemo(() => {
    let result = [...mockAssets];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.uploader.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (filterValues.uploader) result = result.filter(a => a.uploader === filterValues.uploader);
    if (filterValues.status) result = result.filter(a => a.status === filterValues.status);
    if (filterValues.city) result = result.filter(a => a.city === filterValues.city);
    if (filterValues.tags) result = result.filter(a => a.tags.includes(filterValues.tags));

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

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterValues, sortField, sortOrder, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredAssets.length);
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">素材管理</h1>
        <p className="text-on-surface-variant max-w-2xl">管理、组织并监控您全球制作流水线中的高保真电影素材。</p>
      </div>

      <section className="bg-surface-container-lowest rounded-xl p-6 mb-8 shadow-sm">
        <FilterBar
          schema={filterSchema}
          value={filterValues}
          onChange={setFilterValues}
          onReset={() => setFilterValues({})}
        />
        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-on-surface-variant">排序方式:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (sortField === 'uploadTime') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortField('uploadTime'); setSortOrder('desc'); }
                }}
                className={clsx(
                  "text-xs px-4 py-1.5 rounded-full font-medium transition-colors",
                  sortField === 'uploadTime' ? "border border-primary text-primary" : "border border-outline-variant text-on-surface-variant hover:border-primary"
                )}
              >
                上传时间 {sortField === 'uploadTime' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => {
                  if (sortField === 'fileSize') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortField('fileSize'); setSortOrder('desc'); }
                }}
                className={clsx(
                  "text-xs px-4 py-1.5 rounded-full font-medium transition-colors",
                  sortField === 'fileSize' ? "border border-primary text-primary" : "border border-outline-variant text-on-surface-variant hover:border-primary"
                )}
              >
                文件大小 {sortField === 'fileSize' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative aspect-video bg-slate-200 overflow-hidden">
                <img src={asset.thumbnailUrl} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                  {formatDuration(asset.duration)}
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md flex items-center gap-1.5">
                  <span className={clsx(
                    "w-1.5 h-1.5 rounded-full",
                    asset.status === 'approved' ? 'bg-green-400' : asset.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                  )}></span>
                  <span className="text-[10px] font-bold text-white">
                    {asset.status === 'approved' ? '已通过' : asset.status === 'pending' ? '待审核' : '已驳回'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-slate-900 mb-3 truncate" title={asset.title}>{asset.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] text-primary font-bold">
                      {asset.uploader[0]}
                    </div>
                    <span className="text-[11px] text-slate-500">{asset.uploader}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{formatBytes(asset.fileSize)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-10 border border-slate-50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-medium">素材</th>
                <th className="p-4 font-medium">上传人</th>
                <th className="p-4 font-medium">状态</th>
                <th className="p-4 font-medium">大小</th>
                <th className="p-4 font-medium">上传时间</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {paginatedAssets.map(asset => (
                <tr key={asset.id} onClick={() => setSelectedAsset(asset)} className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-9 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                        <img src={asset.thumbnailUrl} alt={asset.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="font-medium text-slate-900 truncate max-w-[200px]" title={asset.title}>{asset.title}</div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{asset.uploader}</td>
                  <td className="p-4">
                    <span className={clsx(
                      "px-2 py-1 rounded-full text-[10px] font-bold",
                      asset.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      asset.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    )}>
                      {asset.status === 'approved' ? '已通过' : asset.status === 'pending' ? '待审核' : '已驳回'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{formatBytes(asset.fileSize)}</td>
                  <td className="p-4 text-slate-600">{asset.uploadTime.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between bg-surface-container-lowest px-6 py-4 rounded-xl shadow-sm border border-slate-50">
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
                  "w-8 h-8 flex items-center justify-center rounded border text-xs transition-all",
                  currentPage === page
                    ? "border-primary bg-primary text-white font-bold shadow-sm"
                    : "border-slate-200 text-slate-600 font-medium hover:border-primary hover:text-primary"
                )}
              >
                {page}
              </button>
            );
          })}

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
      />
    </div>
  );
};
