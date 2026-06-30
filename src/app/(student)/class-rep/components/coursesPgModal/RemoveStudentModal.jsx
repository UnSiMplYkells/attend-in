"use client";

export default function RemoveStudentModal({
  isOpen,
  onClose,
  studentName,
  courseCode,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Remove Student
        </h3>

        <p className="text-gray-300 mb-8">
          Are you sure you want to remove{" "}
          <span className="font-bold text-white">{studentName}</span> from{" "}
          <span className="font-bold text-white">{courseCode}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors border border-transparent cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-medium bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
          >
            Yes, remove
          </button>
        </div>
      </div>
    </div>
  );
}
