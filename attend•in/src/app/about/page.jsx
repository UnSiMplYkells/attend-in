import { createClient } from "@/app/utils/supabase/server";

export default async function about() {
  const supabase = await createClient();
  const { data: students } = await supabase.from("students_registry").select();

  return <pre>{JSON.stringify(students, null, 2)}</pre>;
}
