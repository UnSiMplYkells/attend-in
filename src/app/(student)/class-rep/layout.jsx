import SidebarII from "./components/SidebarII";
import { requireRole } from "@/lib/server/reuireUser";

export default async function ClassRepAdminLayout({ children }) {
  await requireRole();

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-none h-full border-r border-white/5 bg-black/40">
        <SidebarII />
      </div>
      <div className="flex-1 h-full overflow-y-auto relative no-scrollbar">
        {children}
      </div>
    </div>
  );
}
