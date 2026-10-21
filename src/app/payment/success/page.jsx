"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Loader2, XCircle } from "lucide-react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [status, setStatus] = useState("loading"); // loading | success | error
    const [foodId, setFoodId] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch("https://recipe-hub-server-inky.vercel.app/api/orders/confirm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId }),
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.message);

                setFoodId(data.foodId);
                setStatus("success");
            } catch (err) {
                console.error("Verify error:", err);
                setStatus("error");
            }
        };

        verify();
    }, [sessionId]);

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
            <section className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:p-10">
                {status === "loading" && (
                    <>
                        <Loader2 className="mx-auto animate-spin text-orange-500" size={44} />
                        <p className="mt-5 text-gray-600 dark:text-gray-300">
                            Confirming your payment...
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950">
                            <CheckCircle2 size={44} />
                        </div>
                        <h1 className="mt-5 text-3xl font-extrabold text-gray-900 dark:text-white">
                            Purchase Successful!
                        </h1>
                        <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                            Thank you! Your recipe purchase has been confirmed.
                        </p>
                        <Link
                            href={foodId ? `/recipes/${foodId}` : "/"}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                        >
                            Back to Recipe
                            <ArrowRight size={18} />
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950">
                            <XCircle size={44} />
                        </div>
                        <h1 className="mt-5 text-2xl font-extrabold text-gray-900 dark:text-white">
                            Could not verify payment
                        </h1>
                        <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                            If money was deducted, please contact support with your payment details.
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                        >
                            Go Home
                        </Link>
                    </>
                )}
            </section>
        </main>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={null}>
            <SuccessContent />
        </Suspense>
    );
}