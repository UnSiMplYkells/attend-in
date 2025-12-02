// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// console.log("Hello from Functions!")

// Deno.serve(async (req) => {
//   const { name } = await req.json()
//   const data = {
//     message: `Hello ${name}!`,
//   }

//   return new Response(
//     JSON.stringify(data),
//     { headers: { "Content-Type": "application/json" } },
//   )
// })

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/


import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import { Resend } from "https://esm.sh/resend";

// Initialize Resend with your API key from environment variables
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

console.log("send-email function starting...");

// Define the expected structure of the request payload
interface EmailRequest {
  email: string;
  subject: string;
  message: string;
  order_items?: { name: string; quantity: number; image: string }[];
}

serve(async (req) => {
  try {
    // Parse the JSON payload sent from your database trigger
    const { email, subject, message, order_items }: EmailRequest = await req.json();

    // Build HTML content for order items if provided
    let itemsHTML = '';
    if (order_items && Array.isArray(order_items)) {
      itemsHTML = `<ul style="list-style: none; padding: 0;">`;
      for (const item of order_items) {
        itemsHTML += `<li style="margin-bottom: 10px;">
          <strong>${item.name}</strong> - Quantity: ${item.quantity}<br/>
          <img src="${item.image}" alt="${item.name}" style="max-width:100px;"/>
        </li>`;
      }
      itemsHTML += `</ul>`;
    }

    // Combine the main message with the order items HTML
    const fullMessage = `<p>${message}</p>${itemsHTML}`;

    // Send the email using Resend
    const result = await resend.emails.send({
      from: "no-reply@yourdomain.com", // Replace with your verified sender email
      to: email,
      subject: subject,
      html: fullMessage,
    });

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});

