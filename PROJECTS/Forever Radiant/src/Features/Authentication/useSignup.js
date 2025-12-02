import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../Services/apiAuth";
import toast from "react-hot-toast";

export function useSignup(setActiveTab){
  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      toast.success("Account successfully created! Please verify the new account from the user's email address.")
      setActiveTab("login")
    },
      onError: (error) => {
      toast.error(error.message);
    }
  })

  return { signup, isLoading }
}