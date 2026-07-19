import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function AdminLayout({ children }) {
  return (
     <div className="flex flex-col relative max-w-[1440px] h-screen m-auto text-theme overflow-hidden">
       <Header />
       <div className="flex flex-1 overflow-hidden md:gap-3">
         <div className="flex-none w-12 sm:w-[200px] md:w-[30%] md:max-w-[220px] lg:w-[25%] xl:w-[18%] bg-sidebar-theme sm:bg-black/20 sm:backdrop-blur-md border-r border-theme  overflow-y-auto transition-all duration-300 scrollbar-hide">
           <Sidebar />
         </div>
        <div className="flex-1 overflow-y-auto relative backdrop-blur-sm no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
