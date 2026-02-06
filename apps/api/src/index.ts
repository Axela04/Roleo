import Fastify from 'fastify';
import cors from '@fastify/cors';
import Stripe from 'stripe';
import { z } from 'zod';
import { config } from './config.js';
import { requireUser } from './auth.js';
import { supabaseAdmin } from './supabase.js';

const app = Fastify({ logger: true });
const stripe = new Stripe(config.stripeSecretKey);
await app.register(cors, { origin: true });

app.get('/health', async () => ({ ok: true }));

app.get('/v1/me', async (request, reply) => {
  try {
    const user = await requireUser(request);
    const [{ data: profile }, { data: subscription }] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabaseAdmin.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle()
    ]);
    return { user, profile, subscription };
  } catch {
    return reply.status(401).send({ error: 'unauthorized' });
  }
});

app.put('/v1/profile', async (request, reply) => {
  try {
    const user = await requireUser(request);
    const body = z.object({
      full_name: z.string(),
      summary: z.string().optional(),
      skills: z.array(z.string()).default([])
    }).parse(request.body);
    const { data, error } = await supabaseAdmin.from('profiles').upsert({ user_id: user.id, ...body }).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    request.log.error(error);
    return reply.status(400).send({ error: 'invalid request' });
  }
});

app.post('/v1/jobs/import-manual', async (request, reply) => {
  try {
    const user = await requireUser(request);
    const body = z.object({ title: z.string(), company: z.string(), location: z.string().optional(), description: z.string() }).parse(request.body);
    const { data: company } = await supabaseAdmin.from('companies').upsert({ name: body.company }, { onConflict: 'name' }).select().single();
    const { data, error } = await supabaseAdmin.from('jobs').insert({
      company_id: company?.id,
      source: 'manual_import',
      source_id: crypto.randomUUID(),
      title: body.title,
      location: body.location,
      description: body.description,
      imported_by_user_id: user.id
    }).select().single();
    if (error) throw error;
    await supabaseAdmin.from('audit_logs').insert({ user_id: user.id, event_type: 'job_imported', entity_type: 'job', entity_id: String(data.id), metadata: { source: 'manual' } });
    return data;
  } catch (error) {
    request.log.error(error);
    return reply.status(400).send({ error: 'invalid request' });
  }
});

app.post('/v1/applications', async (request, reply) => {
  try {
    const user = await requireUser(request);
    const body = z.object({ company: z.string(), role: z.string(), job_id: z.number().optional() }).parse(request.body);
    const { data, error } = await supabaseAdmin.from('applications').insert({ user_id: user.id, ...body }).select().single();
    if (error) throw error;
    return data;
  } catch {
    return reply.status(400).send({ error: 'invalid request' });
  }
});

app.post('/v1/billing/checkout', async (request, reply) => {
  try {
    const user = await requireUser(request);
    const body = z.object({ priceId: z.string() }).parse(request.body);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: body.priceId, quantity: 1 }],
      success_url: `${config.appBaseUrl}/billing/success`,
      cancel_url: `${config.appBaseUrl}/billing`,
      client_reference_id: user.id
    });
    return { url: session.url };
  } catch {
    return reply.status(400).send({ error: 'unable to create checkout' });
  }
});

app.post('/v1/billing/webhook', async (request, reply) => {
  const sig = request.headers['stripe-signature'];
  if (!sig) return reply.status(400).send({ error: 'missing signature' });
  const event = stripe.webhooks.constructEvent(JSON.stringify(request.body), sig, config.stripeWebhookSecret);
  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata.user_id;
    if (userId) {
      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      });
    }
  }
  return { received: true };
});

app.listen({ port: config.port, host: '0.0.0.0' });
