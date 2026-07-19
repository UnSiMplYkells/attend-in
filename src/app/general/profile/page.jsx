"use client";

import { useUser } from "@/hooks/query/useUser";
import UpgradeToStudent from "@/app/(student)/components/profile/UpgradeToStudent";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import { createClient } from "@/app/utils/supabase/client";
import toast from "react-hot-toast";
import { FaGraduationCap } from "react-icons/fa";
import { useRouter } from "next/navigation";

function ProfileSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-8 animate-in fade-in duration-500">
      <div className="w-3/4 h-8 bg-white/10 rounded-lg animate-pulse mb-8" />
      <div className="space-y-4">
        <div className="w-full h-16 bg-white/10 rounded-lg animate-pulse" />
        <div className="w-full h-16 bg-white/10 rounded-lg animate-pulse" />
        <div className="w-full h-16 bg-white/10 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export default function GeneralProfilePage() {
  const router = useRouter()

  const { user, isUserLoading } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isUserLoading) {
    return <ProfileSkeleton />;
  }

    async function handleSignOut() {
      const supabase = createClient();
      setIsSigningOut(true);
  
      try {
        await supabase.auth.signOut();

        // toast.success("Logged out successfully!");
        router.push("/login");

      } catch (error) {
        toast.error("Could not log out. Please try again.");
        setIsSigningOut(false);
      }
    }

  return (
    <div className="p-4 sm:p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-4">
          <FiUser className="text-3xl text-indigo-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <p className="text-gray-400 text-sm">
              Manage your account details.
            </p>
          </div>
        </div>

        <div className="flex">
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
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-400">Full Name</label>
          <p className="text-white font-semibold">
            {user?.profileII?.full_name}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <p className="text-white font-semibold">{user?.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">User Type</label>
          <p className="text-white font-semibold capitalize">
            {user?.profileII?.user_type.replace("_", " ")}
          </p>
        </div>
      </div>

      {user?.profileII?.user_type === "student" && (
        <div className="bg-white/5 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FaGraduationCap className="text-indigo-400" />
              Linked your student account?
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Navigate to your student dashboard from here
            </p>
          </div>
          <Button
            variant="primary"
            width="w-fit"
            onClick={() => router.push("/dashboard")}
          >
            go to dashboard
          </Button>
        </div>
      )}

      <UpgradeToStudent userType={user?.profileII?.user_type} />
    </div>
  );
}
