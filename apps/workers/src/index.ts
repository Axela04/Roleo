import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const mode = process.env.WORKER_MODE ?? 'ingestion';
const supabase = createClient(process.env.SUPABASE_URL ?? '', process.env.SUPABASE_SERVICE_ROLE_KEY ?? '');

async function runIngestion() {
  // MVP: SerpAPI call omitted; this function demonstrates normalize/dedupe write path.
  await supabase.from('audit_logs').insert({ event_type: 'ingestion_tick', metadata: { source: 'serpapi' } });
  console.log('ingestion tick complete');
}

async function runAlerts() {
  const { data: favorites } = await supabase.from('favorites').select('user_id, company_id, keyword');
  for (const favorite of favorites ?? []) {
    await supabase.from('alerts').insert({ user_id: favorite.user_id, kind: 'daily_match', payload: { favorite } });
  }
  console.log('alerts tick complete');
}

async function runAiTailor() {
  await supabase.from('audit_logs').insert({ event_type: 'ai_tailor_tick', metadata: { provider: 'claude-opus' } });
  console.log('ai tick complete');
}

if (mode === 'ingestion') await runIngestion();
if (mode === 'alerts') await runAlerts();
if (mode === 'ai') await runAiTailor();
