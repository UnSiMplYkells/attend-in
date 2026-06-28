import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { JWT } from 'npm:google-auth-library@^10'
import serviceAccount from '../service-account.json' with { type: 'json' }

interface WebhookPayload {
  type: 'INSERT'
  table: 'attendance_sessions'
  record: { id: string; class_id: string; window_start: string; window_end: string; }
  schema: 'public'
}

Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json()

    // Setup Supabase client bypassing RLS using the internal Service Role Key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch Class Name and all enrolled students' FCM tokens in one query
    const { data: classData, error } = await supabaseAdmin
      .from('classes')
      .select(`
        course_code,
        rosters ( users ( fcm_token ) )
      `)
      .eq('id', payload.record.class_id)
      .single()

    if (error || !classData) {
      console.error("Database Error:", error);
      return new Response("Error fetching class data", { status: 400 });
    }

    const courseCode = classData.course_code;
    
    // Extract tokens from the nested roster data, ignoring nulls
    const tokens = classData.rosters
      .map((r: any) => r.users?.fcm_token)
      .filter((t: string | null) => t !== null && t !== undefined);

    console.log(`Found ${tokens.length} tokens to notify for ${courseCode}`);

    if (tokens.length === 0) {
      console.log("Aborting: No students have push notifications enabled.");
      return new Response("No students to notify", { status: 200 });
    }

    const accessToken = await getAccessToken({
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    });

    // Dynamic Image Avatar generation based on Course Code
    const dynamicIconUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(courseCode)}&background=18127d&color=fff&size=256&font-size=0.30&length=6`;

    // Loop through tokens and send to Google FCM concurrently
    // const promises = tokens.map((token: string) => 
    //   fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //     body: JSON.stringify({
    //       message: {
    //         token: token,
    //         notification: {
    //           title: "Session Started!",
    //           body: `${courseCode} has started.`,
    //         },
    //         webpush: {
    //           headers: {
    //             Urgency: "high"
    //           },
    //           notification: {
    //             icon: dynamicIconUrl
    //           },
    //           fcm_options: {
    //             link: "http://localhost:3000/attendance/scan" //remember to change when deployed
    //           }
    //         },
    //         data: {
    //           link: "/attendance/scan"
    //         }
    //       },
    //     }),
    //   })
    // );
    const promises = tokens.map((token: string) => 
      fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            token: token,
            // 100% Data payload to prevent the double-fire
            data: {
              title: "Session Started!",
              body: `${courseCode} has started.`,
              icon: dynamicIconUrl,
              link: "https://carbon-retro-bent-twelve.trycloudflare.com/attendance/scan"
            }
          },
        }),
      })
    );

    await Promise.all(promises);
    console.log("SUCCESS! Notifications dispatched.");
    
    return new Response(JSON.stringify({ success: true, notified: tokens.length }), { 
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error("Critical Failure in Edge Function:", err);
    return new Response(String(err), { status: 500 });
  }
})

// Authentication Helper for FCM
const getAccessToken = ({ clientEmail, privateKey }: { clientEmail: string, privateKey: string }): Promise<string> => {
  return new Promise((resolve, reject) => {
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    })
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens!.access_token!)
    })
  })
}