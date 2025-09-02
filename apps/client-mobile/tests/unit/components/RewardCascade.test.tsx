import React from 'react';
import { render } from '@testing-library/react-native';
import { vi } from 'vitest';
import RewardCascade from '../../../app/components/RewardCascade';
import { Audio } from 'expo-av';

// Mock dependencies
vi.mock('lottie-react-native', () => ({
  __esModule: true,
  default: () => 'LottieView', // A simple string mock for the component
}));

vi.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: vi.fn().mockResolvedValue({
        sound: {
          playAsync: vi.fn().mockResolvedValue(undefined),
          unloadAsync: vi.fn().mockResolvedValue(undefined),
        },
      }),
    },
  },
}));

describe('RewardCascade', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call onAnimationEnd after the default duration', () => {
    const onAnimationEndMock = vi.fn();
    render(<RewardCascade onAnimationEnd={onAnimationEndMock} />);

    expect(onAnimationEndMock).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000); // Default duration
    expect(onAnimationEndMock).toHaveBeenCalledTimes(1);
  });

  it('should call onAnimationEnd after a custom duration', () => {
    const onAnimationEndMock = vi.fn();
    const customDuration = 5000;
    render(
      <RewardCascade
        onAnimationEnd={onAnimationEndMock}
        animationDuration={customDuration}
      />
    );

    expect(onAnimationEndMock).not.toHaveBeenCalled();
    vi.advanceTimersByTime(customDuration);
    expect(onAnimationEndMock).toHaveBeenCalledTimes(1);
  });

  it('should attempt to load and play a sound on mount', () => {
    const onAnimationEndMock = vi.fn();
    render(<RewardCascade onAnimationEnd={onAnimationEndMock} />);
    expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(1);
  });

  it('should unload the sound on unmount', () => {
    const onAnimationEndMock = vi.fn();
    const { unmount } = render(<RewardCascade onAnimationEnd={onAnimationEndMock} />);
    
    const soundInstance = (Audio.Sound.createAsync as any).mock.results[0].value.sound;
    
    unmount();
    
    expect(soundInstance.unloadAsync).toHaveBeenCalledTimes(1);
  });
});
