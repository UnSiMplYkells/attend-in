"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import { useGetUsersClasses } from "@/hooks/query/useClasses"
import { useGetActiveAtdSession } from "@/hooks/query/useAtdSessions";

export default function page() {
  const router = useRouter();
  const { setId, Id: urlId } = useStore();

  const [hasRedirected, setHasRedirected] = useState(false);

  const { data: userClasses, isClassesLoading } = useGetUsersClasses();
  const userClassIds = userClasses?.map((c) => c.id) || [];

  const { activeAtdSession } = useGetActiveAtdSession(userClassIds);

  const matchedClass =
    activeAtdSession &&
    userClasses?.some(
      (classItem) => activeAtdSession?.class_id === classItem.id,
    )
      ? activeAtdSession
      : null;

  const sessionId = matchedClass?.id;

  function handleClick(cls){
    if(matchedClass?.class_id !== cls.id) return
    setId(sessionId);
    router.push(`/class-rep/attendance/reports/${sessionId}`);
  }

  
  return (
    <div>
      <h1>attendance reports</h1>
      {userClasses?.map((cls) => {
        const isActive = matchedClass?.class_id === cls.id;

        return (
          <h4
            key={cls.id}
            className={
              isActive ? "text-green-200 cursor-pointer" : "opacity-80"
            }
            onClick={() => handleClick(cls)}
          >
            {cls.course_code}, {cls.course_name}
          </h4>
        );
      })}
    </div>
  );
}