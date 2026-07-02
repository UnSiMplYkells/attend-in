"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import toast from "react-hot-toast";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";

export default function ResetPasswordPg() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e){
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      toast.success("Password updated successfully! 🎉");
      // Redirect to login after a short delay
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-8 ">
        <div className="text-center">
          <img className="mx-auto h-20 w-auto" src="/logo5.png" alt="logo" />
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                className="mt-1 block w-full rounded-xs border border-gray-600 bg-white/10 py-2.5 px-4 text-white placeholder-gray-400 "
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                required
                className="mt-1 block w-full rounded-xs border border-gray-600 bg-white/10 py-2.5 px-4 text-white placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/30 rounded-lg px-3 py-2 border border-red-500/30">
                {error}
              </p>
            )}
          </div>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Loader /> : "Update Password"}
          </Button>

          <p className="text-center mt-4 text-sm text-gray-400">
            Remember your password?{" "}
            <Link href="/login" className="font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
