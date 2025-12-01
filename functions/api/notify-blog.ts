import { Resend } from 'resend';
import { emailTemplates, addUnsubscribeUrl } from '../lib/emails';

interface Env {
  RESEND_API_KEY: string;
  SUBSCRIBERS_KV: KVNamespace;
  ADMIN_SECRET: string; // Secret to protect this endpoint
}

interface BlogNotification {
  title: string;
  description: string;
  url: string;
  secret: string;
}

// Send notification to all subscribers about a new blog post
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const { title, description, url, secret } = await request.json() as BlogNotification;

    // Validate admin secret
    if (!env.ADMIN_SECRET || secret !== env.ADMIN_SECRET) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate required fields
    if (!title || !description || !url) {
      return new Response(JSON.stringify({ error: 'Missing required fields: title, description, url' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all subscribers from KV
    const list = await env.SUBSCRIBERS_KV.list();
    const subscribers: string[] = [];

    for (const key of list.keys) {
      const data = await env.SUBSCRIBERS_KV.get(key.name);
      if (data) {
        const subscriber = JSON.parse(data);
        if (subscriber.status === 'active') {
          subscribers.push(subscriber.email);
        }
      }
    }

    if (subscribers.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No subscribers found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send emails
    const resend = new Resend(env.RESEND_API_KEY);
    const blogEmail = emailTemplates.newBlog(title, description, url, '');
    let successCount = 0;
    let failCount = 0;

    // Send in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (email) => {
          try {
            await resend.emails.send({
              from: 'Crossing Continents <onboarding@resend.dev>',
              to: email,
              subject: blogEmail.subject,
              html: addUnsubscribeUrl(blogEmail.html, email),
            });
            successCount++;
          } catch (error) {
            console.error(`Failed to send to ${email}:`, error);
            failCount++;
          }
        })
      );
    }

    return new Response(JSON.stringify({
      success: true,
      sent: successCount,
      failed: failCount,
      total: subscribers.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Blog notification error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send notifications' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
