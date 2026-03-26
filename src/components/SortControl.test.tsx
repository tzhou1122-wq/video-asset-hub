import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SortControl, SortField, SortOrder } from './SortControl';

describe('SortControl Component', () => {
  const defaultProps = {
    sortField: 'uploadTime' as SortField,
    sortOrder: 'desc' as SortOrder,
    onSortChange: vi.fn(),
  };

  it('should render sort buttons correctly', () => {
    render(<SortControl {...defaultProps} />);
    
    expect(screen.getByText('上传时间')).toBeInTheDocument();
    expect(screen.getByText('文件大小')).toBeInTheDocument();
  });

  it('should call onSortChange with new field when clicking a different field', () => {
    const onSortChangeMock = vi.fn();
    render(<SortControl {...defaultProps} onSortChange={onSortChangeMock} />);
    
    const sizeButton = screen.getByText('文件大小');
    fireEvent.click(sizeButton);
    
    expect(onSortChangeMock).toHaveBeenCalledWith('fileSize', 'desc');
  });

  it('should call onSortChange with toggled order when clicking the same field', () => {
    const onSortChangeMock = vi.fn();
    render(<SortControl {...defaultProps} onSortChange={onSortChangeMock} />);
    
    const timeButton = screen.getByText('上传时间');
    fireEvent.click(timeButton);
    
    expect(onSortChangeMock).toHaveBeenCalledWith('uploadTime', 'asc');
  });

  it('should apply active styles to the currently selected field', () => {
    const { rerender } = render(<SortControl {...defaultProps} />);
    
    const timeButton = screen.getByText('上传时间').closest('button');
    const sizeButton = screen.getByText('文件大小').closest('button');
    
    expect(timeButton).toHaveClass('text-primary');
    expect(sizeButton).not.toHaveClass('text-primary');

    rerender(<SortControl {...defaultProps} sortField="fileSize" />);
    
    expect(timeButton).not.toHaveClass('text-primary');
    expect(sizeButton).toHaveClass('text-primary');
  });
});
