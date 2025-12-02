import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useUser } from "../Features/Authentication/useUser"
import Loader from "./Loader"
import toast from "react-hot-toast"

export default function ProtectedRoute() {
  const navigate = useNavigate()
  const { isLoading, isAuthenticated} = useUser()

  useEffect(function(){
    if(!isAuthenticated && !isLoading) {
      toast.error("You have to be logged in", { duration: 500 } )
      const timeoutId = setTimeout(() => {
        navigate("/login");
      }, 400);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isLoading, navigate])

  if(isLoading) return <Loader />

  if (!isAuthenticated)  return null

  return <Outlet />
}

1051891957420-hn2psk2l9cnbeos0fsgf0hjgg2s4jgtm.apps.googleusercontent.com

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