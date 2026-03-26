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
 * 过滤栏组件 (配置驱动)
 * 根据传入的 schema 动态渲染过滤控件（下拉框、输入框等）。
 * 这种设计模式使得新增过滤项只需修改配置，无需改动组件代码。
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
          
          {/* 根据类型渲染对应的 Ant Design 控件 */}
          {item.type === 'select' && (
            <Select
              className="w-full"
              placeholder={item.placeholder}
              options={item.options}
              value={value[item.key]}
              onChange={(val) => onChange({ ...value, [item.key]: val })}
              allowClear
              size="large"
              variant="borderless"
              style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: '0.5rem' }}
            />
          )}
          {item.type === 'input' && (
            <Input
              placeholder={item.placeholder}
              value={value[item.key]}
              onChange={(e) => onChange({ ...value, [item.key]: e.target.value })}
              size="large"
              variant="borderless"
              style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: '0.5rem' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
