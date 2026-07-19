"use client";

import { createClient } from "../../utils/supabase/client";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import toast from "react-hot-toast";

export default function ForgotPasswordForm() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
  });

  const [isResetLoading, setIsResetLoading] = useState(false);

  const isLoading = isResetLoading;

  async function handleSubmit(e) {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Invalid email. Enter a valid email address" });
      return;
    }

    setIsResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Reset link sent! Check your email.");
        setEmail("");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsResetLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-white"
        >
          Email address
        </label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            required
            className="block w-full rounded-md border border-transparent bg-white/5 py-2 px-3 text-white shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none sm:text-md sm:leading-6"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? <Loader /> : "Reset Password"}
      </Button>
    </form>
  );
}
