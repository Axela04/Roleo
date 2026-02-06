import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 8080),
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3000'
};
