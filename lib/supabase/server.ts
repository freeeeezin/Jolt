import { createClient } from '@supabase/supabase-js';

/**
 * 서버(API 라우트, 크론)에서 쓰는 관리자 클라이언트.
 * RLS를 우회하므로 **절대 클라이언트로 보내지 말 것**.
 */
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
