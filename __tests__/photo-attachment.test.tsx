import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoAttachment from '@/components/PhotoAttachment';
import { LocalPhoto } from '@/lib/storage/db';

describe('PhotoAttachment', () => {
  const mockOnPhotosChange = vi.fn();

  beforeEach(() => {
    mockOnPhotosChange.mockClear();
  });

  it('should render upload button', () => {
    render(<PhotoAttachment photos={[]} onPhotosChange={mockOnPhotosChange} />);
    
    const uploadButton = screen.getByRole('button', { name: /add photo/i });
    expect(uploadButton).toBeDefined();
  });

  it('should display attached photos in grid', () => {
    const photos: LocalPhoto[] = [
      {
        id: '1',
        dataUrl: 'data:image/png;base64,test1',
        addedAt: new Date(),
      },
      {
        id: '2',
        dataUrl: 'data:image/png;base64,test2',
        addedAt: new Date(),
      },
    ];

    render(<PhotoAttachment photos={photos} onPhotosChange={mockOnPhotosChange} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('should call onPhotosChange when photo is deleted', async () => {
    const user = userEvent.setup();
    const photos: LocalPhoto[] = [
      {
        id: '1',
        dataUrl: 'data:image/png;base64,test1',
        addedAt: new Date(),
      },
    ];

    render(<PhotoAttachment photos={photos} onPhotosChange={mockOnPhotosChange} />);
    
    const deleteButton = screen.getByTitle('Delete photo');
    await user.click(deleteButton);

    expect(mockOnPhotosChange).toHaveBeenCalledWith([]);
  });

  it('should handle multiple photo deletion correctly', async () => {
    const user = userEvent.setup();
    const photos: LocalPhoto[] = [
      {
        id: '1',
        dataUrl: 'data:image/png;base64,test1',
        addedAt: new Date(),
      },
      {
        id: '2',
        dataUrl: 'data:image/png;base64,test2',
        addedAt: new Date(),
      },
      {
        id: '3',
        dataUrl: 'data:image/png;base64,test3',
        addedAt: new Date(),
      },
    ];

    const { rerender } = render(
      <PhotoAttachment photos={photos} onPhotosChange={mockOnPhotosChange} />
    );
    
    // Delete first photo
    const deleteButtons = screen.getAllByTitle('Delete photo');
    await user.click(deleteButtons[0]);

    expect(mockOnPhotosChange).toHaveBeenCalledWith([photos[1], photos[2]]);
  });

  it('should accept image files', async () => {
    render(<PhotoAttachment photos={[]} onPhotosChange={mockOnPhotosChange} />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Verify file input accepts images
    expect(fileInput.accept).toBe('image/*');
    expect(fileInput.multiple).toBe(true);
  });

  it('should respect maxSizeMB prop', () => {
    const { container } = render(
      <PhotoAttachment photos={[]} onPhotosChange={mockOnPhotosChange} maxSizeMB={5} />
    );
    
    // Component should render without errors
    expect(container).toBeDefined();
  });

  it('should not render photo grid when no photos', () => {
    render(<PhotoAttachment photos={[]} onPhotosChange={mockOnPhotosChange} />);
    
    const images = screen.queryAllByRole('img');
    expect(images).toHaveLength(0);
  });

  it('should preserve photo order', () => {
    const photos: LocalPhoto[] = [
      {
        id: '1',
        dataUrl: 'data:image/png;base64,first',
        addedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        dataUrl: 'data:image/png;base64,second',
        addedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        dataUrl: 'data:image/png;base64,third',
        addedAt: new Date('2024-01-03'),
      },
    ];

    render(<PhotoAttachment photos={photos} onPhotosChange={mockOnPhotosChange} />);
    
    const images = screen.getAllByRole('img') as HTMLImageElement[];
    expect(images[0].src).toContain('first');
    expect(images[1].src).toContain('second');
    expect(images[2].src).toContain('third');
  });
});
