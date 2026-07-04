"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { motion } from "framer-motion";
import { FiLogOut} from "react-icons/fi";
import { HiShieldExclamation } from "react-icons/hi";
import { LuCircleUserRound } from "react-icons/lu";
import { PiUserCircleGearLight } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  useStudentProfileStats,
  useDropCourse,
} from "@/hooks/query/useProfile";
import Button from "@/app/components/ui/Button";
import Modal from "@/app/components/ui/Modal";
import GlobalStats from "../components/profile/GlobalStats";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";
import EnrolledCourses from "../components/profile/EnrolledCourses";
import Loader from "@/app/components/ui/Loader";
import toast from "react-hot-toast";

const getDeviceInfo = () => {
  if (typeof window === "undefined") return "Checking Device...";

  const ua = navigator.userAgent;

  let os = "Unknown OS";
  let browser = "Unknown Browser";

  // OS detection
  if (/android/i.test(ua)) os = "Android";
  else if (/iPad|iPhone|iPod/.test(ua)) os = "iOS";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  // Browser detection (order matters!)
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios|crmo/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";

  return `${os} - ${browser}`;
};

export default function ProfilePage() {
  const { data, isLoading, error } = useStudentProfileStats();
  const { mutateAsync: removeCourse, isPending: isDropping } = useDropCourse();
  const router = useRouter();

  const [deviceInfo, setDeviceInfo] = useState("Checking Device...");
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState({ id: null, code: "" });
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    setDeviceInfo(getDeviceInfo());
  }, []);

  if (isLoading) return <ProfileSkeleton />;
  if (error)
    return <div className="text-red-500 p-8">Failed to load profile.</div>;

  const {
    profile,
    globalPercentage,
    totalHours,
    mostAttended,
    mostMissed,
    courses,
  } = data;

  async function handleDropConfirm() {
    if (!courseToDelete.id) return;

    try {
      await toast.promise(removeCourse(courseToDelete.id), {
        loading: `Dropping ${courseToDelete.code}...`,
        success: `${courseToDelete.code} dropped successfully`,
        error: `Failed to drop ${courseToDelete.code}`,
      });

      setDeleteModalOpen(false);
      setCourseToDelete({ id: null, code: "" });
    } catch (err) {}
  }

  function triggerDeleteModal(classId, courseCode){
    setCourseToDelete({ id: classId, code: courseCode });
    setDeleteModalOpen(true);
  }

  async function handleSignOut() {
    const supabase = createClient();
    setIsSigningOut(true);

    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("Could not log out. Please try again.");
      setIsSigningOut(false);
    }
  }

  async function handlePasswordChange() {
    const supabase = createClient();
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Password updated successfully");
      setPasswordModalOpen(false);
      setNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  return (
    <div className="min-h-screen w-full text-slate-200 pb-20 p-4 md:p-8 overflow-x-hidden no-scrollbar">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
      >
        <div className="flex items-center gap-3">
          <PiUserCircleGearLight className="w-10 h-10 text-slate-400 shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {profile?.full_name}
            </h1>
            <p className="text-slate-400 text-sm">
              {profile?.students_registry?.department} • Level (will come later)
            </p>
          </div>
        </div>

        <div className="flex gap-3 self-end">
          <Button
            variant="danger"
            width="w-fit"
            padding="px-3 py-2"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <Loader />
            ) : (
              <>
                <FiLogOut className="w-4 h-4 mr-2" /> Sign Out
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <GlobalStats
        globalPercentage={globalPercentage}
        mostAttended={mostAttended}
        mostMissed={mostMissed}
        totalHours={totalHours}
        deviceInfo={deviceInfo}
        onDeviceChangeRequest={() => setDeviceModalOpen(true)}
      />

      <EnrolledCourses courses={courses} onDeleteClick={triggerDeleteModal} />

      <Button
        variant="danger"
        width="w-full"
        margin="mt-10"
        onClick={() => setPasswordModalOpen(true)}
      >
        Change Password?
      </Button>

      <Modal open={deviceModalOpen} onClose={() => setDeviceModalOpen(false)}>
        <div className="p-2">
          <div className="flex items-center gap-3 mb-4">
            <HiShieldExclamation className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Device Reset</h2>
          </div>
          <p className="text-slate-300 text-sm mb-6">
            To prevent attendance fraud, your account is bound to your primary
            device. If you bought a new phone, you need to request a reset from
            your Course Rep.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              width="w-fit"
              onClick={() => setDeviceModalOpen(false)}
            >
              Cancel
            </Button>
            <a
              href={`https://wa.me/2349022537096?text=${encodeURIComponent(
                `Hi Rep, I need a device reset on Attend-in.%0A%0AName: ${profile?.full_name || "Student"}%0AMatric No: ${profile?.matric_number || "N/A"}`,
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="primary" width="w-fit">
                Contact Class Rep
              </Button>
            </a>
          </div>
        </div>
      </Modal>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="p-2 w-full">
          <div className="m-auto flex items-center justify-center p-2.5 size-12 bg-red-600/30 rounded-full">
            <FaExclamationTriangle className="relative bottom-0.5 text-red-600 text-4xl " />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Drop {courseToDelete.code}?
          </h2>
          <p className="text-slate-300 text-sm mb-6">
            Are you sure you want to drop <strong>{courseToDelete.code}</strong>
            ? <br /> You will no longer be able to scan attendance for it.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              width="w-fit"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              width="w-fit"
              onClick={handleDropConfirm}
              disabled={isDropping}
            >
              {isDropping ? <Loader /> : `Yes, Drop ${courseToDelete.code}`}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      >
        <div className="p-2 w-full">
          <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
          <input
            type="password"
            placeholder="New password (min. 6 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-slate-400 mb-4 focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondaey"
              width="w-fit"
              onClick={() => setPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              width="w-fit"
              onClick={handlePasswordChange}
              disabled={isUpdatingPassword || newPassword.length < 8}
            >
              {isUpdatingPassword ? <Loader /> : "Update Password"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
