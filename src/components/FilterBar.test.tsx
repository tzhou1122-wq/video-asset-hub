import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar, FilterSchemaItem } from './FilterBar';

describe('FilterBar', () => {
  const mockSchema: FilterSchemaItem[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'input',
      placeholder: 'Enter search term',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  ];

  it('renders correctly based on schema', () => {
    const onChange = vi.fn();
    const onReset = vi.fn();
    
    render(
      <FilterBar 
        schema={mockSchema} 
        value={{}} 
        onChange={onChange} 
        onReset={onReset} 
      />
    );

    // Check if labels are rendered
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check if input is rendered
    const input = screen.getByPlaceholderText('Enter search term');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const onChange = vi.fn();
    const onReset = vi.fn();
    
    render(
      <FilterBar 
        schema={mockSchema} 
        value={{}} 
        onChange={onChange} 
        onReset={onReset} 
      />
    );

    const input = screen.getByPlaceholderText('Enter search term');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(onChange).toHaveBeenCalledWith({ search: 'test' });
  });
});
