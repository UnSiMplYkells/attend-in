import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#10b981", "#ef4444", "#f59e0b"];

export default function DashboardCharts({
  trendData = [],
  courseData = [],
  ratioData = [],
}) {
  const hasTrendData = trendData.length > 1;
  const hasCourseData = courseData.some((d) => d.avg > 0);
  const hasRatioData = ratioData.some((d) => d.value > 0);

  const Fallback = ({ chartName }) => (
    <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
      Not enough data to display {chartName}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Trend Line Chart */}
      <div className="p-5 rounded-xl border border-white/5 bg-white/5">
        <h3 className="text-lg font-semibold mb-4">Weekly Attendance Trend</h3>
        <div className="h-64 w-full">
          {hasTrendData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="week"
                  stroke="#a1a1aa"
                  fontSize={12}
                  opacity={0.8}
                />
                <YAxis stroke="#a1a1aa" fontSize={12} opacity={0.8} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "#f1f5f9",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Fallback chartName="Trend Chart" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Bar Chart */}
        <div className="p-5 rounded-xl border border-white/5 bg-white/5">
          <h3 className="text-lg font-semibold mb-4">By Course (%)</h3>
          <div className="h-48 w-full">
            {hasCourseData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#a1a1aa"
                    fontSize={12}
                    opacity={0.8}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "rgba(255,255,255,0.2)",
                      color: "#f1f5f9",
                    }}
                  />
                  <Bar dataKey="avg" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Fallback chartName="Course Chart" />
            )}
          </div>
        </div>

        {/* Ratio Pie Chart */}
        <div className="p-5 rounded-xl border border-white/5 bg-white/5">
          <h3 className="text-lg font-semibold mb-4">Overall Status</h3>
          <div className="h-48 w-full">
            {hasRatioData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {ratioData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#f1f5f9",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Fallback chartName="Ratio Chart" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
