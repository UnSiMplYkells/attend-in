"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { MdEvent, MdHistory, MdAddCircle } from "react-icons/md";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import Modal from "@/app/components/ui/Modal";
import {
  useCreateGeneralEvent,
  useToggleEventStatus,
  useGetGeneralEvents,
} from "@/hooks/query/useGeneralAttendance";

const cardStyle = "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:border-indigo-500/50";

function StatCard({ href, icon, title, subtitle, live }) {
  return (
    <Link href={href} className={`${cardStyle} flex flex-col justify-between`}>
      <div className="flex justify-between items-start">
        <div className="bg-indigo-500/10 p-3 rounded-lg">{icon}</div>
        {live && (
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mt-4">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
    </Link>
  );
}

function CreateEventForm() {
  const [eventName, setEventName] = useState("");
  const { mutate: createEvent, isPending: isCreating } = useCreateGeneralEvent();

  function handleCreateEvent(e) {
    e.preventDefault();
    if (!eventName.trim()) {
      toast.error("Event name cannot be empty.");
      return;
    }
    createEvent(eventName, {
      onSuccess: () => {
        toast.success("Event created successfully!");
        setEventName("");
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <form onSubmit={handleCreateEvent} className={`${cardStyle} space-y-4`}>
        <h3 className="font-bold text-white text-lg flex items-center gap-2"><MdAddCircle className="text-indigo-400"/>New Session</h3>
      <div>
        <label htmlFor="eventName" className="block text-sm font-medium text-gray-300">
          Event Name
        </label>
        <input
          id="eventName"
          type="text"
          placeholder="Weekly Tech Meetup"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-transparent bg-white/10 py-2 px-3 text-white shadow-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <Button variant="primary" type="submit" disabled={isCreating} width="w-full">
        {isCreating ? <Loader /> : "Start Session"}
      </Button>
    </form>
  );
}

function ActiveSessions() {
  const { data: activeEvents, isLoading } = useGetGeneralEvents();
  const { mutate: toggleStatus, isPending: isToggling } = useToggleEventStatus();
  const [sessionToEnd, setSessionToEnd] = useState(null);

  function handleToggle(event) {
    toggleStatus({ eventId: event.id, isActive: false }, {
        onSuccess: () => {
            toast.success(`Session "${event.event_name}" has been ended.`);
            setSessionToEnd(null);
        },
        onError: (error) => toast.error(error.message),
    });
  }

  if(isLoading) {
      return <div className={`${cardStyle} h-full min-h-[200px] animate-pulse`}></div>
  }

  return (
    <div className={`${cardStyle} h-full`}>
        <h3 className="font-bold text-white text-lg mb-4">Active Sessions</h3>
        {activeEvents && activeEvents.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {activeEvents.map(event => (
                    <div key={event.id} className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                        <p className="text-white font-medium text-sm truncate">{event.event_name}</p>
                        <Button variant="danger" width="w-fit" padding="px-3 py-1.5" onClick={() => setSessionToEnd(event)}>
                            End
                        </Button>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-400 text-sm">No active sessions.</p>
            </div>
        )}

        <Modal open={!!sessionToEnd} onClose={() => setSessionToEnd(null)}>
            <div className=" w-full p-2 text-center">
                <h2 className="text-xl font-bold text-white mb-2">End Session?</h2>
                <p className="text-gray-300 mb-6">Are you sure you want to end the <br/><strong className="text-indigo-400">{sessionToEnd?.event_name}</strong> session?</p>
                <div className="flex justify-center gap-4">
                    <Button variant="secondary" width="w-full" onClick={() => setSessionToEnd(null)} disabled={isToggling}>Cancel</Button>
                    <Button variant="danger" width="w-full" onClick={() => handleToggle(sessionToEnd)} disabled={isToggling}>
                        {isToggling ? <Loader /> : "Confirm End"}
                    </Button>
                </div>
            </div>
        </Modal>
    </div>
  )
}

export default function GeneralDashboardPage() {
  return (
    <div className="p-4 sm:p-6 space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">General Dashboard</h1>
        <p className="text-gray-400 mt-1">Create, monitor, and manage your attendance sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard href="/general/general-events" icon={<MdEvent className="text-indigo-400 text-2xl" />} title="Active Events" subtitle="View & share QR codes" live />
        <StatCard href="/general/records" icon={<MdHistory className="text-indigo-400 text-2xl" />} title="History" subtitle="Browse & export records" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreateEventForm />
          <ActiveSessions />
      </div>
    </div>
  );
}
