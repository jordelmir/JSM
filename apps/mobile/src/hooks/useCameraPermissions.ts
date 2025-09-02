import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera/next';

/**
 * Custom hook to manage camera permissions for Expo applications.
 * It requests permissions on mount and provides a function to re-request them.
 * @returns {{ hasPermission: boolean | null, requestPermissions: () => Promise<void> }}
 *   - `hasPermission`: `true` if camera permission is granted, `false` if denied, or `null` if not yet determined.
 *   - `requestPermissions`: An asynchronous function to explicitly request camera permissions from the user.
 */
export const useCameraPermissions = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  return { hasPermission, requestPermissions };
};