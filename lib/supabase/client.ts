'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * 브라우저에서 사용하는 Supabase 클라이언트.
 * anon 키만 사용하므로 RLS 정책으로 보호되어야 한다.
 */
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
