"use client";

import { createDeviceFingerprint } from "@/lib/deviceFingerprint";
import {
  signInWithEmail as adminLoginApi,
  signInWithMatric as signInWithMatricApi,
  signInWithEmail,
  signUpNewUser as signUpNewUserApi,
  signUpClassRep,
} from "@/lib/server/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function useSignup() {
  const router = useRouter();
  const { mutateAsync: signup, isPending: isSignupLoading } = useMutation({
    mutationFn: async (signupData) => {
      const { uuid, deviceId } = await createDeviceFingerprint();
      localStorage.setItem("device_uuid", uuid);
      return signUpNewUserApi({ ...signupData, deviceFingerprint: deviceId });
    },
    onSuccess: (data) => {
      toast.success("Account Created! Please log in.");
      if (data?.deviceFingerprint) {
        localStorage.setItem("device_id", data.deviceFingerprint);
      }
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { signup, isSignupLoading };
}

export function useLogin() {
  const router = useRouter();

  const { mutate: login, isPending: isLoginLoading } = useMutation({
    mutationFn: (formData) => signInWithMatricApi(formData),
    onSuccess: () => {
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { login, isLoginLoading };
}

export function useGeneralLogin() {
  const router = useRouter();

  const { mutate: generalLogin, isPending: isGeneralLoginLoading } =
    useMutation({
      mutationFn: (formData) => signInWithEmail(formData),
      onSuccess: () => {
        toast.success("Login successful!");
        router.push("/general/dashboard");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { generalLogin, isGeneralLoginLoading };
}

export function useAdminLogin() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (variables) => {
      const response = await signInWithEmail({
        email: variables.email,
        password: variables.password,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      router.push("/admin/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    adminLogin: mutation.mutate,
    isAdminLoginLoading: mutation.isPending,
  };
}

export function useClassRepSignup() {
  const router = useRouter();
  const { mutate: classRepSignup, isPending: isClassRepSignupLoading } =
    useMutation({
      mutationFn: (formData) => signUpClassRep(formData),
      onSuccess: () => {
        toast.success("Class Rep account created! Please log in.");
        router.push("/login");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { classRepSignup, isClassRepSignupLoading };
}
