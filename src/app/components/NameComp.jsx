import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useUser } from "@/hooks/query/useUser";
import Link from "next/link";

export default function NameComp({
  collapsedOnMobile = false,
  isDrawerOpen,
  profileHref = "/profile",
}) {
  const { user, isUserLoading } = useUser() || {};
  
  const name = user?.profileII?.full_name?.trim() || "";
  const role = user?.profileII?.role || "Flr. Member";

  const parts = name.split(/\s+/).filter(Boolean);

  let firstInitial = "";
  let lastInitial = "";
  let lastName = "";

  if (parts.length > 0) {
    firstInitial = parts[0][0]?.toUpperCase() || "";
    lastName = parts[0];
    if (parts.length >= 2) {
      lastInitial = parts[1][0]?.toUpperCase() || "";
    }
  }

  const initials = (firstInitial + lastInitial) || "?";

  return (
    <SkeletonTheme baseColor="#313131" highlightColor="#525252">
      <Link href={profileHref}>
        <div
          className={`${
            isDrawerOpen ? "justify-start" : "justify-center"
          } flex items-center sm:justify-start gap-3 overflow-hidden cursor-pointer`}
        >
          {isUserLoading ? (
            <Skeleton circle width={40} height={40} />
          ) : (
            <div
              className="size-10 shrink-0 rounded-full bg-linear-to-br from-indigo-500 
                        to-purple-600 flex items-center justify-center text-white font-bold 
                        shadow-md"
            >
              {initials}
            </div>
          )}

          <div
            className={`flex flex-col transition-all duration-300 ${
              collapsedOnMobile ? "hidden sm:flex" : "flex"
            }`}
          >
            {isUserLoading ? (
              <>
                <Skeleton width={140} />
                <Skeleton width={80} />
              </>
            ) : (
              <>
                <span className="text-sm font-semibold text-theme truncate max-w-[150px]">
                  {parts.length >= 2 
                    ? `${lastName} ${lastInitial}.` 
                    : name || "John Jane Doe"}
                </span>
                <span className="text-xs text-muted-theme truncate">
                  {role}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </SkeletonTheme>
  );
}