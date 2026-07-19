"use client";

import { useState, useEffect } from "react";
import {
  createClassRepInvite,
  getActiveInvites,
  verifyStudentForInvite,
} from "@/lib/server/auth";
import toast from "react-hot-toast";
import { FiKey, FiCopy, FiCheck } from "react-icons/fi";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import Modal from "@/app/components/ui/Modal"; 
import { useQuery, useQueryClient } from "@tanstack/react-query";

function InviteGenerator() {
  const queryClient = useQueryClient();

  const [generatedInvite, setGeneratedInvite] = useState(null);
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // New states for the confirmation modal
  const [studentDetails, setStudentDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matricToInvite, setMatricToInvite] = useState("");

  // Step 1: Verify the student
  async function handleVerify(formData) {
    setIsPending(true);
    const matricNo = formData.get("matricNo");

    if (!matricNo || matricNo.length !== 11) {
      setState({ message: "Please enter a valid 11-character matric number." });
      setIsPending(false);
      return;
    }

    try {
      const student = await verifyStudentForInvite(matricNo);
      setStudentDetails(student);
      setMatricToInvite(matricNo);
      setIsModalOpen(true);
      setState({ message: null });
    } catch (error) {
      setState({ message: error.message });
    }
    setIsPending(false);
  }

  // Step 2: Confirm and create the invite
  async function handleConfirmInvite() {
    setIsPending(true);
    try {
      const result = await createClassRepInvite(matricToInvite);
      setGeneratedInvite(result);
      toast.success("Invite created successfully!");
      setIsModalOpen(false);

      queryClient.invalidateQueries({ queryKey: ["activeInvites"] });
    } catch (error) {
      toast.error(error.message);
    }
    setIsPending(false);
  }

  function handleCopy() {
    if (!generatedInvite?.otp) return;
    navigator.clipboard.writeText(generatedInvite.otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <form action={handleVerify} className="space-y-4">
          <div>
            <label
              htmlFor="matricNo"
              className="block text-sm font-medium text-white"
            >
              Matric Number
            </label>
            <input
              id="matricNo"
              name="matricNo"
              type="text"
              maxLength="11"
              placeholder="e.g., 2024/123456"
              required
              className="mt-1 block w-full rounded-md border-transparent bg-white/10 py-2 px-3 text-white shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <Button
            variant="primary"
            type="submit"
            disabled={isPending}
            width="w-full"
          >
            {isPending ? <Loader /> : "Generate Invite"}
          </Button>
          {state?.message && (
            <p className="text-sm text-red-400 mt-2">{state.message}</p>
          )}
        </form>

        {generatedInvite && (
          <div className="mt-6 bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 text-center animate-in fade-in duration-300">
            <p className="text-sm text-indigo-300">OTP Code:</p>
            <div className="flex items-center justify-center gap-3 my-2">
              <p className="text-3xl font-bold tracking-widest text-white">
                {generatedInvite.otp}
              </p>
              <button
                onClick={handleCopy}
                className="p-2 rounded-md hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <FiCheck className="text-green-400" />
                ) : (
                  <FiCopy className="text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Expires:{" "}
              {new Date(generatedInvite.expiresAt).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4 w-full">
          <h2 className="text-xl font-bold text-white mb-4">
            Confirm Class Rep
          </h2>
          {studentDetails && (
            <div className="bg-white/10 rounded-lg p-4 mb-6 space-y-2">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Name:</span>{" "}
                {studentDetails.full_name}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Matric No:</span>{" "}
                {studentDetails.matric_number}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Department:</span>{" "}
                {studentDetails.department}
              </p>
            </div>
          )}
          <p className="text-sm text-gray-400 mb-6">
            Are you sure you want to generate an invite for this student?
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              width="w-fit"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              width="w-fit"
              onClick={handleConfirmInvite}
              disabled={isPending}
            >
              {isPending ? <Loader /> : "Proceed"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function InviteList() {
  const { data: invites = [], isLoading } = useQuery({
    queryKey: ["activeInvites"],
    queryFn: () => getActiveInvites(),
  });

  function getStatus(invite) {
    if (invite.used)
      return (
        <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full text-xs">
          Used
        </span>
      );
    if (new Date(invite.expires_at) < new Date())
      return (
        <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full text-xs">
          Expired
        </span>
      );
    return (
      <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full text-xs">
        Active
      </span>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-white/10 rounded-xl animate-pulse mt-8"></div>
    );
  }

  return (
    <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md border border-white/10 rounded-xl mt-8 overflow-hidden">
      <table className="w-full text-left">
        <thead className="border-b border-white/10">
          <tr>
            <th className="p-4 text-sm font-semibold text-white">
              Matric Number
            </th>
            <th className="p-4 text-sm font-semibold text-white">OTP Code</th>
            <th className="p-4 text-sm font-semibold text-white">Expires At</th>
            <th className="p-4 text-sm font-semibold text-white">Status</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite) => (
            <tr key={invite.id} className="border-b border-white/5">
              <td className="p-4 text-white font-mono text-sm">
                {invite.matric_number}
              </td>
              <td className="p-4 text-gray-300 font-mono tracking-widest">
                {invite.otp_code}
              </td>
              <td className="p-4 text-gray-400 text-sm">
                {new Date(invite.expires_at).toLocaleString()}
              </td>
              <td className="p-4">{getStatus(invite)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {invites.length === 0 && !isLoading && (
        <p className="text-center text-gray-400 p-8">No active invites.</p>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-4 ring-1 ring-indigo-500/30">
          <FiKey className="text-3xl text-indigo-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Class Rep Invitations</h1>
        <p className="text-gray-400 text-sm sm:text-base">Generate and manage OTP codes for new class representatives.</p>
      </div>
      <InviteGenerator />
      <InviteList />
    </div>
  );
}
