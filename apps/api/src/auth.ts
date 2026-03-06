import type { FastifyRequest } from 'fastify';
import { supabaseAdmin } from './supabase.js';

export async function requireUser(request: FastifyRequest) {
  const token = request.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('Missing bearer token');
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) throw new Error('Invalid token');
  return data.user;
}
