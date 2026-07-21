import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { JWT } from 'npm:google-auth-library@^10'
import serviceAccount from '../service-account.json' with { type: 'json' }

Deno.serve(async (req) => {
  try {
    // 1. Initialize Supabase Admin Bypass
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const now = new Date();
    
    // 2. Fetch active sessions (ended within the last 5 hours)
    const { data: sessions, error: sessionError } = await supabaseAdmin
      .from('attendance_sessions')
      .select(`
        id, 
        class_id, 
        window_start, 
        window_end,
        classes ( course_code )
      `)
      .gte('window_end', new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString());

    if (sessionError) throw new Error(sessionError.message);
    if (!sessions || sessions.length === 0) return new Response("No active sessions", { status: 200 });

    const accessToken = await getAccessToken(serviceAccount.client_email, serviceAccount.private_key);
    const notificationsToSend: any[] = [];

    // 3. Process each session based on the rules
    for (const session of sessions) {
      const winStart = new Date(session.window_start);
      const winEnd = new Date(session.window_end);
      const courseCode = session.classes?.course_code || "Class";
      const dynamicIconUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(courseCode)}&background=4f46e5&color=fff&size=256&font-size=0.30&length=6`;

      // Time boundaries for checking (1 minute intervals so cron doesn't miss them or duplicate them)
      const isNowActive = now >= winStart && now < new Date(winStart.getTime() + 60000);
      const isFiveMinWarning = now >= new Date(winEnd.getTime() - 300000) && now < new Date(winEnd.getTime() - 240000);
      const isEnded = now >= winEnd && now < new Date(winEnd.getTime() + 60000);

      // If no time boundary matches right now, skip to the next session to save database queries
      if (!isNowActive && !isFiveMinWarning && !isEnded) continue;

      // 4. Fetch the Roster and FCM Tokens for this specific class
      const { data: rosterData } = await supabaseAdmin
        .from('rosters')
        .select(`student_id, users ( fcm_token )`)
        .eq('class_id', session.class_id);

      if (!rosterData || rosterData.length === 0) continue;

      let title = "";
      let body = "";
      let link = "https://atttendin.netlify.app/attendance/scan"; // Changed to full URL for background clicks
      let targetTokens: string[] = [];

      // Rule 2: Window Started
      if (isNowActive) {
        title = "Attendance Open ✅";
        body = `${courseCode} attendance taking is now active.`;
        targetTokens = rosterData.map((r: any) => r.users?.fcm_token).filter(Boolean);
      } 
      // Rule 3: 5 Minutes Left (Checking against signed records)
      else if (isFiveMinWarning) {
        title = "5 Minutes Left!!";
        body = `5 minutes left to sign attendance for ${courseCode}. Go and sign now!`;
        
        // Fetch who has ALREADY signed for this specific session
        const { data: recordsData } = await supabaseAdmin
          .from('attendance_records')
          .select('student_id')
          .eq('session_id', session.id);
          
        const signedStudentIds = recordsData ? recordsData.map((rec: any) => rec.student_id) : [];
        
        // Filter out the students who already signed
        targetTokens = rosterData
          .filter((r: any) => !signedStudentIds.includes(r.student_id))
          .map((r: any) => r.users?.fcm_token)
          .filter(Boolean);
      } 
      // Rule 4: Window Ended
      else if (isEnded) {
        title = "Attendance Closed ⛔";
        body = `Attendance has ended for ${courseCode}.`;
        link = ""; // Route somewhere else since scan is closed
        targetTokens = rosterData.map((r: any) => r.users?.fcm_token).filter(Boolean);
      }

      // 5. Queue up the network requests to Google FCM
      // if (targetTokens.length > 0 && title !== "") {
      //   targetTokens.forEach(token => {
      //     notificationsToSend.push(
      //       fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
      //         method: 'POST',
      //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      //         body: JSON.stringify({
      //           message: { 
      //             token, 
      //             notification: { title, body }, 
      //             webpush: { 
      //               headers: { Urgency: "high" }, // Force browser to wake up
      //               notification: { icon: dynamicIconUrl },
      //               fcm_options: { link: link } // Clickable background link
      //             }, 
      //             data: { link: link.replace("http://localhost:3000", "") } // Relative link for foreground React
      //           }
      //         }),
      //       })
      //     );
      //   });
      // }
      if (targetTokens.length > 0 && title !== "") {
        targetTokens.forEach(token => {
          notificationsToSend.push(
            fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
              body: JSON.stringify({
                message: { 
                  token: token,
                  // We ONLY use 'data' now. No 'notification' block.
                  data: { 
                    title: title,
                    body: body,
                    icon: dynamicIconUrl,
                    link: link === "https://atttendin.netlify.app/attendance/scan" 
                          ? "https://atttendin.netlify.app/attendance/scan" 
                          : link // Update default link to your new Cloudflare URL
                  } 
                }
              }),
            })
          );
        });
      }
    }

    // Fire all notifications concurrently
    await Promise.all(notificationsToSend);
    console.log(`Cron execution finished. Dispatched ${notificationsToSend.length} notifications.`);
    return new Response(JSON.stringify({ success: true, sent: notificationsToSend.length }), { status: 200, headers: { 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error("Critical Failure:", err);
    return new Response(String(err), { status: 500 });
  }
})

// FCM Auth Helper
const getAccessToken = (clientEmail: string, privateKey: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    })
    jwtClient.authorize((err, tokens) => {
      if (err) reject(err)
      else resolve(tokens!.access_token!)
    })
  })
}