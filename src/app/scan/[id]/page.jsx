
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { MdCheckCircle, MdError, MdOutlineModeEdit } from "react-icons/md";

import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import { useRegisterGeneralAttendee } from "@/hooks/query/useGeneralAttendance";
import { useGetEventDetails } from "@/hooks/query/useGeneralAttendance";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  ALREADY_CHECKED_IN: "already_checked_in",
};

function NameForm({ eventId, deviceId, setStatus }) {
  const [name, setName] = useState("");
  const { mutate: register, isPending } = useRegisterGeneralAttendee();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    register({ eventId, name, deviceId }, {
      onSuccess: () => {
        setStatus(STATUS.SUCCESS);
        toast.success("Successfully checked in!");
      },
      onError: (error) => {
        if (error.message.includes("already checked in")) {
          setStatus(STATUS.ALREADY_CHECKED_IN);
        } else {
          setStatus(STATUS.ERROR);
          toast.error(error.message);
        }
      }
    });
  }

  return (
    <div className="w-full max-w-sm animate-in fade-in duration-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 space-y-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-white"
          >
            Enter Your Name to Check In
          </label>
          <div className="mt-2">
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full rounded-md border border-transparent bg-white/5 py-2.5 px-4 text-white shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none sm:text-md sm:leading-6"
            />
          </div>
        </div>
        <Button variant="primary" type="submit" disabled={isPending}>
          {isPending ? <Loader /> : "Confirm Attendance"}
        </Button>
      </form>
    </div>
  );
}

function StatusCard({ status, message, icon }) {
  return (
    <div className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
      {icon}
      <h2 className="text-2xl font-bold text-white mt-4">{status}</h2>
      <p className="text-gray-400 mt-1">{message}</p>
    </div>
  );
}


export default function GeneralScanPage() {
  const { id: eventId } = useParams();

  function formatEventId(id) {
    if (!id) return '';
    // Take first 8 characters and split into two groups of 4
    const firstPart = id.substring(0, 4);
    const secondPart = id.substring(4, 8);
    // Generate a simple numeric suffix from the last 2 characters (hex to decimal)
    const numericSuffix = parseInt(id.substring(id.length - 2), 16) % 100;
    // Format as att:xxxx-xxxx-xx (e.g., att:02fa-8d00-21)
    return `att:${firstPart}-${secondPart}-${String(numericSuffix).padStart(2, '0')}`;
  }


  const [status, setStatus] = useState(STATUS.IDLE);
  const [deviceId, setDeviceId] = useState(null);

  const { data: eventDetails, isLoading} = useGetEventDetails(eventId);

  useEffect(() => {
    let storedDeviceId = localStorage.getItem("attendin_general_device_id");
    if (!storedDeviceId) {
      storedDeviceId = crypto.randomUUID();
      localStorage.setItem("attendin_general_device_id", storedDeviceId);
    }
    setDeviceId(storedDeviceId);
  }, []);

  if (!deviceId) {
    // Render a skeleton loader while device ID is being set up
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-sm h-72 bg-white/5 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-4 ring-1 ring-indigo-500/30">
          <MdOutlineModeEdit className="text-4xl text-indigo-400" />
        </div>
        {isLoading ? (
          <div className="h-7 w-56 bg-white/10 animate-pulse rounded-md mx-auto mt-3"></div>
        ) : (
          <h1 className="text-3xl font-bold uppercase">
            {eventDetails?.event_name || "Event Not Found"}
          </h1>
        )}
        <p className="text-gray-400">Event ID: {formatEventId(eventId)}</p>
      </div>

      {status === STATUS.IDLE && (
        <NameForm eventId={eventId} deviceId={deviceId} setStatus={setStatus} />
      )}

      {status === STATUS.SUCCESS && (
        <StatusCard
          status="Success!"
          message="Your attendance has been recorded."
          icon={<MdCheckCircle className="text-7xl text-green-500" />}
        />
      )}
      {status === STATUS.ALREADY_CHECKED_IN && (
        <StatusCard
          status="Already Checked In"
          message="This device has already been registered for the event."
          icon={<MdCheckCircle className="text-7xl text-indigo-400" />}
        />
      )}
      {status === STATUS.ERROR && (
        <StatusCard
          status="Error"
          message="Something went wrong. Please try again."
          icon={<MdError className="text-7xl text-red-500" />}
        />
      )}
    </main>
  );
}
