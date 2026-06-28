import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

//Haversine Formula to get distance in metres
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaP = p2 - p1;
  const deltaLon = degToRad(lon2 - lon1);
  const a = Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function degToRad(deg: number) {
  return deg * (Math.PI / 180);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    //authenticates User securely
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error("Unauthorized");

    //get Inputs (Raw GPS + Session ID) from front end
    const { sessionId, latitude, longitude } = await req.json();
    
    if (!latitude || !longitude) throw new Error("GPS Location required");

    //fetches atd sesh data from database
    const { data: sessionData, error: sessionError } = await supabaseClient
      .from('attendance_sessions')
      .select(`
        *,
        classes!inner (
          latitude,
          longitude
        )
      `)
      .eq('id', sessionId)
      .single();

    if (sessionError || !sessionData) throw new Error("Session not found");

    //time Validation with server Time
    const now = new Date();
    const windowStart = new Date(sessionData.window_start);
    const windowEnd = new Date(sessionData.window_end);

    if (now < windowStart || now > windowEnd) {
      throw new Error("Attendance window is closed.");
    }

    //geo-Fencing funciton
    const MAX_DISTANCE = 25; // meters
    const distance = calculateDistance(
      latitude, 
      longitude, 
      sessionData.classes.latitude, 
      sessionData.classes.longitude
    );

    if (distance > MAX_DISTANCE) {
      throw new Error(`You are too far (${Math.round(distance)}m). Move closer to class.`);
    }

    //checks for duplicate Entry
    const { data: existing } = await supabaseClient
      .from('attendance_records')
      .select('id')
      .eq('session_id', sessionId)
      .eq('student_id', user.id)
      .single();
    
    if (existing) throw new Error("Attendance already marked.");

    //insert Record if successful
    const { error: insertError } = await supabaseClient
      .from('attendance_records')
      .insert({
        session_id: sessionId,
        student_id: user.id,
        distance_frm_hall: distance,
        marked_at: new Date().toISOString()
      });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Attendance Marked Successfully!",
      distance: distance 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, 
    })
  }
})