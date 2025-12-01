// Email templates for different scenarios

export const emailTemplates = {
  welcome: (email: string) => ({
    subject: 'Welcome to Crossing Continents! 🌍',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 40px 0; }
            .header h1 { font-size: 32px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 14px; color: #666; }
            .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .unsubscribe { font-size: 12px; color: #999; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Crossing Continents</h1>
            </div>
            <div class="content">
              <h2>Welcome Aboard! 🎉</h2>
              <p>Hey there, adventurer!</p>
              <p>Thanks for subscribing to <strong>Crossing Continents</strong>. You're now part of our journey as we share stories, videos, and adventures from around the world.</p>
              <p><strong>What to expect:</strong></p>
              <ul>
                <li>🎥 New video releases and behind-the-scenes content</li>
                <li>📝 Fresh blog posts about our travels and experiences</li>
                <li>✨ Exclusive updates and travel tips</li>
              </ul>
              <p>We promise to keep things interesting and won't spam your inbox. Only the good stuff!</p>
              <a href="https://crossing-continents.pages.dev" class="button">Explore Our Content</a>
            </div>
            <div class="footer">
              <p>Happy travels!</p>
              <p><strong>The Crossing Continents Team</strong></p>
              <div class="unsubscribe">
                <p>Not interested anymore? <a href="{{unsubscribe_url}}">Unsubscribe here</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  newBlog: (blogTitle: string, blogDescription: string, blogUrl: string, email: string) => ({
    subject: `📝 New Post: ${blogTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; }
            .header h1 { font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .blog-title { font-size: 28px; margin-bottom: 15px; color: #000; }
            .blog-description { font-size: 16px; color: #666; margin-bottom: 20px; }
            .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 14px; color: #666; }
            .unsubscribe { font-size: 12px; color: #999; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Crossing Continents</h1>
            </div>
            <div class="content">
              <p style="color: #999; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">New Blog Post</p>
              <h2 class="blog-title">${blogTitle}</h2>
              <p class="blog-description">${blogDescription}</p>
              <p>We just published a new story that we think you'll love. Grab a coffee and dive in!</p>
              <a href="${blogUrl}" class="button">Read the Full Post →</a>
            </div>
            <div class="footer">
              <p>Thanks for being part of our journey!</p>
              <p><strong>The Crossing Continents Team</strong></p>
              <div class="unsubscribe">
                <p>Not interested anymore? <a href="{{unsubscribe_url}}">Unsubscribe here</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  newVideo: (videoTitle: string, videoDescription: string, videoUrl: string, email: string) => ({
    subject: `🎥 New Video: ${videoTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; }
            .header h1 { font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .video-title { font-size: 28px; margin-bottom: 15px; color: #000; }
            .video-description { font-size: 16px; color: #666; margin-bottom: 20px; }
            .button { display: inline-block; padding: 12px 30px; background: #e5302d; color: #fff !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 14px; color: #666; }
            .unsubscribe { font-size: 12px; color: #999; margin-top: 20px; }
            .video-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Crossing Continents</h1>
            </div>
            <div class="content">
              <div class="video-icon">🎥</div>
              <p style="color: #999; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">New Video</p>
              <h2 class="video-title">${videoTitle}</h2>
              <p class="video-description">${videoDescription}</p>
              <p>We just dropped a new video! Grab some popcorn and check it out.</p>
              <a href="${videoUrl}" class="button">Watch Now →</a>
            </div>
            <div class="footer">
              <p>Thanks for watching and supporting our journey!</p>
              <p><strong>The Crossing Continents Team</strong></p>
              <div class="unsubscribe">
                <p>Not interested anymore? <a href="{{unsubscribe_url}}">Unsubscribe here</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  unsubscribeConfirmation: (email: string) => ({
    subject: 'You\'ve been unsubscribed from Crossing Continents',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; }
            .header h1 { font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; padding: 20px; font-size: 14px; color: #666; }
            .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Crossing Continents</h1>
            </div>
            <div class="content">
              <h2>You've been unsubscribed 😢</h2>
              <p>We're sad to see you go, but we understand.</p>
              <p>You won't receive any more emails from us at <strong>${email}</strong>.</p>
              <p>Changed your mind?</p>
              <a href="https://crossing-continents.pages.dev" class="button">Subscribe Again</a>
            </div>
            <div class="footer">
              <p>Safe travels wherever you go!</p>
              <p><strong>The Crossing Continents Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

// Helper function to add unsubscribe URL to email
export function addUnsubscribeUrl(html: string, email: string): string {
  const unsubscribeUrl = `https://crossing-continents.pages.dev/api/unsubscribe?email=${encodeURIComponent(email)}`;
  return html.replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrl);
}
