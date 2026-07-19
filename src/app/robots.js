const site_url =
  process.env.NEXT_PUBLIC_SITE_URL || "https://atttendin.netlify.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/profile/",
          "/attendance/",
          "/class-rep/",
          "/general/dashboard/",
          "/general/profile/",
        ],
      },
    ],
    sitemap: `${site_url}/sitemap.xml`,
  };
}