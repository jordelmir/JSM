import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useDarkMode } from '../../src/hooks/useDarkMode';
import * as storage from '../../src/core/storage';

describe('useDarkMode', () => {
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(storage, 'get').mockReturnValue(null);
    vi.spyOn(storage, 'set').mockImplementation(() => {});
    // Reset document.documentElement.classList
    document.documentElement.classList.remove('dark');
  });

  it('should initialize from localStorage if a preference exists', () => {
    vi.spyOn(storage, 'get').mockReturnValue(true); // Stored preference is dark
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(storage.get).toHaveBeenCalledWith('darkMode');
  });

  it('should initialize from system preference if no localStorage preference', () => {
    mockMatchMedia(true); // System prefers dark
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(storage.get).toHaveBeenCalledWith('darkMode');
  });

  it('should toggle dark mode state and update localStorage', () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false); // Initial state (assuming no preference and system prefers light)

    act(() => {
      result.current[1](); // Call toggleDarkMode
    });
    expect(result.current[0]).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(storage.set).toHaveBeenCalledWith('darkMode', true);

    act(() => {
      result.current[1](); // Call toggleDarkMode again
    });
    expect(result.current[0]).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(storage.set).toHaveBeenCalledWith('darkMode', false);
  });

  it('should apply and remove "dark" class to documentElement', () => {
    const { result } = renderHook(() => useDarkMode());
    
    act(() => {
      result.current[1](); // Toggle to dark
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current[1](); // Toggle to light
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
