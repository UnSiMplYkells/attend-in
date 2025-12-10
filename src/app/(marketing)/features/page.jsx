import Image from "next/image";
import { RxPerson } from "react-icons/rx";

export default function FeaturesPage() {
  const features = [
    {
      name: "Push to deploy",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
      icon: RxPerson,
    },
    {
      name: "SSL certificates",
      description:
        "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
      icon: RxPerson,
    },
    {
      name: "Simple queues",
      description:
        "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.",
      icon: RxPerson,
    },
    {
      name: "Advanced security",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
      icon: RxPerson,
    },
    {
      name: "Powerful API",
      description:
        "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
      icon: RxPerson,
    },
    {
      name: "Database backups",
      description:
        "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.",
      icon: RxPerson,
    },
  ];

  return (
    <div className="relative z-10 w-full text-white font-sans selection:bg-indigo-500/30">
      <div className="py-15">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">
              Everything you need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              No Network? No problem.
            </p>
            <p className="mt-2 sm:mt-6 text-md sm:text-lg leading-8 text-gray-300">
              Our solution ensures can take your attendance even when offline,
              and sync to the server. whenever you access the internet again.{" "}
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

      <div className="pt-3 mb-20 sm:pt-6 sm:mb-25">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16 sm:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <feature.icon
                      className="size-8 text-indigo-400"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>

                  {/* Description */}
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
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
