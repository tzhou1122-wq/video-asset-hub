import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { VideoAsset } from '../mock/data';
import { formatBytes, formatDuration } from '../utils/format';
import clsx from 'clsx';

interface AssetCardProps {
  asset: VideoAsset;
  onClick: (asset: VideoAsset) => void;
}

/**
 * 素材卡片组件
 * 封装了卡片的样式、Hover 效果、状态标签等。
 */
export const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(asset)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative aspect-video bg-slate-200 overflow-hidden">
        {/* 封面图 */}
        <img 
          src={asset.thumbnailUrl} 
          alt={asset.title} 
          className={clsx(
            "w-full h-full object-cover transition-transform duration-500",
            isHovered ? "scale-110" : "scale-100"
          )} 
        />
        
        {/* Hover 预览占位 (未来可在此处渲染低码率视频) */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center animate-in fade-in duration-300">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white">
              <Play className="w-5 h-5 fill-current" />
            </div>
          </div>
        )}

        {/* 时长标签 */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
          {formatDuration(asset.duration)}
        </div>

        {/* 状态标签 */}
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

      {/* 信息区域 */}
      <div className="p-4">
        <h3 className="font-bold text-sm text-slate-900 mb-3 truncate" title={asset.title}>
          {asset.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] text-primary font-bold">
              {asset.uploader[0]}
            </div>
            <span className="text-[11px] text-slate-500">{asset.uploader}</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {formatBytes(asset.fileSize)}
          </span>
        </div>
      </div>
    </div>
  );
};
