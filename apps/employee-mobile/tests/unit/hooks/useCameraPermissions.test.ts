import { renderHook, act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useCameraPermissions } from '../../../hooks/useCameraPermissions'; // Adjust path
import { Camera } from 'expo-camera';

// Mock expo-camera
vi.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: vi.fn(),
  },
}));

describe('useCameraPermissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with hasPermission as null', () => {
    (Camera.requestCameraPermissionsAsync as any).mockResolvedValue({ status: 'undetermined' });
    const { result } = renderHook(() => useCameraPermissions());
    expect(result.current.hasPermission).toBeNull();
  });

  it('should request permissions on mount and set hasPermission to true if granted', async () => {
    (Camera.requestCameraPermissionsAsync as any).mockResolvedValue({ status: 'granted' });
    const { result } = renderHook(() => useCameraPermissions());

    await act(async () => {
      // Wait for the useEffect to complete
    });

    expect(Camera.requestCameraPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(result.current.hasPermission).toBe(true);
  });

  it('should request permissions on mount and set hasPermission to false if denied', async () => {
    (Camera.requestCameraPermissionsAsync as any).mockResolvedValue({ status: 'denied' });
    const { result } = renderHook(() => useCameraPermissions());

    await act(async () => {
      // Wait for the useEffect to complete
    });

    expect(Camera.requestCameraPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(result.current.hasPermission).toBe(false);
  });

  it('requestPermissions should update hasPermission to true if granted', async () => {
    (Camera.requestCameraPermissionsAsync as any).mockResolvedValue({ status: 'granted' });
    const { result } = renderHook(() => useCameraPermissions());

    await act(async () => {
      await result.current.requestPermissions();
    });

    expect(Camera.requestCameraPermissionsAsync).toHaveBeenCalledTimes(2); // Once on mount, once on call
    expect(result.current.hasPermission).toBe(true);
  });

  it('requestPermissions should update hasPermission to false if denied', async () => {
    (Camera.requestCameraPermissionsAsync as any).mockResolvedValue({ status: 'denied' });
    const { result } = renderHook(() => useCameraPermissions());

    await act(async () => {
      await result.current.requestPermissions();
    });

    expect(Camera.requestCameraPermissionsAsync).toHaveBeenCalledTimes(2);
    expect(result.current.hasPermission).toBe(false);
  });
});
