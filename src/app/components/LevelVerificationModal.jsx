"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/query/useUser";
import { getGlobalSession } from "@/lib/server/app_settings";
import { updateStudentAdmissionYear } from "@/lib/server/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "./ui/Button";
import Loader from "./ui/Loader";
import ModalPortal from "./ModalPortal";

function LevelVerificationModal() {
  const queryClient = useQueryClient();
  const { user, isUserLoading } = useUser();
  const [showModal, setShowModal] = useState(false);

  const [calculatedLevel, setCalculatedLevel] = useState(100);
  const [selectedLevel, setSelectedLevel] = useState(100);
  const [globalSession, setGlobalSession] = useState(null);
  const [showManualSelect, setShowManualSelect] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      const session = await getGlobalSession();
      setGlobalSession(session);

      // Automatically calculate level based on matric number
      if (user?.profileII?.matric_number && session) {
        const matricParts = user.profileII.matric_number.split("/");
        if (matricParts.length === 2) {
          const admissionYear = parseInt(matricParts[0], 10);
          const currentBaseYear = parseInt(session.substring(0, 4), 10);

          if (!isNaN(admissionYear) && !isNaN(currentBaseYear)) {
            let calcLevel = (currentBaseYear - admissionYear) * 100 + 100;
            // Clamp level cleanly between 100 and 600
            calcLevel = Math.max(
              100,
              Math.min(600, Math.floor(calcLevel / 100) * 100),
            );
            setCalculatedLevel(calcLevel);
            setSelectedLevel(calcLevel);
          }
        }
      }
    }

    if (
      user &&
      user.profileII?.user_type === "student" &&
      user.profileII?.admission_session_year === null
    ) {
      setShowModal(true);
      fetchSession();
    }
  }, [user]);

  // Lock scrolling when the modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const { mutate: updateAdmissionYear, isPending } = useMutation({
    mutationFn: (admissionYear) => updateStudentAdmissionYear(admissionYear),
    onSuccess: () => {
      toast.success("Your level has been set successfully!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["studentProfileStats"] });
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to update your level. Please try again.",
      );
    },
  });

  function handleConfirm() {
    if (!globalSession) {
      toast.error(
        "Could not determine the current academic session. Please refresh and try again.",
      );
      return;
    }
    const currentBaseYear = parseInt(globalSession.substring(0, 4), 10);
    const levelToSave = showManualSelect ? selectedLevel : calculatedLevel;
    const admissionYearToSave = currentBaseYear - (levelToSave - 100) / 100;

    updateAdmissionYear(admissionYearToSave);
  }

  if (isUserLoading || !showModal) {
    return null;
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div
          className="bg-[#0f172a]/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-white animate-in fade-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-2">Setup your account</h2>
          <p className="text-slate-400 mb-6 text-sm">
            This is a one-time action and cannot be changed later. Let's get
            your current level sorted.
          </p>

          {!showManualSelect ? (
            <div className="mb-6 flex flex-col items-center bg-white/5 border border-white/5 p-6 rounded-2xl">
              <span className="text-sm text-gray-400 mb-1">
                Confirm your academic level:
              </span>
              <div className="text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
                {calculatedLevel}L
              </div>
              <button
                onClick={() => setShowManualSelect(true)}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors underline underline-offset-4 cursor-pointer"
              >
                Not your academic level? Select manually
              </button>
            </div>
          ) : (
            <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
              <label
                htmlFor="level"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Select Level
              </label>
              <div className="relative">
                <select
                  id="level"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full appearance-none bg-white/5 border border-white/10 hover:border-white/20 rounded-xl p-3.5 pr-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
                >
                  <option value={100} className="bg-slate-900">
                    100L
                  </option>
                  <option value={200} className="bg-slate-900">
                    200L
                  </option>
                  <option value={300} className="bg-slate-900">
                    300L
                  </option>
                  <option value={400} className="bg-slate-900">
                    400L
                  </option>
                  <option value={500} className="bg-slate-900">
                    500L
                  </option>
                  <option value={600} className="bg-slate-900">
                    600L
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-200/90 p-4 rounded-xl flex items-start gap-3 mb-8 shadow-inner">
            <span className="text-xl mt-0.5">⚠️</span>
            <p className="text-sm leading-relaxed">
              If you make a mistake here, it's all on you. Get your level right
              to prevent issues.Find any way to reach out to the admin
            </p>
          </div>

          <Button
            variant="primary"
            width="w-full"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <Loader />
            ) : (
              `Confirm ${showManualSelect ? selectedLevel : calculatedLevel}L`
            )}
          </Button>
        </div>
      </div>
    </ModalPortal>
  );
}

export default LevelVerificationModal;
