"use client";

import { useState, useEffect } from "react";
import {
  createClassRepInvite,
  getActiveInvites,
  verifyStudentForInvite,
} from "@/lib/server/auth";
import toast from "react-hot-toast";
import { FiKey, FiCopy, FiCheck, FiSettings, FiUsers } from "react-icons/fi";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import Modal from "@/app/components/ui/Modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import GlobalSessionManager from "../components/GlobalSessionManager";

function InviteGenerator() {
  const queryClient = useQueryClient();

  const [generatedInvite, setGeneratedInvite] = useState(null);
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const [verificationResult, setVerificationResult] = useState(null);
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
      const result = await verifyStudentForInvite(matricNo);
      setVerificationResult(result);
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
      <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg">
        <form action={handleVerify} className="space-y-5">
          <div>
            <label
              htmlFor="matricNo"
              className="block text-sm font-medium text-white mb-1.5"
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
              className="block w-full rounded-lg border-transparent bg-white/10 py-2.5 px-4 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
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
            <p className="text-sm text-red-400 mt-2 bg-red-500/10 p-2 rounded-md border border-red-500/20">
              {state.message}
            </p>
          )}
        </form>

        {generatedInvite && (
          <div className="mt-6 bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-5 text-center animate-in fade-in zoom-in duration-300">
            <p className="text-sm font-medium text-indigo-300">
              OTP Code Generated
            </p>
            <div className="flex items-center justify-center gap-3 my-3">
              <p className="text-4xl font-bold tracking-widest text-white drop-shadow-sm">
                {generatedInvite.otp}
              </p>
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/15 transition-colors border border-white/10"
                title="Copy to clipboard"
              >
                {copied ? (
                  <FiCheck className="text-green-400 text-lg" />
                ) : (
                  <FiCopy className="text-gray-300 text-lg" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 bg-black/20 inline-block px-3 py-1.5 rounded-full">
              Expires:{" "}
              <span className="text-gray-200">
                {new Date(generatedInvite.expiresAt).toLocaleTimeString()}
              </span>
            </p>
          </div>
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4 w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <FiUsers className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-white">Confirm Class Rep</h2>
          </div>

          {verificationResult?.student && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-5 space-y-3">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-sm font-medium text-gray-400">Name:</span>
                <span className="text-sm text-white font-medium">
                  {verificationResult.student.full_name}
                </span>

                <span className="text-sm font-medium text-gray-400">
                  Matric No:
                </span>
                <span className="text-sm text-white font-mono">
                  {verificationResult.student.matric_number}
                </span>

                <span className="text-sm font-medium text-gray-400">Dept:</span>
                <span className="text-sm text-white">
                  {verificationResult.student.department}
                </span>
              </div>
            </div>
          )}

          {verificationResult?.existingReps?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Existing Reps ({verificationResult.student.department})
              </h3>
              <ul className="bg-black/30 border border-white/10 rounded-lg p-2 space-y-1">
                {verificationResult.existingReps.map((rep) => (
                  <li
                    key={rep.admission_session_year}
                    className="text-sm text-gray-300 flex justify-between p-2 hover:bg-white/5 rounded-md transition-colors"
                  >
                    <span>{rep.full_name}</span>
                    <span className="font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded text-xs">
                      {rep.level}L
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {verificationResult?.hasConflict ? (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6 flex gap-3 items-start">
              <div className="mt-0.5">⚠️</div>
              <div>
                <p className="text-sm font-bold mb-1">Conflict Detected</p>
                <p className="text-xs leading-relaxed opacity-90">
                  There is already a class rep for the department at this level.
                  Please confirm with the department president before
                  proceeding.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-6 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
              Are you sure you want to generate an invite for this student?
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-white/10 mt-4">
            <Button
              variant="secondary"
              width="w-fit"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            {!verificationResult?.hasConflict && (
              <Button
                variant="primary"
                width="w-fit"
                onClick={handleConfirmInvite}
                disabled={isPending}
              >
                {isPending ? <Loader /> : "Generate & Proceed"}
              </Button>
            )}
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
        <span className="text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full text-xs font-medium border border-purple-500/20">
          Used
        </span>
      );
    if (new Date(invite.expires_at) < new Date())
      return (
        <span className="text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full text-xs font-medium border border-red-500/20">
          Expired
        </span>
      );
    return (
      <span className="text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full text-xs font-medium border border-green-500/20">
        Active
      </span>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-72 bg-white/5 border border-white/10 rounded-xl animate-pulse"></div>
    );
  }

  return (
    <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Matric Number
              </th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                OTP Code
              </th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Expires At
              </th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invites.map((invite) => (
              <tr
                key={invite.id}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="p-4 text-white font-mono text-sm">
                  {invite.matric_number}
                </td>
                <td className="p-4 text-gray-300 font-mono tracking-widest font-medium">
                  {invite.otp_code}
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {new Date(invite.expires_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="p-4">{getStatus(invite)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {invites.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-white/5 p-4 rounded-full mb-4">
            <FiKey className="text-2xl text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium">No active invites found.</p>
          <p className="text-sm text-gray-500 mt-1">
            Generate a new invite to see it here.
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Manage representatives, view active codes, and configure global system
          settings.
        </p>
      </header>

      <section>
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-lg ring-1 ring-indigo-500/30">
            <FiKey className="text-xl text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Class Rep Invitations
            </h2>
            <p className="text-sm text-gray-400">
              Generate and track OTP codes for student representatives.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 sticky top-6">
            <InviteGenerator />
          </div>
          <div className="lg:col-span-8">
            <InviteList />
          </div>
        </div>
      </section>

      <section className="pt-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg ring-1 ring-blue-500/30">
            <FiSettings className="text-xl text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Global Settings
            </h2>
            <p className="text-sm text-gray-400">
              Manage application-wide settings and administrative controls.
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg">
          <GlobalSessionManager />
        </div>
      </section>
    </div>
  );
}
