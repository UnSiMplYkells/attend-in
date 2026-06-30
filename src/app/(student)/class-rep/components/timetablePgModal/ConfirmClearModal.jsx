"use client";
import { useState } from "react";
import { useClearTimetable } from "@/hooks/query/useTimetable";
import { toast } from "react-hot-toast";
import ModalPortal from "@/app/components/ModalPortal";
import Button from "@/app/components/ui/Button";

export default function ConfirmClearModal({ onClose, timetable }) {
  const { mutateAsync: clearTimetable } = useClearTimetable();
  const [loading, setLoading] = useState(false);

  const handleClear = async () => {
    setLoading(true);
    try {
      const activeIds = timetable.map((slot) => slot.id);

      // Pass the IDs to the server action
      await clearTimetable(activeIds);

      toast.success("Timetable has been cleared.");
      onClose();
    } catch (error) {
      toast.error("Failed to clear timetable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold"
          >
            ✕
          </button>

          <div className="w-12 h-12 rounded-full bg-red-950 flex items-center justify-center mb-4 border border-red-900">
            <span className="text-red-500 text-xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-200 mb-2">
            Clear Timetable?
          </h2>
          <p className="text-sm text-gray-300 mb-6">
            This will wipe the visual schedule for the entire class. Historical
            attendance data will not be deleted.
          </p>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              width="w-auto"
              padding="px-4 py-2"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              width="w-auto"
              padding="px-4 py-2"
              disabled={loading}
              onClick={handleClear}
            >
              {loading ? "Clearing..." : "Yes, Clear All"}
            </Button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
