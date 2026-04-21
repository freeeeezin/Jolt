import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { sendPush } from '@/lib/firebase/admin';
import { NOTIFY_COPY, type NotifyStage } from '@/lib/drowsy/notify-time';

interface Body {
  profile_id: string;
  stage?: NotifyStage;
}

/**
 * 특정 사용자에게 즉시 푸시를 보내는 개발/관리용 엔드포인트.
 * 운영에서는 `CRON_SECRET` 헤더를 요구한다.
 */
export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!body.profile_id) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const stage: NotifyStage = body.stage ?? 'onTime';
  const copy = NOTIFY_COPY[stage];

  const supabase = getSupabaseAdmin();
  const { data: tokens, error } = await supabase
    .from('push_tokens')
    .select('token')
    .eq('profile_id', body.profile_id);

  if (error) {
    console.error('[send-notification] load tokens', error);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  if (!tokens || tokens.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const host = req.headers.get('host') ?? '';
  const proto = host.startsWith('localhost') ? 'http' : 'https';
  const url = `${proto}://${host}/routine`;

  const results = await Promise.allSettled(
    tokens.map((t) =>
      sendPush({
        token: t.token,
        title: copy.title,
        body: copy.body,
        url,
        data: { stage },
      }),
    ),
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  return NextResponse.json({ ok: true, sent, total: tokens.length });
}
