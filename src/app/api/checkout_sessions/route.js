import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(req) {
    const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    try {
        const headersList = await headers();
        const origin = headersList.get('origin') || 'http://localhost:3000';

        const { foodId, email } = await req.json();

        if (!foodId) {
            return NextResponse.json({ message: "foodId required" }, { status: 400 });
        }

        
        const foodRes = await fetch(`${uri}/api/allFoods/${foodId}`, {
            cache: 'no-store',
        });
        if (!foodRes.ok) {
            return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
        }
        const food = await foodRes.json();

        const price = Number(food.price);
        if (!price || price < 0.5) {
            return NextResponse.json({ message: "Invalid price" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: Math.round(price * 100),
                        product_data: {
                            name: food.title,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: email,
            metadata: { type: "recipe", foodId: String(foodId), email: email || "" },
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/allFoods/${foodId}`,
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

