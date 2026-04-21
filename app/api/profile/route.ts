import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { DrowsyType, MealType } from '@/types';

interface Body {
  id: string;
  sleep_hours: number;
  meal_type: MealType;
  drowsy_time: string;
  notify_time: string;
  drowsy_type: DrowsyType;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (
    !body.id ||
    typeof body.sleep_hours !== 'number' ||
    !body.meal_type ||
    !body.drowsy_time ||
    !body.notify_time ||
    !body.drowsy_type
  ) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('profiles').upsert(
    {
      id: body.id,
      sleep_hours: body.sleep_hours,
      meal_type: body.meal_type,
      drowsy_time: body.drowsy_time,
      notify_time: body.notify_time,
      drowsy_type: body.drowsy_type,
    },
    { onConflict: 'id' },
  );

  if (error) {
    console.error('[api/profile]', error);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
