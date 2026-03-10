import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, billingData } = body as { type?: string; billingData?: Record<string, unknown> };

    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const prisma = getPrisma();
    let userId: string | null = null;
    if (authUser) {
      const dbUser = await prisma.user.findUnique({
        where: { supabaseId: authUser.id },
      });
      userId = dbUser?.id ?? null;
    }

    if (type === "checkout" && billingData) {
      if (!userId) {
        return NextResponse.json(
          { error: "Please sign in to complete checkout" },
          { status: 401 }
        );
      }
      await prisma.payment.create({
        data: {
          userId,
          amount: 0,
          currency: "USD",
          status: "PENDING",
          description: `Checkout form: ${JSON.stringify(billingData).slice(0, 500)}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Checkout data received",
    });
  } catch (e) {
    console.error("[api/payments]", e);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
