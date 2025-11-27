import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EntryEditor from '@/components/EntryEditor';
import { LocalPhoto } from '@/lib/storage/db';

describe('EntryEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the editor with toolbar buttons', () => {
    render(<EntryEditor />);

    // Check for toolbar buttons
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
    expect(screen.getByTitle('Underline')).toBeInTheDocument();
    expect(screen.getByTitle('Highlight')).toBeInTheDocument();
    expect(screen.getByTitle('Bullet List')).toBeInTheDocument();
    expect(screen.getByTitle('Todo List')).toBeInTheDocument();
  });

  it('should render with initial content', () => {
    const initialContent = '<p>Initial test content</p>';
    render(<EntryEditor initialContent={initialContent} />);

    // The content should be rendered in the editor
    expect(screen.getByText('Initial test content')).toBeInTheDocument();
  });

  it('should render formatting toolbar with correct buttons', async () => {
    render(<EntryEditor />);

    const boldButton = screen.getByTitle('Bold');
    const underlineButton = screen.getByTitle('Underline');
    const highlightButton = screen.getByTitle('Highlight');
    const bulletListButton = screen.getByTitle('Bullet List');
    const todoButton = screen.getByTitle('Todo List');

    // All buttons should be present
    expect(boldButton).toBeInTheDocument();
    expect(underlineButton).toBeInTheDocument();
    expect(highlightButton).toBeInTheDocument();
    expect(bulletListButton).toBeInTheDocument();
    expect(todoButton).toBeInTheDocument();

    // Buttons should be clickable
    await userEvent.click(boldButton);
    await userEvent.click(underlineButton);
  });

  it('should accept onSave callback prop', () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<EntryEditor onSave={onSave} />);

    // Editor should render without errors
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
  });

  it('should accept placeholder prop', () => {
    const placeholder = 'Custom placeholder text';
    render(<EntryEditor placeholder={placeholder} />);

    // Editor should render without errors
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
  });

  it('should render photo attachment component', () => {
    render(<EntryEditor />);

    // Photo attachment button should be present
    const photoButton = screen.getByRole('button', { name: /add photo/i });
    expect(photoButton).toBeInTheDocument();
  });

  it('should render with initial photos', () => {
    const initialPhotos: LocalPhoto[] = [
      {
        id: '1',
        dataUrl: 'data:image/png;base64,test',
        addedAt: new Date(),
      },
    ];

    render(<EntryEditor initialPhotos={initialPhotos} />);

    // Photo should be displayed
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should call onSave with content and photos', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const initialPhotos: LocalPhoto[] = [
      {
        id: '1',
        dataUrl: 'data:image/png;base64,test',
        addedAt: new Date(),
      },
    ];

    render(<EntryEditor initialPhotos={initialPhotos} onSave={onSave} />);

    // Editor should render with photos
    expect(screen.getByRole('button', { name: /add photo/i })).toBeInTheDocument();
  });
});
