"use client";
import { useState } from "react";
import { checkUserExists } from "@/lib/server/students";
import { FiSearch, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useAddStudentToCourse } from "@/hooks/query/useRoster";
import toast from "react-hot-toast";

export default function AddStudentModal({
  isOpen,
  onClose,
  courseCode,
  courseId,
}) {
  const [matricInput, setMatricInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedStudent, setVerifiedStudent] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const addMutation = useAddStudentToCourse();

  if (!isOpen) return null;

  function handleClose(){
    setMatricInput("");
    setVerifiedStudent(null);
    setErrorMsg("");
    onClose();
  };

  async function handleVerify(){
    if (!matricInput.trim()) return;
    setIsVerifying(true);
    setErrorMsg("");
    setVerifiedStudent(null);

    try {
      const student = await checkUserExists(matricInput.trim());
      if (student) {
        setVerifiedStudent(student);
      } else {
        setErrorMsg("No student found with this matric number.");
      }
    } catch (err) {
      setErrorMsg("Error verifying student.");
    } finally {
      setIsVerifying(false);
    }
  };

  function handleConfirmAdd(){
    if (!verifiedStudent) return;

    addMutation.mutate(
      { courseId, studentId: verifiedStudent.id },
      {
        onSuccess: () => {
          handleClose();
          toast.success("student added successfully! ")
        },
        onError: (error) => {
          setErrorMsg(error.message || "Failed to add student.");
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={handleClose}
    >
      <div
        className="bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-white mb-6">
          Add Student to {courseCode}
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Enter Matric Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={matricInput}
              maxLength={11}
              onChange={(e) => setMatricInput(e.target.value)}
              disabled={verifiedStudent || isVerifying || addMutation.isPending}
              className="flex-1 rounded-md bg-black/50 border border-white/10 py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              placeholder="e.g. 2024/123456"
            />
            {!verifiedStudent && (
              <button
                onClick={handleVerify}
                disabled={!matricInput.trim() || isVerifying}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  "Checking..."
                ) : (
                  <>
                    <FiSearch /> Verify
                  </>
                )}
              </button>
            )}
          </div>
          {errorMsg && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <FiAlertCircle /> {errorMsg}
            </p>
          )}
        </div>

        {verifiedStudent && (
          <div className="mb-6 p-4 rounded-lg border border-green-500/20 bg-green-500/5">
            <p className="text-sm text-gray-400 mb-1">Student Found:</p>
            <div className="flex items-center gap-2 text-white font-medium">
              <FiCheckCircle className="text-green-400" />
              {verifiedStudent.full_name}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={addMutation.isPending}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {verifiedStudent && (
            <button
              onClick={handleConfirmAdd}
              disabled={addMutation.isPending}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {addMutation.isPending ? "Adding..." : "Confirm & Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}