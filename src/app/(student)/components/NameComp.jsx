import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useUser } from "@/hooks/query/useUser";

export default function NameComp({ collapsedOnMobile = false, isDrawerOpen }) {
  const { user, isLoading: isUserLoading } = useUser();
  const name = user?.profileII?.full_name || ""
  const role = user?.profileII?.role;

  const parts = name.trim().split(/\s+/).filter(Boolean);

  let firstInitial = "";
  let lastInitial = "";
  let lastName = "";
  if (parts.length === 1) {
    firstInitial = parts[0][0]?.toUpperCase() || "";
    lastInitial = "";
    lastName = parts[0];
  }
  if (parts.length >= 2) {
    firstInitial = parts[0][0]?.toUpperCase() || "";
    lastInitial = parts[1][0]?.toUpperCase() || "";
    lastName = parts[0];
  }
  const initials = (firstInitial || "") + (lastInitial || "");

  return (
    <SkeletonTheme baseColor="#313131" highlightColor="#525252">
      <div
        className={`${
          isDrawerOpen ? "justify-start" : "justify-center"
        } flex items-center sm:justify-start gap-3 overflow-hidden`}
      >
        {isUserLoading ? (
          <Skeleton circle width={40} height={40} />
        ) : (
          <div className="size-10 shrink-0 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            {initials}
          </div>
        )}

        <div
          className={`flex flex-col transition-all duration-300 ${
            collapsedOnMobile ? "hidden sm:flex" : "flex"
          }`}
        >
          <span className="text-sm font-semibold text-white truncate max-w-[150px]">
            {lastName && lastInitial ? (
              <>
                {lastName} {lastInitial}.
              </>
            ) : (
              <Skeleton width={140} />
            )}
          </span>
          <span className="text-xs text-gray-500 truncate">
            {role || <Skeleton width={80} />}
          </span>
        </div>
      </div>
    </SkeletonTheme>
  );
}
