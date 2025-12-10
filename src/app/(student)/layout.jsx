import { requireUser } from "@/lib/server/reuireUser";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ParticlesBackground from "./components/ParticlesBackground";

export default async function DashboardLayout({ children }) {
  // const user = await requireUser();

  return (
    <>
      <ParticlesBackground />
      <div className="flex flex-col relative max-w-[1380px] h-screen m-auto text-white overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden md:gap-5">
          <div className="flex-none w-12 sm:w-[200px] md:w-[30%] md:max-w-[250px] lg:w-[25%] xl:w-[20%] bg-black/85 sm:bg-black/20 sm:backdrop-blur-md border-r border-white/5  overflow-y-auto transition-all duration-300 scrollbar-hide">
            <Sidebar />
          </div>
          <div className="flex-1 overflow-y-auto relative bg-amber-700/40 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}