"use client";

export default function GridSkeleton({ count = 6 }) {
  const skeletonCards = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {skeletonCards.map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col justify-between p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm h-[200px] w-full"
        >
          {/* Top Row: Icon/Badge Placeholder */}
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-6 w-24 rounded bg-white/10 animate-pulse" />
          </div>

          {/* Middle: Title & Subtitle */}
          <div className="space-y-3 mb-6">
            <div className="h-8 w-3/4 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
          </div>

          {/* Bottom: Footer/Button Placeholder */}
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
