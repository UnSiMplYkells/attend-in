"use client";

import { createClient } from "../../utils/supabase/client";
import { useState } from "react";
import { useSignup, useClassRepSignup } from "@/hooks/query/useAuth";
import { checkUserExists } from "@/lib/server/students";
import AuthModal from "./AuthModal";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import toast from "react-hot-toast";

export default function SignupForm() {
    const supabase = createClient();

  const { signup, isSignupLoading } = useSignup();
  const { classRepSignup, isClassRepSignupLoading } = useClassRepSignup();
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState("student");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    matricNo: "",
    password: "",
  });

  const [verifyingMatricNo, setVerifyingMatricNo] = useState(false);

  const isLoading = isSignupLoading || verifyingMatricNo || isClassRepSignupLoading;

  async function verifyMatric(matric) {
    const { data, error } = await supabase.rpc("check_matric_exists", {
      matric_input: matric,
    });

    if (error) {
      console.error(error);
      throw new Error("Unable to verify matric number.");
    }

    return data === true;
  }

  function handleStudentSignup() {
    setOpen(false);
    signup(
      { email, password, matricNo, userType: "student" },
      {
        onSettled: () => {
          setEmail("");
          setMatricNo("");
          setPassword("");
        },
      }
    );
  }

  function handleClassRepSignup(contact, otp, level) {
    setOpen(false);
    classRepSignup(
      { email, password, matricNo, contact, otp, level },
      {
        onSettled: () => {
          setEmail("");
          setMatricNo("");
          setPassword("");
        },
      }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let isValid = true;
    const newErrors = {};

    if (password.length < 8) {
      newErrors.password = "Passwords must be 8 characters or more";
      isValid = false;
    }

    if (userType === "student" && matricNo.length !== 11) {
      newErrors.matricNo = "Invalid matric number";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email. Enter a valid email address";
      isValid = false;
    }

    if (userType === "general_user" && fullName.trim().length === 0) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    if (userType === "student") {
      setVerifyingMatricNo(true);

      try {
        const existingUser = await checkUserExists(matricNo);

        if (existingUser) {
          toast.error("User already exists! Try logging in.");
          return;
        }

        const exists = await verifyMatric(matricNo);
        if (!exists) {
          setErrors((prev) => ({
            ...prev,
            matricNo: "Matric number not found in official registry.",
          }));
          return;
        }

        setOpen(true);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setVerifyingMatricNo(false);
      }
    } else {
      // General User flow: bypass modal and matric check
      signup(
        { email, password, fullName, userType },
        {
          onSettled: () => {
            setEmail("");
            setPassword("");
            setFullName("");
          },
        }
      );
    }
  }

  return (
    <>
      <div className="flex bg-black/30 p-1 rounded-lg mb-6 border border-white/5">
        <button
          type="button"
          onClick={() => {
            setUserType("general_user");
            setErrors({});
          }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            userType === "general_user"
              ? "bg-indigo-600 text-white shadow"
              : "text-gray-400 hover:text-white"
          }`}
        >
          General Use
        </button>
        <button
          type="button"
          onClick={() => {
            setUserType("student");
            setErrors({});
          }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            userType === "student"
              ? "bg-indigo-600 text-white shadow"
              : "text-gray-400 hover:text-white"
          }`}
        >
          University Student
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {userType === "general_user" && (
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium leading-6 text-white"
            >
              Full Name
            </label>
            <div className="mt-2">
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors((prev) => ({ ...prev, fullName: "" }));
                }}
                required={userType === "general_user"}
                className="block w-full rounded-md border border-transparent bg-white/5 py-2 px-3 text-white shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none sm:text-md sm:leading-6"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
          </div>
        )}

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

        {userType === "student" && (
          <div>
            <label
              htmlFor="matricNumber"
              className="block text-sm font-medium leading-6 text-white"
            >
              Matric No.
            </label>
            <div className="mt-2">
              <input
                id="matricNumber"
                type="text"
                autoComplete="matricNumber"
                placeholder="____/______"
                value={matricNo}
                onChange={(e) => {
                  setMatricNo(e.target.value);
                  setErrors((prev) => ({ ...prev, matricNo: "" }));
                }}
                required={userType === "student"}
                className="block w-full rounded-md border border-transparent bg-white/5 py-2 px-3 text-white shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none sm:text-md sm:leading-6"
              />
              {errors.matricNo && (
                <p className="text-red-500 text-sm mt-1">{errors.matricNo}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-white"
          >
            Password
          </label>
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
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? <Loader /> : "Sign up"}
        </Button>
      </form>
      <AuthModal
        open={open}
        setOpen={setOpen}
        onConfirmStudent={handleStudentSignup}
        onConfirmClassRep={handleClassRepSignup}
      />
    </>
  );
}