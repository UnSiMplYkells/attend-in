import React from "react";

const SkeletonBlock = ({ className = "" }) => (
  <div className={`bg-slate-700/50 rounded-xl animate-pulse ${className}`} />
);

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen w- text-slate-200 pb-20 p-4 md:p-8 overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-48" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
        <div className="flex gap-3">
          <SkeletonBlock className="h-10 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <SkeletonBlock className="lg:col-span-1 h-72 rounded-2xl" />
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SkeletonBlock className="h-40 rounded-2xl" />
          <SkeletonBlock className="h-40 rounded-2xl" />
          <SkeletonBlock className="h-40 rounded-2xl" />
          <SkeletonBlock className="h-40 rounded-2xl" />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <SkeletonBlock className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
