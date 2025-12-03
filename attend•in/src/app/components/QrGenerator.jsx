"use client"
import { useState } from "react";
import QRCode from "react-qr-code";

export default function QrGenerator() {

  const [inputValue, setInputValue] = useState("")

  const now = new Date();

  const options = {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };

  const formattedDT = now.toLocaleString("en-GB", options);

  return (
    <div>
      <div
        style={{
          height: "220px",
          margin: "0 auto",
          width: "220px",
          background: "white",
          padding: "16px",
        }}
      >
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={inputValue + " " + formattedDT}
          viewBox={`0 0 256 256`}
        />
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}

// "use client"
// import { useState } from "react";

// // MOCK API FUNCTION (Replace with your real Supabase call)
// // This simulates the Rep clicking "Activate" and the server returning a Session ID
// const createAttendanceSession = async (classId) => {
//   // In reality: await supabase.from('attendance_sessions').insert(...)
//   // The SERVER generates the UUID, not the client.
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         sessionId: "b8259-8271-9928", // This comes from DB
//         classId: classId
//       });
//     }, 1000);
//   });
// };

// export default function AdminDashboard() {
//   const [loading, setLoading] = useState(false);
//   const [qrData, setQrData] = useState(null);

//   const handleActivateClass = async () => {
//     setLoading(true);
//     // 1. We start the session on the server
//     const session = await createAttendanceSession("CS101");
    
//     // 2. We construct the STRICT JSON payload
//     const payload = {
//       type: "uni_attendance",
//       sid: session.sessionId,
//       cid: session.classId
//     };
    
//     // 3. We set the QR code to this stringified JSON
//     setQrData(JSON.stringify(payload));
//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col items-center gap-6 p-8">
//       <h2 className="text-2xl font-bold">Class Rep Dashboard</h2>

//       <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
//         {/* Only show QR if data exists */}
//         {qrData ? (
//           <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
//             {/* Using a standard API for QR generation to avoid missing package errors */}
//             <img 
//               src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrData)}`}
//               alt="Class Attendance QR Code"
//               style={{ height: "auto", maxWidth: "100%", width: "100%" }}
//             />
//           </div>
//         ) : (
//           <div className="h-64 w-64 bg-gray-100 flex items-center justify-center text-gray-400">
//             No Active Session
//           </div>
//         )}
//       </div>

//       <div className="text-center">
//         {!qrData ? (
//           <button
//             onClick={handleActivateClass}
//             disabled={loading}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? "Activating..." : "Activate 'Intro to Computers'"}
//           </button>
//         ) : (
//           <div className="text-green-600 font-bold">
//             Class Active! Students can scan now.
//           </div>
//         )}
//       </div>
      
//       {/* Debugging: Show what is actually inside the QR code */}
//       {qrData && (
//         <code className="text-xs bg-gray-100 p-2 rounded">
//           Encoded Data: {qrData}
//         </code>
//       )}
//     </div>
//   );
// }
