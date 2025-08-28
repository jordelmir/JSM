
import dynamic from 'next/dynamic';

const StationsList = dynamic(() => import('./stations-list'), { ssr: false });

export default function StationsPage() {
  return (
    <StationsList />
  );
}
