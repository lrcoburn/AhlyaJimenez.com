# notify-commission

Emails ahlyajimenez.artco@gmail.com when a row is inserted into `commission_requests`.

## Setup (Supabase dashboard, no CLI needed)

1. Create a [Resend](https://resend.com) account and an API key. Verify a sending domain, or use the default
   `onboarding@resend.dev` sender, which only delivers to the Resend account owner's own email.
2. **Edge Functions → Deploy a new function → Via Editor**: name it `notify-commission`, paste `index.ts`, deploy.
   Turn **off** "Verify JWT" (requests are authenticated by the shared secret instead).
3. **Edge Functions → Secrets**, add:
   - `RESEND_API_KEY`: your Resend key
   - `WEBHOOK_SECRET`: any long random string
   - `FROM_EMAIL` (optional): e.g. `Equus & Ink <requests@yourdomain.com>`
4. **Database → Webhooks → Create a new hook**: table `commission_requests`, event `Insert`, type
   *Supabase Edge Functions*, function `notify-commission`, and add the HTTP header
   `x-webhook-secret` with the same value as `WEBHOOK_SECRET`.
