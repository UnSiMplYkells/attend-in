import "./globals.css";
import Providers from "./providers";
import ThemeScript from "./themeScript";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Attend•in",
  description: "Created by Kells",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeScript />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}