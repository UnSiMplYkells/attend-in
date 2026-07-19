import "./globals.css";
import Providers from "./providers";
import ThemeScript from "./themeScript";

const site_url =
  process.env.NEXT_PUBLIC_SITE_URL || "https://atttendin.netlify.app";

export const metadata = {
  metadataBase: new URL(site_url),
  title: {
    default: "Attend•in",
    template: `%s | Attend•in`,
  },
  description: "Attendance taking reimagined",
  openGraph: {
    title: "Attend•in",
    description: "Attendance taking reimagined",
    url: site_url,
    siteName: "Attend•in",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Attend•in",
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeScript />
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: site_url,
              name: "Attend•in",
              potentialAction: {
                "@type": "SearchAction",
                target: `${site_url}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}