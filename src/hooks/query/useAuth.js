"use client"
import { createDeviceFingerprint } from "@/lib/deviceFingerprint";
import {
  signInWithEmail as adminLoginApi,
  signInWithMatric as signInWithMatricApi,
  signUpNewUser as signUpNewUserApi,
} from "@/lib/server/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useSignup() {
  const { mutateAsync: signup, isPending: isSignupLoading } = useMutation({
    mutationFn: async (signupData) => {
      // Generate fingerprint 
      const { uuid, deviceId } = await createDeviceFingerprint();

      //save only uuid to localstorage
      localStorage.setItem("device_uuid", uuid);

      // Merge fingerprint into signup payload
      return signUpNewUserApi({ ...signupData, deviceFingerprint: deviceId });
    },
    onSuccess: (data) => {
      toast.success("Account Created! Activate it through your mail");
      if (data?.deviceFingerprint) {
        localStorage.setItem("device_id", data.deviceFingerprint);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { signup, isSignupLoading };
}

export function useLogin() {
  const router = useRouter()

  const { mutate: login, isPending: isLoginLoading } = useMutation({
    mutationFn: async (formData) => {
      const result = await signInWithMatricApi(formData);

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (data) => {
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { login, isLoginLoading };
}

export function useAdminLogin(){
  const router = useRouter();

  const { mutate: adminLogin, isPending: isAdminLoginLoading } = useMutation({
    mutationFn: adminLoginApi,
    onSuccess: (data) => {
      toast.success("Logged in as admin!");
      router.push("/admin/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { adminLogin, isAdminLoginLoading };
}