import React, { useState, useRef, useEffect } from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { formatDuration } from '../utils/format';

interface VideoPlayerProps {
  src: string;
  thumbnailUrl: string;
  title: string;
  duration: number;
}

/**
 * 视频播放器组件
 * 集中处理播放、暂停、错误捕获以及未来可能的动态签名 URL 逻辑。
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, thumbnailUrl, title, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 当 src 改变时重置状态
  useEffect(() => {
    setIsPlaying(false);
    setError(null);
  }, [src]);

  const handlePlay = () => {
    setIsPlaying(true);
    setError(null);
  };

  const handleVideoError = () => {
    setError('视频加载失败，请检查网络或格式。');
    setIsPlaying(false);
  };

  return (
    <section className="relative aspect-video bg-black rounded-xl overflow-hidden group shadow-lg">
      {isPlaying && !error ? (
        <video 
          ref={videoRef}
          src={src} 
          controls 
          autoPlay 
          onError={handleVideoError}
          className="w-full h-full object-contain bg-black"
        />
      ) : (
        <>
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
          />
          
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4 text-center">
              <AlertCircle className="w-10 h-10 text-error mb-2" />
              <p className="text-sm font-medium">{error}</p>
              <button 
                onClick={handlePlay}
                className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs transition-all"
              >
                重试
              </button>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={handlePlay}
                className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
              >
                <Play className="w-8 h-8 fill-current" />
              </button>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-white/90 font-medium">
            <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded">
              00:00 / {formatDuration(duration)}
            </span>
            <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded uppercase">
              4K • PRORES 422
            </span>
          </div>
        </>
      )}
    </section>
  );
};
