"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type ChartData = {
  date: string;
  revenue: number;
  orders: number;
};

export function RevenueChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2d5c3" />
        <XAxis 
          dataKey="date" 
          stroke="#8b7355"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#8b7355"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2d5c3',
            borderRadius: '8px',
          }}
          formatter={(value) => [`₹${value}`, 'Revenue']}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#6f4e37" 
          strokeWidth={2}
          dot={{ fill: '#6f4e37', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function OrdersChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2d5c3" />
        <XAxis 
          dataKey="date" 
          stroke="#8b7355"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#8b7355"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2d5c3',
            borderRadius: '8px',
          }}
          formatter={(value) => [`${value}`, 'Orders']}
        />
        <Bar 
          dataKey="orders" 
          fill="#6f4e37"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
