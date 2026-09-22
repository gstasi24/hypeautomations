# Booking emails

Every confirmed consultation is emailed to **sales@hypedigitalconsulting.it** and **amman224k@gmail.com**, and the customer gets a confirmation.

The site does not send email itself. After a booking is saved, the server function `createBooking` in `src/lib/booking.functions.ts` POSTs the booking to a webhook. An n8n workflow receives it and sends both emails through Gmail. If the webhook is down or the URL is not set, the booking still succeeds; only the emails are missed (the booking is always in the admin area).

## One-time setup (about 10 minutes)

### 1. Import the workflow into n8n

1. In n8n: **Workflows → Add workflow → ⋯ → Import from file** → choose `n8n/booking-notifications.json`.
2. Open the **Webhook** node → **Credential for Header Auth → Create new**:
   - Name: `x-booking-secret`
   - Value: any long random string (keep it, you need it in step 3).
3. Open **Notify team** → **Credential → Create new Gmail OAuth2** and sign in as **sales@hypedigitalconsulting.it**. Pick the same credential in **Confirm customer**.
   The Gmail node needs a Google Cloud OAuth client the first time; n8n's Gmail credential screen links to the steps.
4. **Save**, then **Activate** the workflow.
5. Copy the **Production URL** from the Webhook node. It looks like `https://<your-n8n>/webhook/hype-booking`.

### 2. Test it from n8n

With the workflow open, click **Test workflow**, then send a sample from a terminal:

```bash
curl -X POST "https://<your-n8n>/webhook-test/hype-booking" \
  -H "content-type: application/json" \
  -H "x-booking-secret: <your secret>" \
  -d '{"id":"test","fullName":"Test Person","email":"you@example.com","phone":"+39 000","company":"Test Co","dateLabel":"Monday, 6 October 2026","timeLabel":"10:00","timezone":"Europe/Rome","automationGoals":["Lead follow-up"],"enquirySources":["Website form"],"tools":["HubSpot"]}'
```

Both team inboxes and `you@example.com` should receive a message.

### 3. Give the site the URL and secret

Set two server-side environment variables wherever the site runs:

| Variable | Value |
|---|---|
| `BOOKING_WEBHOOK_URL` | the production URL from step 1.5 (`/webhook/`, not `/webhook-test/`) |
| `BOOKING_WEBHOOK_SECRET` | the secret from step 1.2 |

- **Lovable:** project → Settings → Cloud → Secrets (server-side, not `VITE_`).
- **Local dev:** add both lines to `.env`.

Nothing else changes. Book a test slot on the site and check the inboxes.

## What the webhook receives

```json
{
  "id": "uuid",
  "slotStart": "2026-10-06T08:00:00.000Z",
  "slotEnd": "2026-10-06T08:30:00.000Z",
  "dateLabel": "Monday, 6 October 2026",
  "timeLabel": "10:00",
  "timezone": "Europe/Rome",
  "visitorTimezone": "Europe/London",
  "fullName": "…", "company": "…", "email": "…", "phone": "…", "website": "…", "notes": "…",
  "businessType": "…",
  "automationGoals": ["…"], "enquirySources": ["…"], "tools": ["…"], "toolsOther": "…"
}
```

Header: `x-booking-secret`. The request times out after 8 s and never blocks the booking.

## Changing recipients or copy

- Recipients: **Notify team** node → *To* (comma-separated).
- Email text: the *Message* field of each Gmail node. Expressions like `{{ $('Webhook').item.json.body.fullName }}` pull from the payload above.
- The customer's reply goes to sales@hypedigitalconsulting.it (Reply-To). The team email's Reply-To is the customer, so replying from the inbox answers them directly.
