"use client";

import Link from "next/link";
import { useGetGeneralRecords } from "@/hooks/query/useGeneralAttendance";
import { GrHistory } from "react-icons/gr";
import { HiArrowRight } from "react-icons/hi2";

export default function RecordsPage() {
  const { data: records, isLoading, error } = useGetGeneralRecords();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl border border-white/10 bg-white/5 backdrop-blur-md"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">{error.message}</div>;
  }

  return (
    <div className="animate-in fade-in p-4 duration-500 sm:p-6">
      <div className="mb-8 flex items-center gap-4">
        <GrHistory className="text-4xl text-indigo-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">All Records</h1>
          <p className="text-sm text-gray-400">
            A history of all your created events.
          </p>
        </div>
      </div>

      {records && records.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-white/10 py-16 text-center">
          <p className="text-gray-400">No records found.</p>
        </div>
      )}
    </div>
  );
}

function RecordCard({ record }) {
  return (
    <Link
      href={`/general/records/${record.id}`}
      className="group relative flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-white/10"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-semibold text-white">
          {record.event_name}
        </p>

        <p className="mt-3 text-xs text-gray-400">
          {new Date(record.created_at).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(record.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <div className="mt-3">
          {record.is_active ? (
            <span className="inline-block rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-bold text-green-400">
              Active
            </span>
          ) : (
            <span className="inline-block rounded-full bg-gray-500/10 px-2 py-0.5 text-xs font-bold text-gray-400">
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-indigo-400/50 group-hover:bg-indigo-500/20">
        <HiArrowRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-indigo-400" />
      </div>
    </Link>
  );
}