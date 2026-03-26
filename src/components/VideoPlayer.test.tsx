import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VideoPlayer } from './VideoPlayer';

describe('VideoPlayer Component', () => {
  const defaultProps = {
    src: 'https://example.com/video.mp4',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    title: 'Test Video',
    duration: 120, // 2 minutes
  };

  it('should render thumbnail and play button initially', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const image = screen.getByAltText('Test Video') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toBe(defaultProps.thumbnailUrl);
    
    // Check duration text
    expect(screen.getByText('00:00 / 02:00')).toBeInTheDocument();
    
    // Play button should be visible
    const playButton = screen.getByRole('button');
    expect(playButton).toBeInTheDocument();
  });

  it('should show video element when play button is clicked', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);
    
    // Video element should now be in the document
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video?.src).toBe(defaultProps.src);
    
    // Thumbnail should be gone
    expect(screen.queryByAltText('Test Video')).not.toBeInTheDocument();
  });

  it('should show error message when video loading fails', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);
    
    const video = document.querySelector('video');
    if (video) {
      fireEvent.error(video);
    }
    
    expect(screen.getByText('视频加载失败，请检查网络或格式。')).toBeInTheDocument();
    expect(screen.getByText('重试')).toBeInTheDocument();
  });

  it('should reset state when src changes', () => {
    const { rerender } = render(<VideoPlayer {...defaultProps} />);
    
    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);
    
    expect(document.querySelector('video')).toBeInTheDocument();
    
    rerender(<VideoPlayer {...defaultProps} src="https://example.com/video2.mp4" />);
    
    // Should be back to thumbnail view
    expect(screen.getByAltText('Test Video')).toBeInTheDocument();
    expect(document.querySelector('video')).not.toBeInTheDocument();
  });
});
