"use client";

import { useParams, useRouter } from "next/navigation"; // <-- import useRouter
import {
  useGetEventDetails,
  useGetEventAttendees,
} from "@/hooks/query/useGeneralAttendance";
import Button from "@/app/components/ui/Button";
import { FiDownload } from "react-icons/fi";

function downloadCSV(data, eventName) {
  const headers = ["Name", "Device ID", "Timestamp"];
  const csvContent = [
    headers.join(","),
    ...data.map((item) =>
      [
        item.name,
        item.device_id,
        new Date(item.created_at).toLocaleString(),
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${eventName}_attendees.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function RecordDetailsPage() {
  const { eventId } = useParams();
  const router = useRouter(); // <-- get router
  const { data: event, isLoading: isLoadingEvent } =
    useGetEventDetails(eventId);
  const { data: attendees, isLoading: isLoadingAttendees } =
    useGetEventAttendees(eventId);

  const isLoading = isLoadingEvent || isLoadingAttendees;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="w-3/4 h-8 bg-white/10 rounded-lg animate-pulse mb-8" />
        <div className="w-full h-12 bg-white/10 rounded-lg animate-pulse" />
        <div className="w-full h-12 bg-white/10 rounded-lg animate-pulse" />
        <div className="w-full h-12 bg-white/10 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-8 text-center text-gray-400">Event not found.</div>
    );
  }

  return (
    <div className="p-3 sm:p-5 animate-in fade-in duration-500">
      {/* Back button above the event name */}
      <button
        onClick={() => router.back()}
        className="mb-1 flex items-center text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <span className="mr-1 text-lg leading-none">←</span> Go Back
      </button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{event.event_name}</h1>
          <p className="text-sm text-gray-400">
            {attendees?.length || 0} attendee(s)
          </p>
        </div>
        <Button
          variant="secondary"
          width="w-fit"
          onClick={() => downloadCSV(attendees, event.event_name)}
          disabled={!attendees || attendees.length === 0}
        >
          <FiDownload className="mr-2" />
          Export
        </Button>
      </div>

      {/* Table remains exactly the same */}
      <div className="bg-white/5 border border-white/10 rounded-lg">
        <table className="w-full text-left">
          <thead className="border-b border-white/10">
            <tr>
              <th className="p-4 text-sm font-semibold text-white">Name</th>
              <th className="p-4 text-sm font-semibold text-white hidden sm:table-cell">
                Device ID
              </th>
              <th className="p-4 text-sm font-semibold text-white">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {attendees && attendees.length > 0 ? (
              attendees.map((attendee, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="p-4 text-white">{attendee.name}</td>
                  <td className="p-4 text-gray-400 hidden sm:table-cell">
                    {attendee.device_id}
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(attendee.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">
                  No attendees yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
