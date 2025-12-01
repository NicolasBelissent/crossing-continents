import { Resend } from 'resend';
import { emailTemplates, addUnsubscribeUrl } from '../lib/emails';

interface Env {
  RESEND_API_KEY: string;
  SUBSCRIBERS_KV: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const { email } = await request.json() as { email: string };

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if already subscribed
    const existing = await env.SUBSCRIBERS_KV.get(email);
    if (existing) {
      return new Response(JSON.stringify({ error: 'Email already subscribed' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Store in KV
    await env.SUBSCRIBERS_KV.put(email, JSON.stringify({
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    }));

    // Send welcome email via Resend
    const resend = new Resend(env.RESEND_API_KEY);
    const welcomeEmail = emailTemplates.welcome(email);

    await resend.emails.send({
      from: 'Crossing Continents <onboarding@resend.dev>', // Change this to your verified domain
      to: email,
      subject: welcomeEmail.subject,
      html: addUnsubscribeUrl(welcomeEmail.html, email),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(JSON.stringify({ error: 'Failed to subscribe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
