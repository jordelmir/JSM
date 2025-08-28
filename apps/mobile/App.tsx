import React, { useEffect, useState } from 'react'; // Add useEffect and useState

export default function App() {
  const accessToken = useUserStore((state) => state.accessToken);
  const loadTokens = useUserStore((state) => state.loadTokens); // Get loadTokens action
  const setTokens = useUserStore((state) => state.setTokens);

  const [isReady, setIsReady] = useState(false); // New state for app readiness

  useEffect(() => {
    async function prepare() {
      try {
        await loadTokens(); // Load tokens from secure store
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, [loadTokens]);

  if (!isReady) {
    return null; // Or a splash screen component
  }

  return (
    <ErrorBoundary>