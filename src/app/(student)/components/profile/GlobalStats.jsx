import React from "react";
import { motion } from "framer-motion";
import { FiAward, FiAlertCircle, FiSmartphone } from "react-icons/fi";

export default function GlobalStats({
  globalPercentage,
  mostAttended,
  mostMissed,
  totalHours,
  deviceInfo,
  onDeviceChangeRequest,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:col-span-1 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <h3 className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">
          Overall Attendance
        </h3>
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-800"
            />
            <motion.circle
              initial={{ strokeDashoffset: 553 }}
              animate={{
                strokeDashoffset: 553 - (553 * globalPercentage) / 100,
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="553"
              className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-bold text-white">
              {globalPercentage}%
            </span>
            <span className="text-xs text-slate-400 mt-1">Average</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <div className="bg-white/5 border border-emerald-400/50 rounded-xl p-6 backdrop-blur-md flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <FiAward className="w-5 h-5" />
            </div>
            <h4 className="text-sm text-slate-400">Most Attended</h4>
          </div>
          {mostAttended ? (
            <>
              <p className="text-2xl font-bold text-white mt-2">
                {mostAttended.course_code}
              </p>
              <p className="text-sm text-emerald-400">
                {mostAttended.percentage}% Attendance
              </p>
            </>
          ) : (
            <p className="text-slate-500 mt-2">Not enough data yet</p>
          )}
        </div>

        <div className="bg-white/5 border border-rose-400/50 rounded-xl p-6 backdrop-blur-md flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
              <FiAlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm text-slate-400">Least Attended</h4>
          </div>
          {mostMissed ? (
            <>
              <p className="text-2xl font-bold text-white mt-2">
                {mostMissed.course_code}
              </p>
              <p className="text-sm text-rose-400">
                {mostMissed.percentage}% Attendance
              </p>
            </>
          ) : (
            <p className="text-slate-500 mt-2">Not enough data yet</p>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h4 className="text-sm text-slate-400 mb-1">Time Logged in Class</h4>
          <p className="text-3xl font-bold text-white mt-2">
            {totalHours}{" "}
            <span className="text-lg text-slate-500 font-medium">Hours</span>
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="text-sm text-slate-400 mb-1">Active Scan Device</h4>
            <div className="flex items-center gap-2 mt-2">
              <FiSmartphone className="w-5 h-5 text-blue-400" />
              <p className="text-lg font-medium text-white">{deviceInfo}</p>
            </div>
          </div>
          <button
            onClick={onDeviceChangeRequest}
            className="mt-4 text-sm text-blue-400 hover:text-blue-300 self-start underline underline-offset-4 cursor-pointer"
          >
            Request Device Change
          </button>
        </div>
      </motion.div>
    </div>
  );
}
