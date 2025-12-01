# Email System Usage Guide

Your subscription system now has professional email templates for all scenarios! 🎉

## Email Templates

### 1. Welcome Email (Automatic)
Sent automatically when someone subscribes via the form.

**Features:**
- Welcome message with adventure theme
- List of what to expect
- Explore content button
- Unsubscribe link

### 2. New Blog Notification
Send this when you publish a new blog post.

**Usage:**
```bash
curl -X POST https://your-site.pages.dev/api/notify-blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Adventures in Tokyo: A 7-Day Journey",
    "description": "Join us as we explore the vibrant streets of Tokyo, from bustling Shibuya to peaceful temples.",
    "url": "https://your-site.pages.dev/blog/tokyo-adventure",
    "secret": "c37e291c1efe9015596a054544bee1274a98dfa9adb83546a754cbe8b84b48c1"
  }'
```

### 3. New Video Notification
Send this when you publish a new video.

**Usage:**
```bash
curl -X POST https://your-site.pages.dev/api/notify-video \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Crossing the Alps: Epic Road Trip",
    "description": "Watch as we drive through the stunning Alpine passes, featuring breathtaking views and local cuisine.",
    "url": "https://your-site.pages.dev/#videos",
    "secret": "c37e291c1efe9015596a054544bee1274a98dfa9adb83546a754cbe8b84b48c1"
  }'
```

### 4. Unsubscribe (Automatic)
Sent automatically when someone clicks the unsubscribe link.

**Features:**
- Confirmation of unsubscription
- Friendly goodbye message
- Option to resubscribe

## Production Setup

### 1. Add Environment Variables to Cloudflare Pages

Go to your Pages project > Settings > Environment variables and add:

```
RESEND_API_KEY=your_resend_api_key
ADMIN_SECRET=c37e291c1efe9015596a054544bee1274a98dfa9adb83546a754cbe8b84b48c1
```

### 2. Update Email "From" Address

Once you verify your domain in Resend:

1. Edit `functions/api/subscribe.ts:43`
2. Edit `functions/api/unsubscribe.ts:61`
3. Edit `functions/api/notify-blog.ts:68`
4. Edit `functions/api/notify-video.ts:68`

Change from:
```typescript
from: 'Crossing Continents <onboarding@resend.dev>'
```

To:
```typescript
from: 'Crossing Continents <hello@yourdomain.com>'
```

### 3. Update Website URL

Edit `functions/lib/emails.ts` and replace `crossing-continents.pages.dev` with your actual domain.

## Automating Notifications

### Option 1: Manual (Using curl)
Copy the curl commands above and run them when you publish new content.

### Option 2: GitHub Actions
Create `.github/workflows/notify-subscribers.yml`:

```yaml
name: Notify Subscribers

on:
  workflow_dispatch:
    inputs:
      type:
        description: 'Type of notification'
        required: true
        type: choice
        options:
          - blog
          - video
      title:
        description: 'Content title'
        required: true
      description:
        description: 'Content description'
        required: true
      url:
        description: 'Content URL'
        required: true

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send notification
        run: |
          curl -X POST https://your-site.pages.dev/api/notify-${{ inputs.type }} \
            -H "Content-Type: application/json" \
            -d '{
              "title": "${{ inputs.title }}",
              "description": "${{ inputs.description }}",
              "url": "${{ inputs.url }}",
              "secret": "${{ secrets.ADMIN_SECRET }}"
            }'
```

### Option 3: Astro Build Hook
Add to your blog post creation script to automatically notify on new posts.

## Email Template Customization

All templates are in `functions/lib/emails.ts`. You can customize:
- Colors and styling
- Content and messaging
- Button text and links
- Subject lines

The emails are designed to be:
- ✅ Mobile responsive
- ✅ Professional looking
- ✅ On-brand with your site
- ✅ CAN-SPAM compliant (includes unsubscribe)

## Testing Locally

```bash
npm run dev
```

Then test subscription at http://localhost:4321

To test notifications:
```bash
curl -X POST http://localhost:8788/api/notify-blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog",
    "description": "Testing the email system",
    "url": "https://example.com",
    "secret": "c37e291c1efe9015596a054544bee1274a98dfa9adb83546a754cbe8b84b48c1"
  }'
```

## Monitoring

View your email activity in the Resend dashboard:
- https://resend.com/emails

Check subscribers in Cloudflare KV:
- Go to Workers & Pages > KV > SUBSCRIBERS_KV

## Support

If emails aren't sending:
1. Check RESEND_API_KEY is correct
2. Verify domain in Resend if using custom domain
3. Check Resend dashboard for error logs
4. Ensure you haven't exceeded free tier limits (3,000/month)
