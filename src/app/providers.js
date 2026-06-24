// "use client";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";
// import { Toaster } from "react-hot-toast";

// export default function Providers({ children }) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 60 * 1000,
//           },
//         },
//       })
//   );

//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//       <Toaster
//         position="top-center"
//         toastOptions={{
//           duration: 4000,
//           style: { background: "#333", color: "#fff" },
//         }}
//       />
//     </QueryClientProvider>
//   );
// }

"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Create client exactly once per session
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}