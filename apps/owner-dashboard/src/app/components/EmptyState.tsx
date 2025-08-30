import React from 'react';
import { InboxIcon } from 'lucide-react'; // Example icon

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType; // Optional icon component
  illustration?: string; // Optional path to an illustration image
}

export default function EmptyState({ title, description, icon: Icon, illustration }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl shadow-sm border border-gray-200">
      {illustration ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={illustration} alt="Empty State Illustration" className="w-32 h-32 mb-6" />
      ) : Icon ? (
        <Icon className="w-16 h-16 text-gray-400 mb-6" />
      ) : (
        <InboxIcon className="w-16 h-16 text-gray-400 mb-6" /> // Default icon
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  );
}
