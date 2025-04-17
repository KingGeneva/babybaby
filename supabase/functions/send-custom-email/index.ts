
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CustomEmailRequest {
  email: string;
  type: 'signup' | 'magiclink' | 'invite' | 'recovery';
  meta?: {
    name?: string;
    action_link?: string;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: CustomEmailRequest = await req.json();
    const { email, type, meta } = data;

    if (!email) {
      throw new Error("Email address is required");
    }

    let emailSubject = "";
    let emailContent = "";

    // Déterminer le contenu de l'email en fonction du type
    switch(type) {
      case 'signup':
        emailSubject = "Bienvenue sur BabyBaby - Confirmation de votre compte";
        emailContent = getSignupEmailTemplate(meta?.name || "", meta?.action_link || "");
        break;
      case 'magiclink':
        emailSubject = "BabyBaby - Votre lien de connexion";
        emailContent = getMagicLinkEmailTemplate(meta?.action_link || "");
        break;
      case 'recovery':
        emailSubject = "BabyBaby - Récupération de votre mot de passe";
        emailContent = getRecoveryEmailTemplate(meta?.action_link || "");
        break;
      case 'invite':
        emailSubject = "BabyBaby - Vous avez été invité à rejoindre l'espace parental";
        emailContent = getInviteEmailTemplate(meta?.action_link || "");
        break;
      default:
        emailSubject = "BabyBaby - Notification";
        emailContent = getDefaultEmailTemplate();
    }

    const emailResponse = await resend.emails.send({
      from: "BabyBaby <no-reply@resend.dev>",
      to: [email],
      subject: emailSubject,
      html: emailContent,
    });

    console.log("Email personnalisé envoyé avec succès:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erreur dans la fonction send-custom-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function getSignupEmailTemplate(name: string, actionLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bienvenue sur BabyBaby</title>
      <style>
        body { font-family: 'Nunito', sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { font-family: 'Comfortaa', sans-serif; font-size: 28px; color: #0EA5E9; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 10px; }
        .button { display: inline-block; background-color: #0EA5E9; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">BabyBaby</div>
        </div>
        <div class="content">
          <h2>Bienvenue sur BabyBaby${name ? ", " + name : ""}!</h2>
          <p>Merci de vous être inscrit à notre plateforme dédiée au suivi de la croissance de votre bébé.</p>
          <p>Pour confirmer votre adresse email et activer votre compte, veuillez cliquer sur le bouton ci-dessous:</p>
          <div style="text-align: center;">
            <a href="${actionLink}" class="button">Confirmer mon compte</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur:</p>
          <p>${actionLink}</p>
          <p>Ce lien expirera dans 24 heures.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 BabyBaby - Tous droits réservés</p>
          <p>Cet email a été envoyé automatiquement, veuillez ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getMagicLinkEmailTemplate(actionLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Votre lien de connexion BabyBaby</title>
      <style>
        body { font-family: 'Nunito', sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { font-family: 'Comfortaa', sans-serif; font-size: 28px; color: #0EA5E9; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 10px; }
        .button { display: inline-block; background-color: #0EA5E9; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">BabyBaby</div>
        </div>
        <div class="content">
          <h2>Votre lien de connexion</h2>
          <p>Vous avez demandé à vous connecter à BabyBaby. Cliquez sur le bouton ci-dessous pour accéder à votre compte:</p>
          <div style="text-align: center;">
            <a href="${actionLink}" class="button">Se connecter</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur:</p>
          <p>${actionLink}</p>
          <p>Ce lien expirera dans 24 heures. Si vous n'avez pas demandé à vous connecter, vous pouvez ignorer cet email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 BabyBaby - Tous droits réservés</p>
          <p>Cet email a été envoyé automatiquement, veuillez ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getRecoveryEmailTemplate(actionLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Récupération de votre mot de passe BabyBaby</title>
      <style>
        body { font-family: 'Nunito', sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { font-family: 'Comfortaa', sans-serif; font-size: 28px; color: #0EA5E9; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 10px; }
        .button { display: inline-block; background-color: #0EA5E9; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">BabyBaby</div>
        </div>
        <div class="content">
          <h2>Récupération de votre mot de passe</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe:</p>
          <div style="text-align: center;">
            <a href="${actionLink}" class="button">Réinitialiser mon mot de passe</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur:</p>
          <p>${actionLink}</p>
          <p>Ce lien expirera dans 24 heures. Si vous n'avez pas demandé à réinitialiser votre mot de passe, veuillez ignorer cet email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 BabyBaby - Tous droits réservés</p>
          <p>Cet email a été envoyé automatiquement, veuillez ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getInviteEmailTemplate(actionLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invitation BabyBaby</title>
      <style>
        body { font-family: 'Nunito', sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { font-family: 'Comfortaa', sans-serif; font-size: 28px; color: #0EA5E9; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 10px; }
        .button { display: inline-block; background-color: #0EA5E9; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">BabyBaby</div>
        </div>
        <div class="content">
          <h2>Vous avez été invité à rejoindre BabyBaby!</h2>
          <p>Une invitation a été envoyée pour vous permettre d'accéder à un espace parental sur BabyBaby, la plateforme de suivi de croissance pour votre bébé.</p>
          <p>Pour accepter cette invitation, veuillez cliquer sur le bouton ci-dessous:</p>
          <div style="text-align: center;">
            <a href="${actionLink}" class="button">Accepter l'invitation</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur:</p>
          <p>${actionLink}</p>
          <p>Cette invitation expirera dans 24 heures.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 BabyBaby - Tous droits réservés</p>
          <p>Cet email a été envoyé automatiquement, veuillez ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getDefaultEmailTemplate(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Notification BabyBaby</title>
      <style>
        body { font-family: 'Nunito', sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { font-family: 'Comfortaa', sans-serif; font-size: 28px; color: #0EA5E9; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 10px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">BabyBaby</div>
        </div>
        <div class="content">
          <h2>Notification</h2>
          <p>Vous recevez cette notification de BabyBaby, votre plateforme de suivi de croissance pour bébés.</p>
          <p>Connectez-vous à votre compte pour en savoir plus.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 BabyBaby - Tous droits réservés</p>
          <p>Cet email a été envoyé automatiquement, veuillez ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Fonction principale qui écoute les requêtes
serve(handler);
