import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function EmotionChart({ data }) {
  const chartData = Object.entries(data).map(([emotion, value]) => ({
    emotion, value: Math.round(value * 100)
  }));
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top:20, right:30, left:10, bottom:5 }}>
          <XAxis dataKey="emotion" />
          <YAxis unit="%" />
          <Tooltip />
          <Bar dataKey="value" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

