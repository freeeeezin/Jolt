import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { DrowsyType, RoutineResult } from '@/types';

interface Body {
  profile_id: string;
  result: RoutineResult;
  completed: boolean;
  drowsy_type?: DrowsyType | null;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (
    !body.profile_id ||
    !['good', 'normal', 'bad'].includes(body.result) ||
    typeof body.completed !== 'boolean'
  ) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('logs').insert({
    profile_id: body.profile_id,
    result: body.result,
    completed: body.completed,
    drowsy_type: body.drowsy_type ?? null,
  });

  if (error) {
    console.error('[api/log]', error);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
