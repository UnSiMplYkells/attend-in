import "./globals.css";
import Providers from "./providers";
import ThemeScript from "./themeScript";

export const metadata = {
  title: "Attend•in",
  description: "Attendance taking reimagined",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className="no-scrollbar bg-theme text-theme"> */}
      <body>
        <ThemeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}