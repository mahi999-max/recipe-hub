import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { signToken } from "@/lib/token";

export async function GET() {
    const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const user = session?.user;

        if (!user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = signToken(user);
        const res = await fetch(`${uri}/api/my-purchases`, {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            return NextResponse.json({ message: "Failed" }, { status: res.status });
        }

        const purchases = await res.json();
        return NextResponse.json({ count: purchases.length });
    } catch (err) {
        console.error("Purchases count error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}