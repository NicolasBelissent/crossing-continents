import { Resend } from 'resend';

interface Env {
  RESEND_API_KEY: string;
}

interface ContactForm {
  email: string;
  subject: string;
  message: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const { email, subject, message } = await request.json() as ContactForm;

    // Validate inputs
    if (!email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send email via Resend to both recipients
    const resend = new Resend(env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Crossing Continents <onboarding@resend.dev>',
      to: ['nicolas.belissent@gmail.com', 'cdecau@gmail.com'],
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f5f5f5; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
              .label { font-weight: bold; color: #666; margin-top: 20px; }
              .value { margin-top: 5px; }
              .message-box { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="label">From:</div>
                <div class="value">${email}</div>

                <div class="label">Subject:</div>
                <div class="value">${subject}</div>

                <div class="label">Message:</div>
                <div class="message-box">${message}</div>

                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
                  You can reply directly to this email to respond to ${email}
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
