
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactRequest = await req.json();

    // Send confirmation email to the person who submitted the form
    const confirmationEmail = await resend.emails.send({
      from: "BabyBaby <onboarding@resend.dev>", // Update with your verified domain when ready
      to: [email],
      subject: "Nous avons reçu votre message",
      html: `
        <h1>Merci de nous avoir contacté, ${name}!</h1>
        <p>Nous avons bien reçu votre message concernant "${subject}" et nous vous répondrons dans les plus brefs délais.</p>
        <p>Pour référence, voici votre message:</p>
        <blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0ea5e9;">${message}</blockquote>
        <p>Cordialement,<br>L'équipe BabyBaby</p>
      `,
    });

    // Send notification email to the admin/organization
    const notificationEmail = await resend.emails.send({
      from: "BabyBaby <onboarding@resend.dev>", // Update with your verified domain when ready
      to: ["contact@babybaby.org"], // Replace with your actual email
      subject: `Nouveau message de contact: ${subject}`,
      html: `
        <h1>Nouveau message de contact</h1>
        <p><strong>De:</strong> ${name} (${email})</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0ea5e9;">${message}</blockquote>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);
    console.log("Notification email sent:", notificationEmail);

    return new Response(
      JSON.stringify({
        message: "Emails sent successfully!",
        confirmation: confirmationEmail,
        notification: notificationEmail,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
