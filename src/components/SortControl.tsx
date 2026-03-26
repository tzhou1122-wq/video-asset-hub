import React from 'react';
import clsx from 'clsx';
import { ArrowUp, ArrowDown } from 'lucide-react';

export type SortField = 'uploadTime' | 'fileSize';
export type SortOrder = 'asc' | 'desc';

interface SortControlProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

/**
 * 排序控制组件
 * 提供对素材列表的排序字段和顺序切换。
 */
export const SortControl: React.FC<SortControlProps> = ({ sortField, sortOrder, onSortChange }) => {
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'desc');
    }
  };

  const sortOptions: { label: string; value: SortField }[] = [
    { label: '上传时间', value: 'uploadTime' },
    { label: '文件大小', value: 'fileSize' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <span className="text-xs font-bold text-on-surface-variant">排序方式:</span>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSort(option.value)}
            className={clsx(
              "text-xs px-4 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1",
              sortField === option.value 
                ? "border border-primary text-primary" 
                : "border border-outline-variant text-on-surface-variant hover:border-primary"
            )}
          >
            {option.label}
            {sortField === option.value && (
              sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
