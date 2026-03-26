import React from 'react';
import { VideoAsset } from '../mock/data';
import { formatBytes } from '../utils/format';
import clsx from 'clsx';

interface AssetTableProps {
  assets: VideoAsset[];
  onRowClick: (asset: VideoAsset) => void;
}

/**
 * 素材表格组件
 * 封装了表格的样式、状态标签颜色等。
 */
export const AssetTable: React.FC<AssetTableProps> = ({ assets, onRowClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-10 border border-slate-200">
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
          {assets.map(asset => (
            <tr 
              key={asset.id} 
              onClick={() => onRowClick(asset)} 
              className="hover:bg-slate-50/50 cursor-pointer transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-9 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={asset.thumbnailUrl} 
                      alt={asset.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div 
                    className="font-medium text-slate-900 truncate max-w-[200px]" 
                    title={asset.title}
                  >
                    {asset.title}
                  </div>
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
  );
};
