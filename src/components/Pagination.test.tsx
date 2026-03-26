import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  it('should not render if totalItems is 0', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={0}
        onPageChange={() => {}}
        totalItems={0}
        startIndex={0}
        endIndex={0}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render correct text and buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={() => {}}
        totalItems={40}
        startIndex={8}
        endIndex={16}
      />
    );
    
    expect(screen.getByText('第 9 到 16 条，共 40 条素材')).toBeInTheDocument();
    
    // Check if page buttons 1 to 5 are rendered
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('should call onPageChange when clicking a page number', () => {
    const onPageChangeMock = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChangeMock}
        totalItems={40}
        startIndex={0}
        endIndex={8}
      />
    );
    
    fireEvent.click(screen.getByText('3'));
    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });

  it('should disable prev button on first page and next button on last page', () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
        totalItems={40}
        startIndex={0}
        endIndex={8}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    const prevButton = buttons[0];
    const nextButton = buttons[buttons.length - 1];
    
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    rerender(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={() => {}}
        totalItems={40}
        startIndex={32}
        endIndex={40}
      />
    );
    
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('should render ellipsis for many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={() => {}}
        totalItems={80}
        startIndex={32}
        endIndex={40}
      />
    );
    
    const ellipses = screen.getAllByText('•••');
    expect(ellipses.length).toBeGreaterThan(0);
  });
});
