import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FiChevronDown, FiTrash2 } from "react-icons/fi";

export default function EnrolledCourses({ courses, onDeleteClick }) {
  const [coursesExpanded, setCoursesExpanded] = useState(false);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden">
      <button
        onClick={() => setCoursesExpanded(!coursesExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors cursor-pointer"
      >
        <h3 className="text-xl font-semibold text-white">
          All Enrolled Courses
        </h3>
        <motion.div animate={{ rotate: coursesExpanded ? 180 : 0 }}>
          <FiChevronDown className="w-6 h-6 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {coursesExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              {courses.map((course) => (
                <div
                  key={course.class_id}
                  className="bg-gradient-to-bl from-red-600/10 to-transparent backdrop-blur-md border border-white/10 rounded-xl p-5 relative group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-white tracking-wider">
                        {course.course_code}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {course.course_title || "No Title"}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        onDeleteClick(course.class_id, course.course_code)
                      }
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="h-32 w-full relative mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Attended", value: course.attended },
                            {
                              name: "Missed",
                              value: course.held - course.attended,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={50}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#1e293b" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-sm font-bold text-white">
                        {course.attended}/{course.held}
                      </span>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-slate-400">
                      {course.percentage}% Attendance
                    </span>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-slate-500 col-span-full text-center py-8">
                  No courses enrolled.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}