import dynamic from "next/dynamic"
import { requireUser } from "@/lib/server/requireUser"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import AuthToast from "../components/AuthToasts";
import PushNotificationManager from "./components/PermissionsManager";
import BrowserWarningBanner from "./components/BrowserBanner";

// const ParticlesBackground = dynamic(
//   () => import("./components/ParticlesBackground"),
//   {
//     ssr: false,
//     loading: () => null,
//   },
// );

export default async function DashboardLayout({ children }) {
  // await requireUser();

  return (
    <>
      {/* remeber to return aprticles background */}
      {/* <ParticlesBackground /> */}
      <AuthToast />
      <div className="flex flex-col relative max-w-[1440px] h-screen m-auto text-white overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden md:gap-3">
          <div className="flex-none w-12 sm:w-[200px] md:w-[30%] md:max-w-[220px] lg:w-[25%] xl:w-[18%] bg-black/85 sm:bg-black/20 sm:backdrop-blur-md border-r border-white/5  overflow-y-auto transition-all duration-300 scrollbar-hide">
            <Sidebar />
          </div>
          <div className="flex-1 overflow-y-auto relative backdrop-blur-sm">
            <BrowserWarningBanner />
            {children}
            <PushNotificationManager />
          </div>
        </div>
      </div>
    </>
  );
}
