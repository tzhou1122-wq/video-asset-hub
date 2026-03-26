import React from 'react';
import { Select, Input } from 'antd';

export interface FilterSchemaItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  type: 'select' | 'input' | 'radio' | 'tags';
  options?: Array<{ label: string; value: string | number }>;
  placeholder?: string;
}

export interface FilterBarProps {
  schema: FilterSchemaItem[];
  value: Record<string, any>;
  onChange: (val: Record<string, any>) => void;
  onReset: () => void;
}

/**
 * 渲染策略映射
 * 将不同的过滤类型映射到对应的渲染函数。
 * 便于扩展新类型（如日期范围、滑块等）而无需修改主逻辑。
 */
const RENDER_STRATEGY: Record<
  FilterSchemaItem['type'],
  (item: FilterSchemaItem, value: any, onChange: (val: any) => void) => React.ReactNode
> = {
  select: (item, value, onChange) => (
    <Select
      className="w-full"
      placeholder={item.placeholder}
      options={item.options}
      value={value}
      onChange={onChange}
      allowClear
      size="large"
      variant="borderless"
      style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: '0.5rem' }}
    />
  ),
  input: (item, value, onChange) => (
    <Input
      placeholder={item.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="large"
      variant="borderless"
      style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: '0.5rem' }}
    />
  ),
  radio: () => null, // 待实现
  tags: () => null,  // 待实现
};

/**
 * 过滤栏组件 (配置驱动)
 * 使用策略模式分发渲染逻辑，符合开闭原则。
 */
export const FilterBar: React.FC<FilterBarProps> = ({ schema, value, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
      {schema.map((item) => (
        <div key={item.key} className="space-y-2">
          {/* 控件标签与图标 */}
          <label className="text-[13px] font-bold text-gray-500 flex items-center gap-1">
            {item.icon}
            {item.label}
          </label>
          
          {/* 使用策略模式进行渲染 */}
          {RENDER_STRATEGY[item.type]?.(
            item, 
            value[item.key], 
            (val) => onChange({ ...value, [item.key]: val })
          )}
        </div>
      ))}
    </div>
  );
};
