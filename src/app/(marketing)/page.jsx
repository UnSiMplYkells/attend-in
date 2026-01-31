"use client";
import Navigation from "./components/Navigation";
import Button from "../components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import {
  MdOutlineSignalWifiConnectedNoInternet4,
  MdSecurity,
  MdGpsFixed,
  MdQrCode2,
  MdSpeed,
  MdSupportAgent,
} from "react-icons/md";

const features = [
  {
    title: "Offline Access",
    description:
      "No network? Attendance can still be marked successfully and then when ever internet access returns, it pushes the record to the data base",
    icon: MdOutlineSignalWifiConnectedNoInternet4,
    color: {
      text: "text-indigo-400",
      bg: "bg-indigo-500/20",
      icon: "text-indigo-500",
    },
  },
  {
    title: "Geofencing",
    description:
      "Attendance can only be marked if the student is physically within 50 meters of the class venue. Spoofing locations is blocked.",
    icon: MdGpsFixed,
    color: {
      text: "text-green-400",
      bg: "bg-green-500/20",
      icon: "text-green-500",
    },
  },
  {
    title: "Device Binding",
    description:
      "One Student, One Device. Accounts are locked to a specific phone. A student cannot login on a friend's phone to mark attendance.",
    icon: MdSecurity,
    color: {
      text: "text-purple-400",
      bg: "bg-purple-500/20",
      icon: "text-purple-500",
    },
  },
  {
    title: "Active Support",
    description:
      "Our support team is always ready to help. Reach out via email or phone for any assistance you need or questions you have.",
    icon: MdSupportAgent,
    color: {
      text: "text-cyan-400",
      bg: "bg-cyan-500/20",
      icon: "text-cyan-500",
    },
  },
  {
    title: "Instant Reports",
    description:
      "Class Reps get real-time data. Generate Excel-compatible reports instantly for submission to lecturers or administration.",
    icon: MdSpeed,
    color: {
      text: "text-red-400",
      bg: "bg-red-500/20",
      icon: "text-red-500",
    },
  },
  {
    title: "Active Support",
    description:
      "Our support team is always ready to help. Reach out via email or phone for any assistance you need or questions you have.",
    icon: MdSupportAgent,
    color: {
      text: "text-amber-400",
      bg: "bg-amber-500/20",
      icon: "text-amber-500",
    },
  },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navigation />

      <div className="relative w-full z-10 mx-auto px-6 py-12 lg:py-18 lg:px-20 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="mb-6">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 transition-colors hover:bg-indigo-500/20">
                  v1.0 Live
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300">
                  <span>Device Fingerprinting Active</span>
                  <MdSecurity className="h-5 w-5 text-indigo-400" />
                </span>
              </a>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white">
              The End of{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                Proxy Attendance
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-400 max-w-2xl">
              Stop passing sheets and sharing codes.{" "}
              <span className="text-white font-medium">Attend•in</span> combines
              GPS geofencing and hardware-level device locking to ensure every
              attendance record is authentic and physically present.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="primary" width="w-full sm:w-[180px]">
                  Get Started
                </Button>
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-white group flex items-center gap-1 hover:text-indigo-400 transition-colors"
              >
                How it works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative mt-10 lg:mt-0">
            {/* Abstract Decorative Elements */}
            {/* <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div> */}

            <div className="relative rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden p-2 ring-1 ring-white/10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/image1.png" // Ensure you have a relevant screenshot here or keep the placeholder
                alt="App Dashboard Preview"
                width={800}
                height={600}
                className="rounded-xl w-full h-auto object-cover opacity-90"
                priority
              />

              <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-3 rounded-lg shadow-lg">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    System Status
                  </p>
                  <p className="text-sm text-white font-mono">
                    Geofence Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-10 bg-black/30 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">
              Why Attend•in?
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Hardware-Level Integrity
            </p>
            <p className="mt-4 text-lg text-gray-400">
              We don't just check if the code was scanned. We check{" "}
              <strong>where</strong> and <strong>what device</strong> scanned
              it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <feature.icon className={`text-9xl ${feature.color.icon}`} />
                </div>
                <div
                  className={`h-12 w-12 rounded-lg ${feature.color.bg} flex items-center justify-center mb-6 ${feature.color.text}`}
                >
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                Seamless Workflow for Class Reps
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-none h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      Start a Session
                    </h4>
                    <p className="text-gray-400 mt-1">
                      Select the course from your dashboard. The system
                      automatically verifies your location.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      Generate QR
                    </h4>
                    <p className="text-gray-400 mt-1">
                      A unique, dynamic QR code is displayed on your device or
                      projected screen.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      Students Scan
                    </h4>
                    <p className="text-gray-400 mt-1">
                      Students scan using the Attend•in app. The system
                      validates their GPS and Device ID instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0"></div>
              <div className="relative bg-[#0F0F12] border border-white/10 p-6 sm:p-10">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <MdQrCode2 className="text-3xl text-white" />
                    <span className="text-lg font-mono text-gray-300">
                      COS101_ATTENDANCE
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-bold uppercase">
                    Active
                  </span>
                </div>
                <div className="w-48 h-48 mx-auto bg-white rounded-lg p-2 mb-6">
                  <div className="w-full h-full border-4 border-black border-dashed flex items-center justify-center text-black font-bold opacity-20">
                    QR CODE
                  </div>
                </div>
                <p className="text-center text-gray-500 text-sm">
                  Session expires in 14:20
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
