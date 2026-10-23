"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Crown, ArrowRight, Loader2, XCircle } from "lucide-react";

function PremiumSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState("loading"); // loading | success | error

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch("/api/premium_confirm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId }),
                });
                if (!res.ok) throw new Error("Verification failed");
                setStatus("success");
            } catch (err) {
                console.error("Premium verify error:", err);
                setStatus("error");
            }
        };

        verify();
    }, [sessionId]);

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
            <section className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                    <Crown size={17} />
                    RecipeHub Premium
                </div>

                {status === "loading" && (
                    <div className="mt-8 flex items-center justify-center gap-2 text-orange-600">
                        <Loader2 className="animate-spin" size={20} />
                        Verifying your payment...
                    </div>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950">
                            <CheckCircle2 size={44} />
                        </div>
                        <h1 className="mt-5 text-3xl font-extrabold text-gray-900 dark:text-white">
                            Thank You!
                        </h1>
                        <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                            Your Premium membership is now active.
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950">
                            <XCircle size={44} />
                        </div>
                        <h1 className="mt-5 text-2xl font-extrabold text-gray-900 dark:text-white">
                            Could not verify payment
                        </h1>
                        <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                            If money was deducted, please contact support.
                        </p>
                    </>
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

export default function PremiumSuccessPage() {
    return (
        <Suspense fallback={null}>
            <PremiumSuccessContent />
        </Suspense>
    );
}