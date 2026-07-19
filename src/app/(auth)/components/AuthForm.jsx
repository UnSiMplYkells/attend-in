import Link from "next/link";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import AdminLoginForm from "./AdminLoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function AuthForm({ pathname }) {
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
          {pathname === "/signup" && <SignupForm />}
          {pathname === "/login" && <LoginForm />}
          {pathname === "/admin/login" && <AdminLoginForm />}
          {pathname === "/forgot-password" && <ForgotPasswordForm />}

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
    </>
  );
}
