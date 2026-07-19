"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getGlobalSession, updateGlobalSession } from "@/lib/server/app_settings";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";

function GlobalSessionManager() {
  const queryClient = useQueryClient();
  const [sessionInput, setSessionInput] = useState("");
  const [validationError, setValidationError] = useState("");

  const { data: globalSession, isLoading: isLoadingSession } = useQuery({
    queryKey: ["globalSession"],
    queryFn: getGlobalSession,
    staleTime: Infinity, // This data changes infrequently
  });

  useEffect(() => {
    if (globalSession) {
      setSessionInput(globalSession);
    }
  }, [globalSession]);

  const { mutate: updateSession, isPending: isUpdating } = useMutation({
    mutationFn: (sessionString) => updateGlobalSession(sessionString),
    onSuccess: () => {
      toast.success("Academic session updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["globalSession"] });
    },
    onError: (error) => {
      toast.error(error.message || "An unexpected error occurred.");
    },
  });

  function handleInputChange(e) {
    const value = e.target.value;
    setSessionInput(value);
    // Live validation
    if (!/^\d{4}\/\d{4}$/.test(value)) {
      setValidationError("The year is not valid. Follow the format yyyy/yyyy.");
    } else {
      setValidationError("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    updateSession(sessionInput);
  }

  return (
    <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <h2 className="text-lg font-bold text-white mb-4">Global Academic Session</h2>
      {isLoadingSession ? (
        <div className="h-10 bg-white/10 rounded-md animate-pulse"></div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="session" className="block text-sm font-medium text-white">
              Current Session
            </label>
            <input
              id="session"
              name="session"
              type="text"
              value={sessionInput}
              onChange={handleInputChange}
              placeholder="e.g., 2025/2026"
              required
              className={`mt-1 block w-full rounded-md border-transparent bg-white/10 py-2 px-3 text-white shadow-sm focus:border-indigo-500 focus:outline-none ${validationError ? 'border-red-500' : ''}`}
            />
            {validationError && (
              <p className="text-sm text-red-400 mt-2">{validationError}</p>
            )}
          </div>
          <Button
            variant="primary"
            type="submit"
            disabled={isUpdating || !!validationError}
            width="w-full"
          >
            {isUpdating ? <Loader /> : "Update Session"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default GlobalSessionManager;
