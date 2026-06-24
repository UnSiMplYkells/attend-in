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

export default function DashboardCharts({ trendData = [], courseData = [], ratioData = [] }){
  return (
    <div className="space-y-6">
      {/* Trend Line Chart */}
      <div className="p-5 rounded-xl border border-[var(--fg)]/10 bg-[var(--fg)]/5">
        <h3 className="text-lg font-semibold mb-4">Weekly Attendance Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(150,150,150,0.2)"
              />
              <XAxis
                dataKey="week"
                stroke="var(--fg)"
                fontSize={12}
                opacity={0.7}
              />
              <YAxis stroke="var(--fg)" fontSize={12} opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg)",
                  borderColor: "rgba(150,150,150,0.2)",
                  color: "var(--fg)",
                }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Bar Chart */}
        <div className="p-5 rounded-xl border border-[var(--fg)]/10 bg-[var(--fg)]/5">
          <h3 className="text-lg font-semibold mb-4">By Course (%)</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(150,150,150,0.2)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--fg)"
                  fontSize={12}
                  opacity={0.7}
                />
                <Tooltip
                  cursor={{ fill: "rgba(150,150,150,0.1)" }}
                  contentStyle={{
                    backgroundColor: "var(--bg)",
                    borderColor: "rgba(150,150,150,0.2)",
                    color: "var(--fg)",
                  }}
                />
                <Bar dataKey="avg" fill="#9e7242" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ratio Pie Chart */}
        <div className="p-5 rounded-xl border border-[var(--fg)]/10 bg-[var(--fg)]/5">
          <h3 className="text-lg font-semibold mb-4">Overall Status</h3>
          <div className="h-48 w-full">
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
                    backgroundColor: "var(--bg)",
                    color: "var(--fg)",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
