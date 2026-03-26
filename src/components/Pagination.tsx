import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

/**
 * 分页组件
 * 提供页码跳转、上一页/下一页功能。
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  startIndex,
  endIndex,
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-200 gap-4">
      <div className="text-xs text-on-surface-variant font-medium">
        第 {startIndex + 1} 到 {endIndex} 条，共 {totalItems} 条素材
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none py-1">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            
            // 简单的页码缩略逻辑
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
                onClick={() => onPageChange(page)}
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
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
