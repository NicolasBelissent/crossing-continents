import { Resend } from 'resend';
import { emailTemplates } from '../lib/emails';

interface Env {
  RESEND_API_KEY: string;
  SUBSCRIBERS_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return new Response('Invalid unsubscribe link', { status: 400 });
    }

    // Get subscriber data
    const subscriberData = await env.SUBSCRIBERS_KV.get(email);

    if (!subscriberData) {
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Already Unsubscribed</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
              .container { text-align: center; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; }
              h1 { color: #333; }
              p { color: #666; line-height: 1.6; }
              a { color: #000; text-decoration: none; border: 2px solid #000; padding: 10px 20px; display: inline-block; margin-top: 20px; border-radius: 5px; }
              a:hover { background: #000; color: #fff; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Already Unsubscribed</h1>
              <p>This email address is not in our subscriber list.</p>
              <a href="/">Return to Homepage</a>
            </div>
          </body>
        </html>`,
        {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }

    // Remove from KV
    await env.SUBSCRIBERS_KV.delete(email);

    // Send unsubscribe confirmation email
    const resend = new Resend(env.RESEND_API_KEY);
    const unsubEmail = emailTemplates.unsubscribeConfirmation(email);

    try {
      await resend.emails.send({
        from: 'Crossing Continents <onboarding@resend.dev>',
        to: email,
        subject: unsubEmail.subject,
        html: unsubEmail.html,
      });
    } catch (emailError) {
      console.error('Failed to send unsubscribe confirmation:', emailError);
      // Continue even if email fails
    }

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed Successfully</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .container { text-align: center; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; }
            h1 { color: #333; }
            p { color: #666; line-height: 1.6; }
            a { color: #000; text-decoration: none; border: 2px solid #000; padding: 10px 20px; display: inline-block; margin-top: 20px; border-radius: 5px; }
            a:hover { background: #000; color: #fff; }
            .emoji { font-size: 48px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="emoji">👋</div>
            <h1>Successfully Unsubscribed</h1>
            <p>You've been removed from our mailing list.</p>
            <p>We're sorry to see you go, but we understand.</p>
            <p>If you change your mind, you're always welcome back!</p>
            <a href="/">Return to Homepage</a>
          </div>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response('Failed to unsubscribe. Please try again later.', {
      status: 500,
    });
  }
};
