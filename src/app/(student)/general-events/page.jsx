"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { MdEvent, MdAddCircle, MdClose, MdArrowForward, } from "react-icons/md";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import Modal from "@/app/components/ui/Modal";
import QrGenerator from "@/app/components/QrGenerator";
import {
  useCreateGeneralEvent,
  useToggleEventStatus,
  useGetGeneralEvents,
  useGetGeneralRecords,
} from "@/hooks/query/useGeneralAttendance";
import { IoClose } from "react-icons/io5";

const cardStyle =
  "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:border-indigo-500/50";

function CreateEventForm({ maxEventsReached, setSelectedQrEventId }) {
  const [eventName, setEventName] = useState("");
  const { mutate: createEvent, isPending: isCreating } =
    useCreateGeneralEvent();

  function handleCreateEvent(e) {
    e.preventDefault();
    if (maxEventsReached) {
      toast.error("You can only have 3 active events at a time.");
      return;
    }
    createEvent(eventName, {
      onSuccess: (newEventId) => {
        toast.success("Event created successfully!");
        setEventName("");
        setSelectedQrEventId(newEventId);
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <form onSubmit={handleCreateEvent} className={`${cardStyle} space-y-4`}>
      <h3 className="font-bold text-white text-lg flex items-center gap-2">
        <MdAddCircle className="text-indigo-400" />
        Create New Event
      </h3>
      {maxEventsReached ? (
        <div className="text-center bg-amber-500/10 text-amber-400 p-4 rounded-lg text-sm">
          You have reached the maximum of 3 active events.
        </div>
      ) : (
        <div>
          <label
            htmlFor="eventName"
            className="block text-sm font-medium text-gray-300"
          >
            Event Name
          </label>
          <input
            id="eventName"
            type="text"
            placeholder="e.g. Weekly Tech Meetup"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-transparent bg-white/10 py-2 px-3 text-white shadow-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      )}
      <Button
        variant="primary"
        type="submit"
        disabled={isCreating || maxEventsReached}
        width="w-full"
      >
        {isCreating ? <Loader /> : "Start Session & Get QR"}
      </Button>
    </form>
  );
}

function ActiveEventGrid({ events, setSelectedQrEventId, setSessionToEnd }) {
  if (events?.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className="space-y-4">
        <h3 className="font-bold text-white text-lg">Active QR Codes</h3>
        {events?.map((event) => (
          <div
            key={event.id}
            className={`${cardStyle} cursor-pointer`}
            onClick={() => setSelectedQrEventId(event.id)}
          >
            <p className="font-semibold text-white truncate">
              {event.event_name}
            </p>
            <p className="text-xs text-gray-400 mt-1">Click to show QR</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-white text-lg">Controls</h3>
        {events?.map((event) => (
          <div
            key={event.id}
            className={`${cardStyle} flex items-center justify-between`}
          >
            <p className="font-semibold text-white truncate">
              {event.event_name}
            </p>
            <div className="flex items-center gap-4">
              <Link href={`/general-events/record/${event.id}`}>
                <div className="size-10 bg-indigo-500/20 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 hover:bg-indigo-500/40 shrink-0">
                  <MdArrowForward className="text-indigo-400" />
                </div>
              </Link>
              <Button
                variant="danger"
                padding="py-2 px-4"
                width="w-full"
                onClick={() => setSessionToEnd(event)}
              >
                End Session
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryList({ records }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (records?.length === 0) return null;

  return (
    <div className="mt-12">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-white/5 p-4 rounded-xl text-white font-bold flex justify-between items-center"
      >
        <span>View All General Records</span>
        <MdArrowForward
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </button>
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in duration-300">
          {records?.map((rec) => (
            <Link key={rec.id} href={`/general-events/record/${rec.id}`}>
              <div
                className={`${cardStyle} p-4 cursor-pointer flex justify-between items-center`}
              >
                <p className="font-medium text-white truncate">
                  {rec.event_name}
                </p>
                {rec.is_active ? (
                  <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full ml-2 shrink-0">
                    Active
                  </span>
                ) : (
                  <span className="text-xs font-bold text-gray-400 bg-gray-500/10 px-2 py-1 rounded-full ml-2 shrink-0">
                    Completed
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GeneralEventsPage() {
  const [selectedQrEventId, setSelectedQrEventId] = useState(null);
  const [sessionToEnd, setSessionToEnd] = useState(null);
  const { data: activeEvents, isLoading: isLoadingActive } =
    useGetGeneralEvents();
  const { data: records, isLoading: isLoadingRecords } = useGetGeneralRecords();
  const { mutate: toggleStatus, isPending: isToggling } =
    useToggleEventStatus();

  const maxEventsReached = activeEvents?.length >= 3;

  useEffect(() => {
    if (selectedQrEventId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedQrEventId]);

  function handleEndSession() {
    if (!sessionToEnd) return;
    toggleStatus(
      { eventId: sessionToEnd.id, isActive: false },
      {
        onSuccess: () => {
          toast.success(`Event "${sessionToEnd.event_name}" has ended.`);
          setSessionToEnd(null);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <MdEvent className="text-indigo-500 text-3xl" />
          General Events
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1">
          Create and manage your general attendance events.
        </p>
      </div>

      <CreateEventForm
        maxEventsReached={maxEventsReached}
        setSelectedQrEventId={setSelectedQrEventId}
      />

      {isLoadingActive ? (
        <div className="w-full h-40 bg-white/10 rounded-xl animate-pulse mt-8"></div>
      ) : (
        <ActiveEventGrid
          events={activeEvents}
          setSelectedQrEventId={setSelectedQrEventId}
          setSessionToEnd={setSessionToEnd}
        />
      )}

      {isLoadingRecords ? (
        <div className="w-full h-20 bg-white/10 rounded-xl animate-pulse mt-12"></div>
      ) : (
        <HistoryList records={records} />
      )}

      {selectedQrEventId && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedQrEventId(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close QR code"
          >
            <IoClose className="text-3xl" />
          </button>

          <div className="bg-white/5 border border-white/10 p-8 rounded-xl max-w-lg w-full text-center">
            <QrGenerator
              value={`${window.location.origin}/scan/${selectedQrEventId}`}
            />
            <p className="text-gray-400 text-sm mt-6 mb-8">
              Students can scan this code to mark their attendance.
            </p>
            <Button
              variant="secondary"
              onClick={() => setSelectedQrEventId(null)}
            >
              Hide QR Code
            </Button>
          </div>
        </div>
      )}

      <Modal open={!!sessionToEnd} onClose={() => setSessionToEnd(null)}>
        <div className="w-full p-2 text-center">
          <h2 className="text-xl font-bold text-white mb-2">End Session?</h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to end the <br />
            <strong className="text-indigo-400">
              {sessionToEnd?.event_name}
            </strong>{" "}
            session?
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              width="w-full"
              onClick={() => setSessionToEnd(null)}
              disabled={isToggling}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              width="w-full"
              onClick={handleEndSession}
              disabled={isToggling}
            >
              {isToggling ? <Loader /> : "Confirm End"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
