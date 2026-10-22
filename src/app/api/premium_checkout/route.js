import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

const PREMIUM_PRICE_USD = 10; // আপনার দাম এখানে বসান

export async function POST() {
    try {
        const headersList = await headers();
        const session = await auth.api.getSession({ headers: headersList });
        const email = session?.user?.email;

        if (!email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const origin =
            headersList.get('origin') || 'https://recipe-hub-f35f.vercel.app';

        const checkout = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: Math.round(PREMIUM_PRICE_USD * 100),
                        product_data: { name: 'RecipeHub Premium Membership' },
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            metadata: { type: "premium", email },
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/user/profile`,
        });

        return NextResponse.json({ url: checkout.url });
    } catch (err) {
        console.error("Premium checkout error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}