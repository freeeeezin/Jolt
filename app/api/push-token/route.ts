import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

interface Body {
  profile_id: string;
  token: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!body.profile_id || !body.token) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // profile_id 가 없을 수 있으므로 존재 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', body.profile_id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: 'profile_not_found' }, { status: 404 });
  }

  const { error } = await supabase.from('push_tokens').upsert(
    {
      profile_id: body.profile_id,
      token: body.token,
    },
    { onConflict: 'token' },
  );

  if (error) {
    console.error('[api/push-token]', error);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
