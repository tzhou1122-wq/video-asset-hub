import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssetCard } from './AssetCard';
import { VideoAsset } from '../mock/data';

const mockAsset: VideoAsset = {
  id: '1',
  title: 'Test Video',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  videoUrl: 'https://example.com/video.mp4',
  uploader: 'John Doe',
  status: 'approved',
  fileSize: 1048576, // 1MB
  uploadTime: '2023-10-01T12:00:00Z',
  city: 'Beijing',
  tags: ['tag1', 'tag2'],
  duration: 120, // 2 minutes
};

describe('AssetCard Component', () => {
  it('should render asset details correctly', () => {
    render(<AssetCard asset={mockAsset} onClick={() => {}} />);
    
    expect(screen.getByText('Test Video')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('已通过')).toBeInTheDocument();
    expect(screen.getByText('1 MB')).toBeInTheDocument();
    expect(screen.getByText('02:00')).toBeInTheDocument();
    
    const image = screen.getByAltText('Test Video') as HTMLImageElement;
    expect(image.src).toBe('https://example.com/thumb.jpg');
  });

  it('should call onClick with asset when clicked', () => {
    const onClickMock = vi.fn();
    render(<AssetCard asset={mockAsset} onClick={onClickMock} />);
    
    const card = screen.getByText('Test Video').closest('.group');
    if (card) {
      fireEvent.click(card);
    }
    
    expect(onClickMock).toHaveBeenCalledWith(mockAsset);
  });

  it('should render different status tags correctly', () => {
    const { rerender } = render(<AssetCard asset={{ ...mockAsset, status: 'pending' }} onClick={() => {}} />);
    expect(screen.getByText('待审核')).toBeInTheDocument();
    
    rerender(<AssetCard asset={{ ...mockAsset, status: 'rejected' }} onClick={() => {}} />);
    expect(screen.getByText('已驳回')).toBeInTheDocument();
  });
});
