import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataDashboard } from './DataDashboard';
import { useAppStore } from '../store';
import { VideoAsset } from '../mock/data';

// Mock echarts to avoid canvas rendering issues in jsdom
vi.mock('echarts-for-react', () => ({
  default: () => <div data-testid="mock-echarts" />
}));

const mockAssets: VideoAsset[] = [
  {
    id: '1',
    title: 'Test Video 1',
    thumbnailUrl: 'https://example.com/thumb1.jpg',
    videoUrl: 'https://example.com/video1.mp4',
    uploader: 'John Doe',
    status: 'approved',
    fileSize: 1048576, // 1MB
    uploadTime: new Date().toISOString(),
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
    uploadTime: new Date().toISOString(),
    city: 'Shanghai',
    tags: ['tag2'],
    duration: 240,
  }
];

describe('DataDashboard Component', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({ assets: [], isLoading: false });
  });

  it('should update stats when assets change (verifying the useMemo bug)', () => {
    // 1. Render with empty assets
    render(<DataDashboard />);
    
    // The total should initially be 0
    // We look for the specific h3 containing the total count
    const totalElement = screen.getByText('素材总量').nextElementSibling;
    expect(totalElement?.textContent).toBe('0');
    
    // 2. Update the store with mock assets
    act(() => {
      useAppStore.setState({ assets: mockAssets });
    });
    
    // 3. The total should now be 2
    // If useMemo dependency array is empty, this assertion will fail!
    expect(totalElement?.textContent).toBe('2');
  });
});
