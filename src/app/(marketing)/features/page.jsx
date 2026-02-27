"use client";
import Image from "next/image";
import {
  MdGpsFixed,
  MdPhoneAndroid,
  MdQrCodeScanner,
  MdInsights,
  MdCloudDone,
  MdSecurity,
} from "react-icons/md";

export default function FeaturesPage() {
  const features = [
    {
      name: "Smart Geofencing",
      description:
        "Attendance is strictly limited to a 50-meter radius of the class venue. Our GPS verification ensures students are physically present.",
      icon: MdGpsFixed,
    },
    {
      name: "Device Fingerprinting",
      description:
        "One Student, One Device. We bind accounts to hardware IDs, preventing students from logging in on a friend's phone to mark proxy attendance.",
      icon: MdPhoneAndroid,
    },
    {
      name: "Dynamic QR Codes",
      description:
        "Class Reps generate unique, session-specific QR codes that validate time, date, and location instantly upon scanning.",
      icon: MdQrCodeScanner,
    },
    {
      name: "Anti-Spoofing Security",
      description:
        "Advanced checks prevent GPS mocking and location spoofing apps, ensuring the integrity of every attendance record.",
      icon: MdSecurity,
    },
    {
      name: "Real-time Reports",
      description:
        "Class representatives and lecturers get instant access to attendance data. Export reports to CSV/Excel immediately after class.",
      icon: MdInsights,
    },
    {
      name: "Cloud Sync",
      description:
        "All data is securely stored and synced via Supabase, ensuring records are never lost and accessible from any authorized device.",
      icon: MdCloudDone,
    },
  ];

  return (
    <div className="relative z-10 w-full text-white font-sans selection:bg-indigo-500/30">
      <div className="py-15">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">
              Precision & Integrity, Everything you need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              No Network? No problem.
            </p>
            <p className="mt-2 sm:mt-6 text-md sm:text-lg leading-8 text-gray-300">
              Our solution ensures can take your attendance even when offline,
              and sync to the server whenever you access the internet again.{" "}
              <br />
              You cant miss an attendance because of internet fluctuations.
            </p>
          </div>

          <div className="mt-10 sm:mt-14">
            <Image
              src="/image2.png"
              alt="App screenshot"
              width={1200}
              height={600}
              className="w-full rounded-sm h-[250px] sm:h-auto object-cover opacity-100 mask-[linear-gradient(to_bottom,black_72%,transparent_100%)]"
            />
          </div>
        </div>
      </div>

      <div className="py-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Eliminate Proxy Attendance.
            </p>
            <p className="mt-2 sm:mt-6 text-md sm:text-lg leading-8 text-gray-300">
              Attend•in combines hardware-level security with geolocation to
              guarantee that every check-in is authentic. Say goodbye to paper
              sheets and "helping a friend out."
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3 mb-20 sm:pt-6 sm:mb-25">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 sm:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex flex-col bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <dt className="flex items-center gap-x-3 text-base font-bold leading-7 text-white mb-2">
                    <feature.icon
                      className="size-6 text-indigo-400"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>

                  <dd className="flex flex-auto flex-col text-sm leading-6 text-gray-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
