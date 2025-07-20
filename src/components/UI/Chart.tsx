import React from 'react';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { PriceData } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ChartProps {
  data: PriceData;
  days: number;
  isPositive: boolean;
}

const Chart: React.FC<ChartProps> = ({ data, days, isPositive }) => {
  const chartData = data.prices.map(([timestamp, price]) => ({
    time: timestamp,
    price: price,
    date: new Date(timestamp).toLocaleDateString(),
    formattedDate: new Date(timestamp).toLocaleString(),
  }));

  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem);
    if (days <= 1) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days <= 7) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg p-3 rounded-lg border border-white/20 dark:border-gray-700/20"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(label).toLocaleString()}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(payload[0].value)}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-80 p-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={isPositive ? "#10B981" : "#EF4444"}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={isPositive ? "#10B981" : "#EF4444"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="time"
            tickFormatter={formatXAxis}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(156, 163, 175, 0.8)', fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(156, 163, 175, 0.8)', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#10B981" : "#EF4444"}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default Chart;