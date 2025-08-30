import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';

interface SparklineProps {
  data: any[];
  dataKey: string;
  color: string;
  type?: 'line' | 'bar';
}

export default function Sparkline({ data, dataKey, color, type = 'line' }: SparklineProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'line' ? (
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      ) : (
        <BarChart data={data}>
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
