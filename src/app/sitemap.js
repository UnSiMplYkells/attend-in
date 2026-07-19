import { createClient } from "@/app/utils/supabase/server";

const site_url =
  process.env.NEXT_PUBLIC_SITE_URL || "https://atttendin.netlify.app";

async function getAllPublicEvents() {
  // Supabase client is already initialized using environment variables
  // in the createClient function.
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("general_events")
      .select("id, created_at")
      .eq("is_active", true);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching public events for sitemap:", error);
    return [];
  }
}

export default async function sitemap() {
  const staticRoutes = [
    { url: `${site_url}/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${site_url}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site_url}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${site_url}/features`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  const events = await getAllPublicEvents();
  const dynamicRoutes = events.map((event) => ({
    url: `${site_url}/general/records/${event.id}`,
    lastModified: new Date(event.created_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}