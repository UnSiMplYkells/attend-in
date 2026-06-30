"use client";
import { useState, useEffect } from "react";
import { useAddClassSlot } from "@/hooks/query/useTimetable";
import { useGetCourses } from "@/hooks/query/useRoster";
import { useUser } from "@/hooks/query/useUser";
import { toast } from "react-hot-toast";
import ModalPortal from "@/app/components/ModalPortal";
import Button from "@/app/components/ui/Button";

const DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
];
const TIMES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

export default function AddClassModal({ onClose, initialData }) {
  const { data: user } = useUser();
  const { data: roster } = useGetCourses(); // Using the hook from your code
  const { mutateAsync: addClass } = useAddClassSlot();

  const [selectedDay, setSelectedDay] = useState(initialData?.day || 1);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]);

  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData?.hour) {
      setSelectedTimes([initialData.hour]);
    }
  }, [initialData]);

  const toggleTime = (hour) => {
    setSelectedTimes((prev) =>
      prev.includes(hour)
        ? prev.filter((t) => t !== hour)
        : [...prev, hour].sort((a, b) => a - b),
    );
  };

  const formatTime = (num) => `${num.toString().padStart(2, "0")}:00`;

  const buildPayloads = () => {
    const blocks = [];
    if (selectedTimes.length === 0) return blocks;

    let currentBlock = { start: selectedTimes[0], end: selectedTimes[0] + 1 };

    for (let i = 1; i < selectedTimes.length; i++) {
      if (selectedTimes[i] === currentBlock.end) {
        currentBlock.end = selectedTimes[i] + 1;
      } else {
        blocks.push(currentBlock);
        currentBlock = { start: selectedTimes[i], end: selectedTimes[i] + 1 };
      }
    }
    blocks.push(currentBlock);

    return blocks.map((b) => ({
      day_of_week: parseInt(selectedDay),
      class_id: Number(selectedClass),
      start_time: `${formatTime(b.start)}:00`,
      end_time: `${formatTime(b.end)}:00`,
    }));
  };

  const handleNext = () => {
    if (!selectedClass || selectedTimes.length === 0) {
      toast.error("Please select a class and at least one time slot.");
      return;
    }
    setIsConfirming(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payloads = buildPayloads();

    try {
      await addClass(payloads);
      toast.success("Class added to timetable!");
      onClose();
    } catch (error) {
      toast.error(error.message);
      setIsConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Looking up the class via class_id on the roster object, NOT classes.id
  const activeCourseName = roster?.find(
    (r) => r.class_id === Number(selectedClass),
  )?.classes?.course_code;

  const timeStrings = buildPayloads().map(
    (p) => `${p.start_time.slice(0, 5)} - ${p.end_time.slice(0, 5)}`,
  );

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>

          {!isConfirming ? (
            <>
              <h2 className="text-xl font-bold text-gray-200 mb-6">
                Add to Timetable
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Select Day
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-md py-2.5 px-3 text-sm text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-inner"
                  >
                    {DAYS.map((day) => (
                      <option key={day.id} value={day.id}>
                        {day.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Select Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-md py-2.5 px-3 text-sm text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-inner"
                  >
                    <option value="">-- Choose Course --</option>
                    {roster?.map((r) => (
                      <option key={r.class_id} value={r.class_id}>
                        {r.classes.course_code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 no-scrollbar">
                    {TIMES.map((hour) => (
                      <label
                        key={hour}
                        className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          selectedTimes.includes(hour)
                            ? "bg-blue-900/40 border-blue-500"
                            : "bg-[#0a0a0a] border-gray-700 hover:border-gray-500"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTimes.includes(hour)}
                          onChange={() => toggleTime(hour)}
                          className="accent-blue-600 w-4 h-4"
                        />
                        <span className="text-sm text-gray-300">
                          {formatTime(hour)} - {formatTime(hour + 1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <Button
                  variant="secondary"
                  width="w-auto"
                  padding="px-4 py-2"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  width="w-auto"
                  padding="px-4 py-2"
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-200 mb-4">
                Confirm Addition
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Are you sure you want to add{" "}
                <strong className="text-blue-400">{activeCourseName}</strong> on{" "}
                <strong className="text-gray-100">
                  {DAYS.find((d) => d.id == selectedDay)?.name}
                </strong>{" "}
                for the following timeslots?
                <br />
                <br />
                <span className="bg-gray-800 px-2 py-1 rounded text-sm text-gray-200">
                  {timeStrings.join(", ")}
                </span>
              </p>

              <div className="flex justify-end space-x-3 mt-8">
                <Button
                  variant="secondary"
                  width="w-auto"
                  padding="px-4 py-2"
                  disabled={loading}
                  onClick={() => setIsConfirming(false)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  width="w-auto"
                  padding="px-4 py-2"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Checking..." : "Confirm & Add"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
