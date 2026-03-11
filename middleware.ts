import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Create a response that we can pass back to Next.js
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Attach Supabase SSR client with full cookie passthrough
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // Touch the session so Supabase can refresh tokens & cookies when needed
  try {
    await supabase.auth.getSession();
  } catch {
    // If this fails we still continue; pages can handle unauthenticated state.
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/exam-library/:path*",
    "/exam-engine/:path*",
    "/api/:path*",
  ],
};

