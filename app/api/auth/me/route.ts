import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ user: null, needsSync: true }, { status: 200 });
    }

    return NextResponse.json({ user });
  } catch (e) {
    console.error("[auth/me]", e);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
