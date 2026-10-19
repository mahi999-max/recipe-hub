import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST() {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin') || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: 'price_1URpmKHlOnjYqu2mVw8pYqnl', // আপনার স্ট্রাইপের আসল Price ID দিন
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/subscription/cancel`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error("Stripe API Error:", err);
        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        );
    }
}