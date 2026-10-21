'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Crown, ArrowRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client"; 

export default function SubscriptionSuccessPage() {
    const session = authClient.useSession(); 
    const userEmail = session?.data?.user?.email;
    
    const [updating, setUpdating] = useState(true);

    useEffect(() => {
        const updatePremiumStatus = async () => {
            if (!userEmail) return;

            try {
                // ব্যাকএন্ডে PATCH রিকোয়েস্ট পাঠানো হচ্ছে
                const res = await fetch(`https://recipe-hub-server-inky.vercel.app/api/users/make-premium/${userEmail}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await res.json();
                console.log("Database update response:", data);
            } catch (error) {
                console.error("Failed to update premium status:", error);
            } finally {
                setUpdating(false);
            }
        };

        // updatePrevumStatus(); // বানান ঠিক রাখবেন
        updatePremiumStatus();
    }, [userEmail]);

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
            <section className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:p-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950">
                    <CheckCircle2 size={44} />
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                    <Crown size={17} />
                    RecipeHub Premium
                </div>

                <h1 className="mt-5 text-3xl font-extrabold text-gray-900 dark:text-white">
                    Thank You!
                </h1>

                <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
                    Your payment was successful! We have activated your Premium membership.
                </p>

                {updating ? (
                    <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-orange-50 p-4 text-sm font-medium text-orange-600 dark:bg-orange-950/40">
                        <Loader2 className="animate-spin" size={18} />
                        Updating your profile status...
                    </div>
                ) : (
                    <div className="mt-8 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                        ✓ Your Premium access is now active!
                    </div>
                )}

                <Link
                    href="/dashboard/user/profile"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                >
                    Go to Profile
                    <ArrowRight size={18} />
                </Link>
            </section>
        </main>
    );
}