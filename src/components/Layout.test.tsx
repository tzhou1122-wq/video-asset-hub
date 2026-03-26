import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from './Layout';

describe('Layout Component', () => {
  it('should render children and navigation', () => {
    render(
      <Layout>
        <div data-testid="child-content">Child Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('光影中心')).toBeInTheDocument();
  });

  it('should toggle sidebar on mobile', () => {
    // Mock window.innerWidth to simulate mobile
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    // The menu button is the first button in the header
    const menuButton = screen.getAllByRole('button')[0];
    
    // Initial state: sidebar is hidden on mobile (-translate-x-full)
    const sidebar = screen.getByText('主菜单').closest('aside');
    expect(sidebar).toHaveClass('-translate-x-full');
    
    // Click menu button
    fireEvent.click(menuButton);
    
    // Sidebar should be visible
    expect(sidebar).toHaveClass('translate-x-0');
    
    // Click overlay to close
    const overlay = document.querySelector('.bg-black\\/50');
    if (overlay) {
      fireEvent.click(overlay);
      expect(sidebar).toHaveClass('-translate-x-full');
    }
  });
});
