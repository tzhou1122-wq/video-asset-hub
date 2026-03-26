import React, { useState, useEffect, useRef } from 'react';
import { X, Share2, MoreVertical, Play, SlidersHorizontal, History, CloudCheck } from 'lucide-react';
import { VideoAsset } from '../mock/data';
import { useAppStore, FieldPreferences } from '../store';
import { formatBytes, formatDuration } from '../utils/format';
import { format } from 'date-fns';
import clsx from 'clsx';

interface AssetDrawerProps {
  visible: boolean;
  asset: VideoAsset | null;
  onClose: () => void;
}

/**
 * 素材详情抽屉组件
 * 展示视频预览、元数据详情，并允许用户配置展示字段。
 */
export const AssetDrawer: React.FC<AssetDrawerProps> = ({ visible, asset, onClose }) => {
  const { fieldPreferences, toggleFieldPreference } = useAppStore();
  // 视频播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  // 字段配置下拉菜单状态
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 抽屉关闭时停止播放
  useEffect(() => {
    if (!visible) {
      setIsPlaying(false);
    }
  }, [visible]);

  if (!visible || !asset) return null;

  return (
    <>
      {/* 背景遮罩 (Scrim) */}
      <div className="fixed inset-0 bg-on-background/10 z-[60] backdrop-blur-[2px]" onClick={onClose}></div>

      {/* 抽屉主体 */}
      <aside className="fixed right-0 top-0 h-screen w-full max-w-md lg:max-w-lg glass-panel z-[70] shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col border-l border-white/20 transform transition-transform duration-300 ease-in-out">
        {/* 头部区域：包含关闭按钮和字段配置入口 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-all">
              <X className="text-on-surface-variant w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold tracking-tight text-on-surface">素材详情</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-container-high rounded-lg text-primary transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            
            {/* 字段配置下拉菜单 (Field Selector) */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={clsx(
                  "p-2 rounded-lg transition-all flex items-center gap-1",
                  isDropdownOpen ? "bg-primary/10 text-primary" : "hover:bg-surface-container-high text-primary"
                )}
                title="字段配置"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-64 p-4 bg-white rounded-xl shadow-xl border border-outline-variant/10 z-[80] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-on-surface">展示字段设置</h3>
                    <button onClick={() => setIsDropdownOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mb-4 leading-relaxed">自定义在全局库视图中展示的元数据字段。</p>
                  <div className="flex flex-col gap-3">
                    {(Object.keys(fieldPreferences) as Array<keyof FieldPreferences>).map((key) => {
                      const labels: Record<keyof FieldPreferences, string> = {
                        title: '标题',
                        uploader: '上传人',
                        city: '城市',
                        tags: '标签',
                        duration: '时长',
                        uploadTime: '上传时间',
                        fileSize: '文件大小'
                      };
                      return (
                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={fieldPreferences[key]}
                            onChange={() => toggleFieldPreference(key)}
                            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                            {labels[key]}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <button className="p-2 hover:bg-surface-container-high rounded-lg text-primary transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          {/* 视频播放器区域 */}
          <section className="relative aspect-video bg-black rounded-xl overflow-hidden group shadow-lg">
            {isPlaying ? (
              <video 
                src={asset.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <>
                <img src={asset.thumbnailUrl} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
                  >
                    <Play className="w-8 h-8 fill-current" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-white/90 font-medium">
                  <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded">00:00 / {formatDuration(asset.duration)}</span>
                  <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded">4K • PRORES 422</span>
                </div>
              </>
            )}
          </section>

          {/* 元数据展示区域：根据用户偏好动态显示字段 */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">基本信息</h3>
              <span className="px-2 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold rounded uppercase">
                {asset.status === 'approved' ? '已通过' : asset.status === 'pending' ? '待审核' : '已驳回'}
              </span>
            </div>
            <div className="space-y-4">
              {fieldPreferences.title && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-on-surface-variant text-body-sm font-medium">标题</span>
                  <span className="col-span-2 text-on-surface text-body-sm font-semibold break-words">{asset.title}</span>
                </div>
              )}
              {fieldPreferences.uploader && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-on-surface-variant text-body-sm font-medium">上传人</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] text-primary font-bold">
                      {asset.uploader[0]}
                    </div>
                    <span className="text-on-surface text-body-sm font-semibold">{asset.uploader}</span>
                  </div>
                </div>
              )}
              {fieldPreferences.city && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-on-surface-variant text-body-sm font-medium">城市</span>
                  <span className="col-span-2 text-on-surface text-body-sm font-semibold">{asset.city}</span>
                </div>
              )}
              {fieldPreferences.tags && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-on-surface-variant text-body-sm font-medium">标签</span>
                  <div className="col-span-2 flex flex-wrap gap-2">
                    {asset.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[11px] rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {fieldPreferences.duration && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-on-surface-variant text-body-sm font-medium">时长</span>
                  <span className="col-span-2 text-on-surface text-body-sm font-semibold">{formatDuration(asset.duration)}</span>
                </div>
              )}
              {fieldPreferences.uploadTime && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-on-surface-variant text-body-sm font-medium">上传时间</span>
                  <span className="col-span-2 text-on-surface text-body-sm font-semibold">
                    {format(new Date(asset.uploadTime), 'MMM dd, yyyy • HH:mm')}
                  </span>
                </div>
              )}
              {fieldPreferences.fileSize && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-on-surface-variant text-body-sm font-medium">文件大小</span>
                  <span className="col-span-2 text-on-surface text-body-sm font-semibold">{formatBytes(asset.fileSize)}</span>
                </div>
              )}
            </div>
          </section>

          <section className="pt-4">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container transition-all text-sm font-semibold">
              <History className="w-4 h-4" />
              查看编辑历史
            </button>
          </section>
        </div>

        {/* 底部操作栏 */}
        <div className="px-6 py-4 bg-white/50 backdrop-blur-md border-t border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-tertiary">
            <CloudCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">已自动保存</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-on-surface-variant text-sm font-semibold hover:bg-surface-container-high rounded-lg transition-all">取消</button>
            <button onClick={onClose} className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-95 transition-all">保存更改</button>
          </div>
        </div>
      </aside>
    </>
  );
};
