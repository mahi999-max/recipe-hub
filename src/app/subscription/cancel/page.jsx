
import Link from "next/link";
import { CircleX, CreditCard, ArrowLeft } from "lucide-react";

export default function SubscriptionCancelPage() {
    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
            <section className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:p-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950">
                    <CircleX size={44} />
                </div>

                <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                    Checkout Cancelled
                </h1>

                <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
                    You left the checkout before completing your
                    subscription. No new subscription has been confirmed
                    by this checkout.
                </p>

                <div className="mt-8 rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    No worries! You can return to your profile and try
                    again whenever you are ready.
                </div>

                <Link
                    href="/profile"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                >
                    <CreditCard size={18} />
                    Try Again
                </Link>

                <Link
                    href="/"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-500"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </section>
        </main>
    );
}
