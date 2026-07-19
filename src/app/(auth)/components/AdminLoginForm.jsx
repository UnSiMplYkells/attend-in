"use client";

import { useState } from "react";
import { useAdminLogin } from "@/hooks/query/useAuth";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";

export default function AdminLoginForm() {
  const { adminLogin, isAdminLoginLoading } = useAdminLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const isLoading = isAdminLoginLoading;

  async function handleSubmit(e) {
    e.preventDefault();

    let isValid = true;
    const newErrors = {};

    if (password.length < 8) {
      newErrors.password = "Passwords must be 8 characters or more";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      adminLogin({ email, password });
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

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-white"
          >
            Password
          </label>
        </div>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            required
            className="block w-full rounded-md border border-transparent bg-white/5 py-2 px-3 text-white shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none sm:text-md sm:leading-6"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>
      </div>

      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? <Loader /> : "Log in"}
      </Button>
    </form>
  );
}
