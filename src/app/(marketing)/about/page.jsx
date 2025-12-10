import Image from "next/image";

export default function About() {
  return (
    <div className="relative z-10 w-full text-white font-sans selection:bg-indigo-500/30 overflow-hidden">
      <div className="relative isolate pt-14 md:pt-25">
        <div
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white/5 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-6 py-5 sm:py-10  md:pt-15 lg:px-8">
          <div className="mx-auto max-w-2xl md:flex md:flex-col md:gap-10 lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6">
            <div className="h-full max-w-xl">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-5xl mb-5 lg:mt-12 lg:col-span-2 xl:col-auto">
                We are changing the way people take attendance
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg leading-8 text-gray-300">
                  Cupidatat minim id magna ipsum sint dolor qui. Sunt sit in
                  quis cupidatat mollit aute velit. Et labore commodo nulla
                  aliqua proident mollit ullamco exercitation tempor. Sint
                  aliqua anim nulla sunt mollit id pariatur in voluptate cillum.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Eu voluptate tempor esse minim amet fugiat veniam occaecat
                  aliqua.
                </p>
              </div>
            </div>

            <div className="relative lg:-top-30 mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 md:max-lg:pl-5 md:flex-row md:gap-6 md:mt-10  lg:mt-0 lg:pl-0">
              <div className="ml-auto w-44 md:max-lg:w-60 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-0 xl:pt-80">
                <div className="relative">
                  <Image
                    src="/image2.png"
                    alt="Office Placeholder"
                    width={400}
                    height={600}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
              </div>
              <div className="mr-auto w-44 md:max-lg:w-55 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                <div className="relative">
                  <Image
                    src="/image2.png"
                    alt="Meeting Placeholder"
                    width={400}
                    height={600}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="relative">
                  <img
                    src="/image1.png"
                    alt="Discussion Placeholder"
                    width={400}
                    height={600}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
              </div>
              <div className="w-44 md:max-lg:w-50 flex-none space-y-8 pt-32 sm:pt-0">
                <div className="relative">
                  <Image
                    src="/image2.png"
                    alt="Brainstorm Placeholder"
                    width={400}
                    height={600}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="relative">
                  <Image
                    src="/image1.png"
                    alt="Work Placeholder"
                    width={400}
                    height={600}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
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
                    Our mission
                  </h2>
                  <p className="mt-6 text-xl leading-8 text-gray-300">
                    Aliquet nec orci mattis amet quisque ullamcorper neque, nibh
                    sem. At arcu, sit dui mi, nibh dui, diam eget aliquam.
                    Quisque id at vitae feugiat egestas ac.
                  </p>
                  <p className="mt-8 text-base leading-7 text-gray-400">
                    Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget
                    risus enim. Mattis mauris semper sed amet vitae sed turpis
                    id. Id dolor praesent donec est. Odio penatibus risus
                    viverra tellus varius sit neque erat velit.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-[40%] mt-10 lg:mt-0 lg:border-l lg:border-white/10 lg:pl-10">
                <dl className="flex flex-col  md:max-lg:mt-10 md:max-lg:flex-row md:max-lg:justify-between gap-y-12 lg:gap-y-16">
                  {[
                    {
                      label: "Attendannce taken every 24 hours",
                      value: "12k+",
                    },
                    { label: "Assets under holding", value: "$119 trillion" },
                    { label: "New users annually", value: "20k+" },
                  ].map((stat) => (
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

      <div className="bg-black/60 py-24 sm:py-32 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center md:grid-cols-4">
            {[
              { id: 1, name: "Idea was born", value: "2025" },
              { id: 2, name: "People on the team", value: "3" },
              { id: 3, name: "Users on the platform", value: "4K+" },
              { id: 4, name: "Attendances taken", value: "8K+" },
            ].map((stat) => (
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

      <div className="px-8 py-18 sm:py-8 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our team
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              We are a dynamic group of individuals who are passionate about
              what we do and dedicated to delivering the best results for our
              clients.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-5"
          >
            {[
              {
                name: "Nwachukwu Ekeledirichukwu",
                role: "Founder / CEO",
                location: "Enugu, Nigeria",
                imageUrl:
                  "https://placehold.co/400x400/indigo/white?text=Leslie",
              },
              {
                name: "Google Gemini",
                role: "Director of Designs / Debugging",
                location: "Server, Europe",
                imageUrl:
                  "https://placehold.co/400x400/blue/white?text=Michael",
              },
              {
                name: "OpenAi Chatgpt",
                role: "Co-Debugger",
                location: "Azure Server, USA",
                imageUrl: "https://placehold.co/400x400/teal/white?text=Dries",
              },
            ].map((person, index) => (
              <li
                key={person.name}
                className={
                  index === 0
                    ? "md:col-span-2 lg:col-span-2 lg:row-span-2" // First item spans 2 cols on MD, and 2x2 on LG
                    : ""
                }
              >
                <img
                  className={`w-full rounded-md object-cover ${
                    index === 0
                      ? "aspect-14/13 md:aspect-2/1 lg:aspect-auto lg:h-[70%]"
                      : "aspect-square"
                  }`}
                  src={person.imageUrl}
                  alt={person.name}
                />
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-white">
                  {person.name}
                </h3>
                <p className="text-base leading-7 text-gray-300">
                  {person.role}
                </p>
                <p className="text-sm leading-6 text-gray-500">
                  {person.location}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
