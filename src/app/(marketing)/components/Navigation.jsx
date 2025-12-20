"use client"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Twirl as Hamburger } from "hamburger-react";
import Button from "@/app/components/ui/Button";

export default function Navigation() {
  const pathName = usePathname()
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <div className="relative mt-6 z-50 flex justify-between sm:justify-center items-center px-4">
        <nav className="flex w-[70%] items-center justify-between rounded-full border border-white/50 bg-neutral-900/30 p-2 pl-5 backdrop-blur-xl shadow-lg shadow-black/20">
          <div className="flex size-8 items-center justify-center rounded-full ">
            <Link href="/">
              <img
                className="relative scale-150 top-px"
                src="/logo5.png"
                alt="logo"
              />
            </Link>
          </div>
          <div className="flex items-center gap-1  text-sm font-medium text-gray-200">
            <Link
              href="/features"
              className={`${
                pathName === "/features"
                  ? "bg-indigo-600/60"
                  : " hover:bg-white/10"
              } hidden sm:block rounded-full px-4 py-2 transition-colors hover:text-white`}
            >
              Features
            </Link>
            <Link
              href="/about"
              className={`${
                pathName === "/about"
                  ? "bg-indigo-600/60"
                  : " hover:bg-white/10"
              } hidden sm:block rounded-full px-4 py-2 transition-colors hover:text-white`}
            >
              About
            </Link>
            <Link
              href="/login"
              className="ml-2 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            >
              Login &#8594;
            </Link>
          </div>
        </nav>
        <div className=" block sm:hidden">
          <Hamburger toggled={isOpen} toggle={setOpen} rounded size={28} />
        </div>
      </div>

      <div
        className={`block sm:hidden fixed inset-0 z-60 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 z-70 h-full block sm:hidden
          w-full [@media(min-width:410px)_and_(max-width:539px)]:w-[75%]
          [@media(min-width:540px)_and_(max-width:639px)]:w-[55%]
          bg-blue-900/30 backdrop-blur-xl border-l border-white/10 shadow-2xl
          transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-5">
            <Link href="/" onClick={() => setOpen(false)}>
              <img
                className="size-12 object-contain"
                src="/logo5.png"
                alt="logo"
              />
            </Link>

            <div className="text-white">
              <Hamburger toggled={isOpen} toggle={setOpen} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/features"
              onClick={() => setOpen(false)}
              className={`text-2xl font-medium transition-colors py-4 px-8 bg-black/30 hover:bg-black/60 ${
                pathName === "/features"
                  ? "text-indigo-400"
                  : "text-white hover:text-indigo-300"
              }`}
            >
              Features
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className={`text-2xl font-medium transition-colors py-4 px-8 bg-black/30 hover:bg-black/60 ${
                pathName === "/about"
                  ? "text-indigo-400"
                  : "text-white hover:text-indigo-300"
              }`}
            >
              About
            </Link>

            <Button variant="primary">Login &#8594;</Button>
          </div>
        </div>
      </div>
    </>
  );
}
