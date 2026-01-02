import SidebarII from "./components/SidebarII";

export default async function ClassRepAdminLayout({ children }) {
  // add server side control statement so tha is role not equal to class rep, it redirects to dashboard

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-none h-full border-r border-white/5 bg-black/40">
        <SidebarII />
      </div>
      <div className="flex-1 h-full overflow-y-auto relative no-scrollbar">{children}</div>
    </div>
  );
}
