import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { sendPush } from '@/lib/firebase/admin';
import { NOTIFY_COPY } from '@/lib/drowsy/notify-time';

// Vercel Cron 은 이 URL을 GET으로 호출한다.
// runtime 은 node — firebase-admin 사용 때문에 edge 불가.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 현재 시각(KST) 기준 'HH:MM' 반환.
 */
function nowHHMM_KST(): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const h = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const m = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return `${h}:${m}`;
}

export async function GET(req: Request) {
  // Vercel Cron 은 Authorization: Bearer $CRON_SECRET 을 보내준다.
  const auth = req.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const now = nowHHMM_KST();
  const supabase = getSupabaseAdmin();

  // notify_time 이 현재 시각과 정확히 일치하는 사용자 조회
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('notify_time', now);

  if (error) {
    console.error('[cron] load profiles', error);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ ok: true, now, matched: 0 });
  }

  // 해당 사용자들의 토큰 수집
  const profileIds = profiles.map((p) => p.id);
  const { data: tokens, error: tErr } = await supabase
    .from('push_tokens')
    .select('token')
    .in('profile_id', profileIds);

  if (tErr) {
    console.error('[cron] load tokens', tErr);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  if (!tokens || tokens.length === 0) {
    return NextResponse.json({
      ok: true,
      now,
      matched: profiles.length,
      sent: 0,
    });
  }

  const host = req.headers.get('host') ?? '';
  const proto = host.startsWith('localhost') ? 'http' : 'https';
  const url = `${proto}://${host}/routine`;

  const copy = NOTIFY_COPY.pre; // notify_time 은 졸림 10분 전이므로 'pre' 카피 사용

  const results = await Promise.allSettled(
    tokens.map((t) =>
      sendPush({
        token: t.token,
        title: copy.title,
        body: copy.body,
        url,
        data: { stage: 'pre' },
      }),
    ),
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.length - sent;

  return NextResponse.json({
    ok: true,
    now,
    matched: profiles.length,
    sent,
    failed,
  });
}
