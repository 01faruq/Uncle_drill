/**
 * @purpose Sign Out Route Handler.
 *   Clears Supabase authentication cookies and redirects to landing page.
 * @security Server-side session termination.
 * @reference docs/04_SYSTEM_ARCHITECTURE.md
 */
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/login`, {
    status: 303, // See Other (standard for POST -> GET redirect)
  });
}
