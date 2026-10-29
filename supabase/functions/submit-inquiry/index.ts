// Supabase Edge Function: submit-inquiry
// Validates visitor inquiry, writes to `public.inquiries` using service role key,
// and triggers Resend notification email to muhammadatharhse@gmail.com.

export interface SubmitInquiryPayload {
  name: string;
  email: string;
  service: 'cold_email' | 'hse_docs';
  packageTier: 'basic' | 'standard' | 'premium' | 'custom';
  message: string;
  honeypot?: string;
  pageSource?: string;
  idempotencyKey?: string;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ---------------------------------------------------------------------------
// Handler (added 2026-10-29 to complete this function for the GitHub Pages
// edition — mirrors the Express POST /api/inquiries behaviour in server.ts:
// same validation rules, same response shape { inquiryId, outcome }, and the
// inquiry is saved even when email notification is not configured.)
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_SERVICES = ['cold_email', 'hse_docs'];
const VALID_PACKAGES = ['basic', 'standard', 'premium', 'custom'];

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  let payload: SubmitInquiryPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  if ((payload.honeypot ?? '').trim().length > 0) {
    return json(
      { error: 'Unable to process submission at this time. Please try again later.' },
      429
    );
  }

  const name = (payload.name ?? '').trim();
  const email = (payload.email ?? '').trim().toLowerCase();
  const service = (payload.service ?? '').trim();
  const packageTier = (payload.packageTier ?? '').trim();
  const message = (payload.message ?? '').trim();
  const pageSource = (payload.pageSource ?? '/safetywithathar/').trim();
  const idempotencyKey =
    (payload.idempotencyKey ?? '').trim() ||
    `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2 || name.length > 100) fieldErrors.name = 'Invalid name.';
  if (!EMAIL_REGEX.test(email) || email.length > 160) fieldErrors.email = 'Invalid email.';
  if (!VALID_SERVICES.includes(service)) fieldErrors.service = 'Invalid service.';
  if (!VALID_PACKAGES.includes(packageTier)) fieldErrors.packageTier = 'Invalid package.';
  if (message.length < 20 || message.length > 3000) fieldErrors.message = 'Invalid message.';
  if (Object.keys(fieldErrors).length > 0) {
    return json({ error: 'Please check the highlighted form fields.', fieldErrors }, 400);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'Backend is not configured.' }, 500);
  }
  const restHeaders = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  const insertRes = await fetch(`${supabaseUrl}/rest/v1/inquiries`, {
    method: 'POST',
    headers: { ...restHeaders, Prefer: 'return=representation' },
    body: JSON.stringify({
      name,
      email,
      service,
      package: packageTier,
      message,
      page_source: pageSource,
      idempotency_token: idempotencyKey,
      notification_status: 'pending',
    }),
  });

  if (insertRes.status === 409) {
    // Duplicate submission with the same idempotency key: return the original.
    const existingRes = await fetch(
      `${supabaseUrl}/rest/v1/inquiries?idempotency_token=eq.${encodeURIComponent(idempotencyKey)}&select=id,notification_status`,
      { headers: restHeaders }
    );
    const existing = existingRes.ok ? await existingRes.json() : [];
    if (Array.isArray(existing) && existing.length > 0) {
      return json(
        {
          inquiryId: existing[0].id,
          outcome:
            existing[0].notification_status === 'sent'
              ? 'saved_and_emailed'
              : 'saved_email_unconfirmed',
          deduplicated: true,
        },
        200
      );
    }
    return json({ error: 'Duplicate submission.' }, 409);
  }

  if (!insertRes.ok) {
    return json({ error: 'Could not save inquiry.' }, 500);
  }
  const inserted = await insertRes.json();
  const inquiryId: string = inserted[0].id;

  // Optional email notification via Resend (same behaviour as server.ts:
  // only attempted when a real API key and a real From address are set).
  const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? '';
  const resendFrom = Deno.env.get('RESEND_FROM_EMAIL') ?? '';
  const notifyEmail =
    Deno.env.get('INQUIRY_NOTIFY_EMAIL') ?? 'muhammadatharhse@gmail.com';
  let notificationStatus: 'sent' | 'failed_or_unconfigured' = 'failed_or_unconfigured';
  let notificationErrorCode: string | null = 'RESEND_NOT_CONFIGURED';
  let notifiedAt: string | null = null;

  if (
    resendApiKey &&
    resendFrom &&
    !resendFrom.includes('your-verified-domain.com')
  ) {
    try {
      const serviceLabel =
        service === 'cold_email'
          ? 'Cold Email Infrastructure Setup'
          : 'HSE Documentation';
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [notifyEmail],
          reply_to: email,
          subject: `New Inquiry — SafetyWithAthar — ${serviceLabel} — ${name}`,
          text: [
            'New Inquiry — SafetyWithAthar',
            `Name: ${name}`,
            `Email: ${email}`,
            `Service: ${serviceLabel} (${service})`,
            `Package: ${packageTier}`,
            `Page Source: ${pageSource}`,
            '',
            'Message:',
            message,
          ].join('\n'),
        }),
      });
      if (emailRes.ok) {
        notificationStatus = 'sent';
        notificationErrorCode = null;
        notifiedAt = new Date().toISOString();
      } else {
        notificationErrorCode = `RESEND_HTTP_${emailRes.status}`;
      }
    } catch {
      notificationErrorCode = 'RESEND_NETWORK_ERROR';
    }
  }

  await fetch(`${supabaseUrl}/rest/v1/inquiries?id=eq.${inquiryId}`, {
    method: 'PATCH',
    headers: { ...restHeaders, Prefer: 'return=minimal' },
    body: JSON.stringify({
      notification_status: notificationStatus,
      notification_error_code: notificationErrorCode,
      notified_at: notifiedAt,
    }),
  });

  return json(
    {
      inquiryId,
      outcome:
        notificationStatus === 'sent' ? 'saved_and_emailed' : 'saved_email_unconfirmed',
    },
    201
  );
});
