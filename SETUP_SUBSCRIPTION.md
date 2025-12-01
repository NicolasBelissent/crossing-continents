# Subscription Setup Guide

This project uses **Resend** for email delivery and **Cloudflare KV** for storing subscribers.

## 1. Get Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (free tier: 3,000 emails/month)
2. Create an API key at https://resend.com/api-keys
3. Copy your API key (starts with `re_`)

## 2. Local Development Setup

1. Create a `.dev.vars` file in the project root:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. Add your Resend API key to `.dev.vars`:
   ```
   RESEND_API_KEY=re_your_actual_api_key
   ```

3. Create a KV namespace for local development:
   ```bash
   npx wrangler kv:namespace create SUBSCRIBERS_KV --preview
   ```

4. Add the KV binding to `wrangler.toml`:
   ```toml
   [[kv_namespaces]]
   binding = "SUBSCRIBERS_KV"
   id = "your_kv_id_here"
   preview_id = "your_preview_kv_id_here"
   ```

## 3. Production Setup (Cloudflare Pages)

1. Create KV namespace in Cloudflare dashboard:
   - Go to Workers & Pages > KV
   - Create namespace: `joint_blog_subscribers`

2. Add environment variables in Cloudflare Pages:
   - Go to your Pages project > Settings > Environment variables
   - Add `RESEND_API_KEY` = your Resend API key

3. Bind KV namespace to your Pages project:
   - Go to Settings > Functions
   - Add KV namespace binding: `SUBSCRIBERS_KV` → select your namespace

## 4. Verify Domain (Optional but Recommended)

To send emails from your own domain instead of `onboarding@resend.dev`:

1. Go to Resend Dashboard > Domains
2. Add your domain
3. Add the DNS records provided by Resend
4. Update `functions/api/subscribe.ts` line 40:
   ```typescript
   from: 'Your Name <hello@yourdomain.com>',
   ```

## 5. Test Your Setup

After deployment, test the subscription:
```bash
curl -X POST https://your-site.pages.dev/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

You should receive a welcome email at the test address.

## Viewing Subscribers

You can view subscribers in the Cloudflare dashboard under KV or create an admin API endpoint to list them.
