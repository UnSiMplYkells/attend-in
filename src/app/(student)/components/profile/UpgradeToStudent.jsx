"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";
import Modal from "@/app/components/ui/Modal";
import Loader from "@/app/components/ui/Loader";
import toast from "react-hot-toast";
import { upgradeUserToStudent } from "@/lib/server/profile";
import { FaGraduationCap } from "react-icons/fa";
import { createDeviceFingerprint } from "@/lib/deviceFingerprint";
import { useRouter } from "next/navigation";


export default function UpgradeToStudent({ userType }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [matricNumber, setMatricNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (userType === "student") return null;

  async function handleUpgrade(e) {
    e.preventDefault();

    setIsLoading(true);

    try {

      const { deviceId } = await createDeviceFingerprint();
      
      await upgradeUserToStudent(matricNumber, deviceId);

      toast.success("Successfully upgraded to Student account!");

      setOpen(false);

      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to upgrade account");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="bg-white/5 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaGraduationCap className="text-indigo-400" />
            Are you a University Student?
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Link your university profile to access classes, attendance scanning, and schedules.
          </p>
        </div>
        <Button variant="primary" width="w-fit" onClick={() => setOpen(true)}>
          Upgrade Profile
        </Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleUpgrade} className="p-2 w-full">
          <h2 className="text-xl font-bold text-white mb-4">Link University Profile</h2>
          
          <label className="block text-sm text-slate-300 mb-1">Matric Number</label>
          <input
            type="text"
            required
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-slate-400 mb-4 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 2024/123456"
          />

          <div className="flex justify-end gap-3">
            <Button variant="secondary" width="w-fit" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" width="w-fit" type="submit" disabled={isLoading}>
              {isLoading ? <Loader /> : "Link Profile"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}