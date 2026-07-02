"use client";
import { createClient } from "../utils/supabase/client";
import { useState } from "react";
import { useAdminLogin, useLogin, useSignup } from "@/hooks/query/useAuth";
import { checkUserExists } from "@/lib/server/students";
import AuthModal from "./AuthModal";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import toast from "react-hot-toast";
import Link from "next/link";
import { createDeviceFingerprint } from "@/lib/deviceFingerprint";

export default function AuthForm({ pathname }) {
  const supabase = createClient();

  const { signup, isSignupLoading } = useSignup();
  const { login, isLoginLoading} = useLogin()
  const { adminLogin, isAdminLoginLoading } = useAdminLogin()

  const [open, setOpen] = useState(false)

  const [email, setEmail] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    matricNo: "",
    password: "",
  });

  const [verifyingMatricNo, setVerifyingMatricNo] = useState(false);
  const [isVerifyingRep, setIsVerifyingRep] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);

  async function verifyMatric(matric) {
    const { data, error } = await supabase.rpc("check_matric_exists", {
      matric_input: matric,
    });

    if (error) {
      console.error(error);
      throw new Error("Unable to verify matric number.");
    }

    // setVerifyingMatricNo(true)
    return data === true;
  }

  async function verifyDevice(matric){
    const { data: checkDevice, error: checkDeviceError } = await supabase
      .from("users")
      .select("bound_device_id")
      .eq("matric_number", matric)
      .single();

    if (checkDeviceError) {
      throw new Error(checkDeviceError.message);
    }
    if (!checkDevice) {
      throw new Error("Student device not found");
    }
    
    return checkDevice.bound_device_id
  }

  function handleStudentSignup() {
    setOpen(false);
    signup(
      { email, password, matricNo },
      {
        onSettled: () => {
          setEmail("");
          setMatricNo("");
          setPassword("");
        },
      }
    );
  }

  async function handleClassRepSignup(contact, otp){
    setOpen(false);
    setIsVerifyingRep(true);

    try {
      // Check Invite
      const { data: invite, error: inviteError } = await supabase
        .from("class_rep_invites")
        .select("*")
        .eq("matric_number", matricNo)
        .single();

      if (inviteError || !invite)
        throw new Error("No class rep invite found for this matric number.");
      if (invite.otp_code !== otp) throw new Error("Invalid OTP provided.");
      if (invite.used) throw new Error("OTP already used. Request a new one.");

      const currentTime = new Date();
      const expiresAt = new Date(invite.expires_at);

      //check time, make sure not up to 3 minutes after code was created
      if (currentTime > expiresAt) {
        throw new Error("OTP has expired. Request a new one.");
        return;
      }

      // Mark Invite Used
      const { error: updateError } = await supabase
        .from("class_rep_invites")
        .update({ used: true })
        .eq("matric_number", matricNo);

      if (updateError) throw new Error("Failed to update OTP usage.");

      // Create User
      const { userId } = await signup({ email, password, matricNo });

      // Create Class Rep Entry
      const { error: repError } = await supabase.from("class_reps").insert({
        student_id: userId,
        contact,
        department: "comp sci",
      });

      if (repError) throw new Error("Unable to save class rep details");

      // Update User Role from  default student to class rep
      const { error: updateRoleError } = await supabase
        .from("users")
        .update({ role: "class rep" })
        .eq("matric_number", matricNo);

      if (updateRoleError) throw new Error("Unable to update role");

      toast.success("Class rep verified!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred");

    } finally {
      setIsVerifyingRep(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let isValid = true;
    const newErrors = {};

    if (password.length < 8) {
      newErrors.password = "Passwords must be 8 characters or more";
      isValid = false;
    }

    if (pathname !== "/admin/login") {
      if (matricNo.length !== 11) {
        newErrors.matricNo = "Invalid matric number";
        isValid = false;
      }
    }

    if (pathname === "/signup") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email. Enter a valid email address";
        isValid = false;
      }

      setErrors(newErrors);
      if (!isValid) return;

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
    }

    if (pathname === "/login") {
      setErrors(newErrors);

      if (isValid) {
        setVerifyingMatricNo(true);

        try {
          //check user
          const existingUser = await checkUserExists(matricNo);

          if (!existingUser) {
            toast.error("User doesn't exist. Try signing up");
            return; 
          }

          //check device
          let dbKey = await verifyDevice(matricNo);

          //if no device bound
          if (!dbKey || dbKey.length < 5) {
            console.log("Binding new device...");

            const { uuid, deviceId } = await createDeviceFingerprint();

            //update device id
            const { error: updateDeviceError } = await supabase
              .from("users")
              .update({ bound_device_id: deviceId })
              .eq("matric_number", matricNo);

            if (updateDeviceError) throw new Error("Unable to change device");

            //update the local storage too
            localStorage.setItem("device_id", deviceId);
            localStorage.setItem("device_uuid", uuid);

            //updates dbkey to the newly created record
            dbKey = deviceId;

            toast.success("New device bound to account.");
          }

          const localKey = localStorage.getItem("device_id");

          const isDevice = dbKey === localKey;

          if (!isDevice) {
            toast.error("Device mismatch. This account is bound to another device!");
            return;
          }

          login({ matricNo, password });

        } catch (error) {
          console.error(error);
          toast.error(error.message || "An error occurred during login");
        
        } finally {
          setVerifyingMatricNo(false);
        }
      }
    }

    if (pathname === "/admin/login") {
      setErrors(newErrors);

      if (isValid) {
        adminLogin({email, password})
      }
    }

    if (pathname === "/forgot-password") {
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
  }

  return (
    <>
      <div className="absolute z-10 bg-black/30 backdrop-blur-sm w-full sm:max-w-md h-screen sm:h-fit flex flex-col justify-center content-center px-6 py-8 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-20 w-auto" src="/logo5.png" alt="logo" />
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-50">
            {pathname === "/signup" && "Sign up for an account"}
            {pathname === "/login" && "Log in to your account"}
            {pathname === "/admin/login" && "Log in with admin priviledges"}
            {pathname === "/forgot-password" && "Forgot your Password?"}
          </h2>

          {pathname === "/forgot-password" && (
            <h4 className="mt-3 text-[11px] text-amber-200 font-bold">
              We've got you covered. <br />
              Input your signup email, and we will send you the recovery link to
              the.
            </h4>
          )}
        </div>

        <div
          className={`${pathname === "/forgot-password" ? "mt-4" : "mt-10"} sm:mx-auto sm:w-full sm:max-w-sm`}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {pathname !== "/login" && (
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
            )}

            {pathname === "/login" || pathname === "/signup" ? (
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
                    required
                    className="block w-full rounded-md border border-transparent bg-white/5 py-2 px-3 text-white shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none sm:text-md sm:leading-6"
                  />
                  {errors.matricNo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.matricNo}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}

            {pathname !== "/forgot-password" && (
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    {pathname === "/login" && (
                      <Link
                        href="/forgot-password"
                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
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
            )}

            <Button variant="primary" type="submit">
              {isSignupLoading ||
              verifyingMatricNo ||
              isLoginLoading ||
              isAdminLoginLoading ||
              isVerifyingRep ||
              isResetLoading ? (
                <Loader />
              ) : (
                <>
                  {pathname === "/signup" && "Sign up"}
                  {(pathname === "/login" || pathname === "/admin/login") && "Log in"}
                  {pathname === "/forgot-password" && "Reset Password"}
                </>
              )}
            </Button>
          </form>
          {pathname !== "/admin/login" && (
            <div className="text-center mt-8 text-sm">
              {pathname === "/login" ? (
                <p>
                  Haven't signed up?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              ) : pathname === "/signup" ? (
                <p>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <AuthModal
        open={open}
        setOpen={setOpen}
        onConfirmStudent={handleStudentSignup}
        onConfirmClassRep={handleClassRepSignup}
      />
    </>
  );
}
