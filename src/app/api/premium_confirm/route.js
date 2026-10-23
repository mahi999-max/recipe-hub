import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(req) {
    try {
        const { sessionId } = await req.json();
        const authSession = await auth.api.getSession({ headers: await headers() });
        const email = authSession?.user?.email;

        if (!sessionId || !email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const checkout = await stripe.checkout.sessions.retrieve(sessionId);

        const valid =
            checkout.payment_status === "paid" &&
            checkout.metadata?.type === "premium" &&
            checkout.metadata?.email === email;

        if (!valid) {
            return NextResponse.json({ message: "Payment not verified" }, { status: 400 });
        }

        // ব্যাকএন্ডে premium সেট (নিচে ধাপ গ দেখুন)
        const { signToken } = await import('@/lib/token');
        const token = signToken(authSession.user);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/make-premium`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Backend update failed");
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Premium confirm error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}