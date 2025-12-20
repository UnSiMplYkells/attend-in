"use client";
import QrGenerator from "../components/QrGenerator";
import QrScanner from "../components/QrScanner";
import Navigation from "./components/Navigation";
import Beams from "../components/ui/Beams";
import Button from "../components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navigation />

      <div className="relative w-full z-10 mx-auto pl-8 pr-8 md:pr-0 pb-10 md:pb-24 lg:pt-15 sm:pb-32 md:flex lg:pl-20 justify-between items-center overflow-x-hidden">
        <div className="mx-auto md:w-[40%] lg:w-[60%] lg:mx-0 lg:pt-8">
          <div className="mt-12 lg:mt-0">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-600/10 transition-colors hover:bg-indigo-600/20">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300">
                <span>Just shipped v1.0 </span>
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </a>
          </div>

          <h1 className="mt-5 sm:mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Deploy to the cloud with confidence
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
          </p>

          <div className="mt-10 flex items-center gap-x-10">
            <Link href="/signup">
              <Button variant="primary" width="w-[150px]">
                Get started
              </Button>
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold leading-6 text-white group flex items-center gap-1 hover:text-indigo-400 transition-colors"
            >
              Learn more →
            </Link>
          </div>
        </div>

        <div className="relative left-3 hidden md:block md:mt-20 rounded-md md:w-[45%]  lg:w-[35%] shadow-2xl ring-2 ring-white/20 md:h-[600px] lg:h-[750px] outline outline-white/40 outline-offset-12">
          <Image
            src="/image1.png"
            alt="My Image"
            fill
            className="object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
