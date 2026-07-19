"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetGeneralEvents } from "@/hooks/query/useGeneralAttendance";
import QrGenerator from "@/app/components/QrGenerator";
import { MdEvent } from "react-icons/md";
import Button from "@/app/components/ui/Button";

const cardStyle = "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:border-indigo-500/50";

function EventCard({ event, onSelect, isSelected }) {
  const qrUrl = `${window.location.origin}/scan/${event.id}`;

  return (
    <div className={`${cardStyle} animate-in fade-in duration-500`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{event.event_name}</h3>
          <p className="text-xs text-gray-400 mt-1">
            Created: {new Date(event.created_at).toLocaleString()}
          </p>
        </div>
        <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
          Active
        </span>
      </div>

      {isSelected ? (
        <div className="mt-6 flex flex-col items-center">
          <QrGenerator value={qrUrl} />
        </div>
      ) : (
        <div className="mt-6 flex gap-3">
          <Button
            variant="primary"
            width="w-full"
            onClick={() => onSelect(event.id)}
          >
            Show QR Code
          </Button>
          <Link href={`/general/records/${event.id}`} className="w-full">
            <Button variant="secondary" width="w-full">View Records</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function GeneralEventsPage() {
  const { data: events, isLoading, error } = useGetGeneralEvents();
  const [selectedEventId, setSelectedEventId] = useState(null);

  function handleSelectEvent(eventId) {
    setSelectedEventId(selectedEventId === eventId ? null : eventId);
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="w-full h-32 bg-white/10 rounded-xl animate-pulse" />
        <div className="w-full h-32 bg-white/10 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-8">{error.message}</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <MdEvent className="text-3xl text-indigo-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Active Events</h1>
          <p className="text-gray-400 text-sm">Currently active QR codes for check-in.</p>
        </div>
      </div>

      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={handleSelectEvent}
              isSelected={selectedEventId === event.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-xl">
          <p className="text-gray-400">No active events.</p>
          <Link href="/general/dashboard" className="mt-4 flex justify-center items-center ">
            <Button variant="primary" width="w-fit">
                Create One?
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
