import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssetTable } from './AssetTable';
import { VideoAsset } from '../mock/data';

const mockAssets: VideoAsset[] = [
  {
    id: '1',
    title: 'Test Video 1',
    thumbnailUrl: 'https://example.com/thumb1.jpg',
    videoUrl: 'https://example.com/video1.mp4',
    uploader: 'John Doe',
    status: 'approved',
    fileSize: 1048576, // 1MB
    uploadTime: '2023-10-01T12:00:00Z',
    city: 'Beijing',
    tags: ['tag1'],
    duration: 120,
  },
  {
    id: '2',
    title: 'Test Video 2',
    thumbnailUrl: 'https://example.com/thumb2.jpg',
    videoUrl: 'https://example.com/video2.mp4',
    uploader: 'Jane Smith',
    status: 'pending',
    fileSize: 2097152, // 2MB
    uploadTime: '2023-10-02T12:00:00Z',
    city: 'Shanghai',
    tags: ['tag2'],
    duration: 240,
  }
];

describe('AssetTable Component', () => {
  it('should render table headers correctly', () => {
    render(<AssetTable assets={mockAssets} onRowClick={() => {}} />);
    
    expect(screen.getByText('素材')).toBeInTheDocument();
    expect(screen.getByText('上传人')).toBeInTheDocument();
    expect(screen.getByText('状态')).toBeInTheDocument();
    expect(screen.getByText('大小')).toBeInTheDocument();
    expect(screen.getByText('上传时间')).toBeInTheDocument();
  });

  it('should render asset rows correctly', () => {
    render(<AssetTable assets={mockAssets} onRowClick={() => {}} />);
    
    expect(screen.getByText('Test Video 1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('已通过')).toBeInTheDocument();
    expect(screen.getByText('1 MB')).toBeInTheDocument();
    
    expect(screen.getByText('Test Video 2')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('待审核')).toBeInTheDocument();
    expect(screen.getByText('2 MB')).toBeInTheDocument();
  });

  it('should call onRowClick with asset when a row is clicked', () => {
    const onRowClickMock = vi.fn();
    render(<AssetTable assets={mockAssets} onRowClick={onRowClickMock} />);
    
    // The row is clickable, we can find it by text and click its parent tr
    const row1 = screen.getByText('Test Video 1').closest('tr');
    if (row1) {
      fireEvent.click(row1);
    }
    
    expect(onRowClickMock).toHaveBeenCalledWith(mockAssets[0]);
  });
});
