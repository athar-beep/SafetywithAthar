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
