"use client"
import { useGetAtdRecord } from "@/hooks/query/useAtdRecord"
import { useUser } from "@/hooks/query/useUser"
import useStore from "@/store";

export default function ReportDetails({ reportsId }) {
  const { user } = useUser()
  const userId = user?.id


  const { data: atdRecord, isGetAtdRecordLoading } = useGetAtdRecord(reportsId)
  const avaClass = atdRecord?.[0]?.attendance_sessions?.classes?.course_code;
  const classStart = atdRecord?.[0]?.attendance_sessions?.window_start;
  const classEnd = atdRecord?.[0]?.attendance_sessions?.window_end;

  const nowNow = new Date().toISOString();


  if (isGetAtdRecordLoading) return <div>Loading...</div>
  if (!atdRecord) return <div>No record found.</div>

  return (
    <div>
      <h1>Attendance Details</h1>
      <p>Attendance record for {avaClass}</p>
      <pre>{JSON.stringify(atdRecord, null, 2)}</pre>

      {atdRecord.map((record) => (
        <div key={record.id} className="border p-4 my-2">
          <p>
            <strong>Student Name:</strong> {record.users?.full_name}
          </p>
          <p>
            <strong>Matric Number:</strong>{" "}
            {record.users?.students_registry?.matric_number}
          </p>
          <p>
            <strong>Department:</strong>{" "}
            {record.users?.students_registry?.department}
          </p>
        </div>
      ))}

      {nowNow >= classStart && nowNow <= classEnd && (
        <button>Download Report</button>
      )}
    </div>
  );
}
