"use client";
import Image from "next/image";

const achievements = [
  {
    label: "Class time saved per semester",
    value: "200+ hrs",
  },
  { label: "Proxy attempts blocked", value: "1.2k+" },
  { label: "Attendance records secured", value: "50k+" },
];
const projectTimeline = [
  { id: 1, name: "Project Initialized", value: "2025" },
  { id: 2, name: "Core Team Members", value: "3" },
  { id: 3, name: "Active Students", value: "2000+" },
  { id: 4, name: "Reliability Uptime", value: "99.9%" },
];
const team = [
  // {
  //   name: "Nwachukwu Ekeledirichukwu",
  //   role: "Founder / Lead Engineer",
  //   location: "Enugu, Nigeria",
  //   imageUrl: "/me.png",
  // },
  {
    name: "Google Gemini",
    role: "Co-Pilot, Debugger & UI Architect",
    location: "Cloud Region (Global)",
    imageUrl: "https://placehold.co/400x400/blue/white?text=Gemini",
  },
  {
    name: "OpenAI ChatGPT",
    role: "Co-Debugger",
    location: "Azure Server (West US)",
    imageUrl: "https://placehold.co/400x400/teal/white?text=GPT",
  },
];

export default function About() {
  return (
    <div className="relative z-10 w-full text-white font-sans selection:bg-indigo-500/30 overflow-hidden">
      <div className="relative isolate pt-14 md:pt-25">
        <div
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white/5 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-6 py-5 sm:py-10 md:pt-15 lg:px-8">
          <div className="mx-auto max-w-2xl md:flex md:flex-col md:gap-10 lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6">
            <div className="h-full max-w-xl">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-5xl mb-5 lg:mt-12 lg:col-span-2 xl:col-auto">
                We are redefining academic attendance.
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg leading-8 text-gray-300">
                  Gone are the days of passing around a sheet of paper only to
                  find more names than people in the room. We believe attendance
                  should be a measure of actual presence, not just a signature.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  By leveraging GPS geofencing and hardware-level device
                  locking, Attend•in ensures that every record is authentic,
                  secure, and verifiable in real-time.
                </p>
              </div>
            </div>

            <div className="relative lg:-top-30 mt-14 flex justify-end gap-8 sm:-mt-5 sm:justify-start sm:pl-20 md:max-lg:pl-5 md:flex-row md:gap-6 md:mt-10 lg:mt-0 lg:pl-0">
              <div className="ml-auto w-44 md:max-lg:w-60 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-0 xl:pt-80">
                <div className="relative">
                  <Image
                    src="/image2.png"
                    alt="App Interface"
                    width={400}
                    height={600}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg border border-white/10"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
              </div>
              <div className="mr-auto w-44 md:max-lg:w-55 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                <div className="relative">
                  <Image
                    src="/image2.png"
                    alt="Scanning QR"
                    width={400}
                    height={600}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg border border-white/10"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="relative">
                  <Image
                    src="/image1.png"
                    alt="Dashboard View"
                    width={400}
                    height={600}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg border border-white/10"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
              </div>
              <div className="w-44 md:max-lg:w-50 flex-none space-y-8 pt-32 sm:pt-0">
                <div className="relative">
                  <Image
                    src="/image2.png"
                    alt="Mobile View"
                    width={400}
                    height={600}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg border border-white/10"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="relative">
                  <Image
                    src="/image1.png"
                    alt="Data Analytics"
                    width={400}
                    height={600}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg border border-white/10"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-24 lg:pt-2 sm:py-18 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl lg:max-w-7xl lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-x-8 lg:gap-y-10">
              <div className="w-full lg:w-[60%] lg:pr-4">
                <div className="lg:max-w-lg">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Our Mission
                  </h2>
                  <p className="mt-6 text-xl leading-8 text-gray-300">
                    To eliminate academic dishonesty in attendance taking while
                    saving valuable class time for what matters: teaching and
                    learning.
                  </p>
                  <p className="mt-8 text-base leading-7 text-gray-400">
                    We empower lecturers and class representatives with tools
                    that are fast, secure, and irrefutable. By digitizing the
                    process, we provide instant insights into student
                    participation and course engagement, removing the
                    administrative burden of manual roll calls.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-[40%] mt-10 lg:mt-0 lg:border-l lg:border-white/10 lg:pl-10">
                <dl className="flex flex-col md:max-lg:mt-10 md:max-lg:flex-row md:max-lg:justify-between gap-y-12 lg:gap-y-16">
                  {achievements.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col-reverse gap-y-1 pl-4 border-l-2 border-indigo-500/50"
                    >
                      <dt className="text-base leading-7 text-gray-400">
                        {stat.label}
                      </dt>
                      <dd className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/60 py-24 sm:py-32 backdrop-blur-md border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center md:grid-cols-4">
            {projectTimeline.map((stat) => (
              <div
                key={stat.id}
                className="mx-auto flex max-w-xs flex-col gap-y-4 text-left border-l border-white/40 pl-6 w-full"
              >
                <dt className="text-base leading-7 text-gray-400">
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="px-8 py-18 sm:py-24 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Team
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-400">
              A blend of human ingenuity and artificial intelligence, dedicated
              to building the future of academic management.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-x-8 gap-y-6 lg:gap-y-10 mt-10">
            <div>
              <Image
                src="/me.png" // Ensure you have a relevant screenshot here or keep the placeholder
                alt="Team lead"
                width={400}
                height={300}
                className=" sm:mx-auto w-150 md:w-120 lg:w-160 h-120 md:h-150 lg:h-120 xl:h-145 object-cover"
              />
              <div className="text-center">
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-white">
                  Nwachukwu Ekeledirichukwu
                </h3>
                <p className="text-base leading-7 text-gray-300">
                  Founder / Lead Engineer
                </p>
                <p className="text-sm leading-6 text-gray-500">
                  Enugu, Nigeria
                </p>
              </div>
            </div>
            <ul
              role="list"
              className="grid mx-auto max-w-2xl grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            >
              {team.map((person, index) => (
                <li key={person.name}>
                  <img
                    className="w-full object-cover border border-white/10"
                    src={person.imageUrl}
                    alt={person.name}
                  />
                  {/* <Image
                    className="w-full object-cover border border-white/10"
                    src={person.imageUrl}
                    alt={person.name}
                    width={400}
                    height={300}
                  /> */}
                  <h3 className="mt-2 text-lg font-semibold leading-8 tracking-tight text-white">
                    {person.name}
                  </h3>
                  <p className="text-base leading-6 text-gray-300">
                    {person.role}
                  </p>
                  <p className="text-sm leading-4 text-gray-500">
                    {person.location}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
