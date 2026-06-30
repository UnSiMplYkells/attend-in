"use client";
import { useState } from "react";
import { useRemoveClassSlot } from "@/hooks/query/useTimetable";
import { toast } from "react-hot-toast";
import ModalPortal from "@/app/components/ModalPortal";
import Button from "@/app/components/ui/Button";

export default function ConfirmRemoveModal({ onClose, data }) {
  const { mutateAsync: removeSlot } = useRemoveClassSlot();
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeSlot(data.id);
      toast.success(`${data.classes.course_code} removed from timetable.`);
      onClose();
    } catch (error) {
      toast.error("Failed to remove class.");
    } finally {
      setLoading(false);
    }
  };

  const start = data.start_time.slice(0, 5);
  const end = data.end_time.slice(0, 5);

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

          <h2 className="text-lg font-bold text-gray-200 mb-4">Remove Class</h2>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            Are you sure you want to remove{" "}
            <strong className="text-gray-100">
              {data?.classes?.course_code}
            </strong>{" "}
            from the{" "}
            <strong className="text-gray-100">
              {start} - {end}
            </strong>{" "}
            time slot? This action only removes it from the schedule.
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
              onClick={handleRemove}
            >
              {loading ? "Removing..." : "Remove"}
            </Button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
