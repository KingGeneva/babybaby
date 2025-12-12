import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// HTML escaping to prevent injection attacks in emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Server-side input validation
function validateInput(data: ContactRequest): { valid: boolean; error?: string } {
  const { name, email, subject, message } = data;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: "Name is required" };
  }
  if (name.length > 100) {
    return { valid: false, error: "Name must be less than 100 characters" };
  }
  
  if (!email || typeof email !== 'string') {
    return { valid: false, error: "Email is required" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 255) {
    return { valid: false, error: "Invalid email address" };
  }
  
  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    return { valid: false, error: "Subject is required" };
  }
  if (subject.length > 200) {
    return { valid: false, error: "Subject must be less than 200 characters" };
  }
  
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return { valid: false, error: "Message is required" };
  }
  if (message.length > 2000) {
    return { valid: false, error: "Message must be less than 2000 characters" };
  }
  
  return { valid: true };
}

// Rate limiting check using Supabase
async function checkRateLimit(supabase: any, ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour
  const MAX_REQUESTS = 5; // 5 requests per hour per IP
  
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  
  // Check recent requests from this IP
  const { data: recentRequests, error } = await supabase
    .from('contact_rate_limits')
    .select('created_at')
    .eq('ip_address', ip)
    .gte('created_at', windowStart)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Rate limit check error:", error);
    // If we can't check, allow the request but log the error
    return { allowed: true };
  }
  
  if (recentRequests && recentRequests.length >= MAX_REQUESTS) {
    const oldestInWindow = new Date(recentRequests[recentRequests.length - 1].created_at);
    const retryAfter = Math.ceil((oldestInWindow.getTime() + RATE_LIMIT_WINDOW_MS - Date.now()) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Record this request
  await supabase
    .from('contact_rate_limits')
    .insert({ ip_address: ip });
  
  return { allowed: true };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('cf-connecting-ip') || 
               'unknown';
    
    // Initialize Supabase client for rate limiting
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check rate limit
    const rateLimitResult = await checkRateLimit(supabase, ip);
    if (!rateLimitResult.allowed) {
      console.log(`Rate limit exceeded for IP: ${ip}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json", 
            "Retry-After": String(rateLimitResult.retryAfter || 3600),
            ...corsHeaders 
          },
        }
      );
    }
    
    const requestData = await req.json();
    
    // Server-side validation
    const validation = validateInput(requestData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { name, email, subject, message }: ContactRequest = requestData;
    
    // Escape all user input for safe HTML embedding
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeSubject = escapeHtml(subject.trim());
    const safeMessage = escapeHtml(message.trim());

    // Send confirmation email to the person who submitted the form
    const confirmationEmail = await resend.emails.send({
      from: "BabyBaby <onboarding@resend.dev>",
      to: [email.trim()],
      subject: "Nous avons reçu votre message",
      html: `
        <h1>Merci de nous avoir contacté, ${safeName}!</h1>
        <p>Nous avons bien reçu votre message concernant "${safeSubject}" et nous vous répondrons dans les plus brefs délais.</p>
        <p>Pour référence, voici votre message:</p>
        <blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0ea5e9;">${safeMessage}</blockquote>
        <p>Cordialement,<br>L'équipe BabyBaby</p>
      `,
    });

    // Send notification email to the admin/organization
    const notificationEmail = await resend.emails.send({
      from: "BabyBaby <onboarding@resend.dev>",
      to: ["contact@babybaby.org"],
      subject: `Nouveau message de contact: ${safeSubject}`,
      html: `
        <h1>Nouveau message de contact</h1>
        <p><strong>De:</strong> ${safeName} (${safeEmail})</p>
        <p><strong>Sujet:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0ea5e9;">${safeMessage}</blockquote>
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
      JSON.stringify({ error: "An error occurred while processing your request." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
