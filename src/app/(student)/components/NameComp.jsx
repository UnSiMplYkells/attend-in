export default function NameComp({ collapsedOnMobile = false, isDrawerOpen }) {  
  return (
    <div
      className={`${
        isDrawerOpen ? "justify-start" : "justify-center"
      } flex items-center sm:justify-start gap-3 overflow-hidden`}
    >
      <div className="size-10 shrink-0 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
        {/* make a split of the first letter of first name and first letter of last name to show here*/}
        NE
      </div>

      <div
        className={`flex flex-col transition-all duration-300 ${
          collapsedOnMobile ? "hidden sm:flex" : "flex"
        }`}
      >
        <span className="text-sm font-semibold text-white truncate max-w-[150px]">
          Nwachukwu E.
        </span>
        {/* make this amdin there to come form role */}
        <span className="text-xs text-gray-500 truncate">Admin</span>
      </div>
    </div>
  );
}
