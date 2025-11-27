import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoodSelector from '@/components/MoodSelector';

describe('MoodSelector', () => {
  it('should render all four mood options', () => {
    const onMoodSelect = vi.fn();
    render(<MoodSelector onMoodSelect={onMoodSelect} />);

    // Check that all mood buttons are present
    expect(screen.getByLabelText('Select Joy mood')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Calm mood')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Reflective mood')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Sad mood')).toBeInTheDocument();
  });

  it('should call onMoodSelect when a mood is clicked', async () => {
    const onMoodSelect = vi.fn();
    const user = userEvent.setup();
    render(<MoodSelector onMoodSelect={onMoodSelect} />);

    const joyButton = screen.getByLabelText('Select Joy mood');
    await user.click(joyButton);

    expect(onMoodSelect).toHaveBeenCalledWith('joy');
  });

  it('should show visual feedback for selected mood', () => {
    const onMoodSelect = vi.fn();
    render(<MoodSelector selectedMood="calm" onMoodSelect={onMoodSelect} />);

    const calmButton = screen.getByLabelText('Select Calm mood');
    expect(calmButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should allow changing mood selection', async () => {
    const onMoodSelect = vi.fn();
    const user = userEvent.setup();
    render(<MoodSelector selectedMood="joy" onMoodSelect={onMoodSelect} />);

    // Click on a different mood
    const reflectiveButton = screen.getByLabelText('Select Reflective mood');
    await user.click(reflectiveButton);

    expect(onMoodSelect).toHaveBeenCalledWith('reflective');
  });

  it('should apply custom className', () => {
    const onMoodSelect = vi.fn();
    const { container } = render(
      <MoodSelector onMoodSelect={onMoodSelect} className="custom-class" />
    );

    const moodContainer = container.firstChild;
    expect(moodContainer).toHaveClass('custom-class');
  });
});
