import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import {
    Receipt,
    DollarSign,
    ShoppingBag,
    ShieldAlert,
    LoaderCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { signToken } from "@/lib/token";
const TransactionsContent = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;

    if (user?.role !== "admin") {
        return (
            <div className="mx-auto max-w-lg px-6 py-20 text-center">
                <ShieldAlert className="mx-auto mb-4 text-red-500" size={42} />
                <h1 className="text-2xl font-bold">Access denied</h1>
                <p className="mt-2 text-gray-500">
                    Only admins can view this page.
                </p>
                <Link
                    href="/"
                    className="mt-5 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white"
                >
                    Go Home
                </Link>
            </div>
        );
    }

    let transactions = [];
    let failed = false;

    try {
        const token = signToken(user);

        const res = await fetch("https://recipe-hub-server-inky.vercel.app/api/admin/transactions", {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            console.error("Status:", res.status, await res.text());
            throw new Error("Failed to load transactions");
        }
        transactions = await res.json();
    } catch (error) {
        console.error("Transactions fetch error:", error);
        failed = true;
    }

    const totalRevenue = transactions.reduce(
        (sum, t) => sum + (Number(t.amount) || 0),
        0
    );

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="font-semibold text-orange-500">ADMIN</p>
                    <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        All Transactions
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Every recipe purchase made on RecipeHub.
                    </p>
                </div>

                {failed && (
                    <p className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                        Could not load transactions. Check that the backend is running.
                    </p>
                )}

                {/* Summary */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                            <ShoppingBag size={26} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Transactions</p>
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                {transactions.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <div className="rounded-xl bg-green-100 p-3 text-green-600">
                            <DollarSign size={26} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                ${totalRevenue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {!failed && transactions.length === 0 ? (
                    <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
                        <Receipt className="mx-auto mb-4 text-orange-500" size={42} />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            No transactions yet
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Purchases will show up here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-5 py-4">Buyer</th>
                                    <th className="px-5 py-4">Recipe</th>
                                    <th className="px-5 py-4">Amount</th>
                                    <th className="px-5 py-4">Stripe Session</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-orange-50/40 dark:hover:bg-gray-800/40">
                                        <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                                            {new Date(t.paidAt).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {t.buyerName}
                                            </p>
                                            <p className="text-xs text-gray-500">{t.email}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/recipes/${t.foodId}`}
                                                className="font-medium text-orange-600 hover:underline"
                                            >
                                                {t.recipeTitle}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 font-bold text-green-600">
                                            ${Number(t.amount).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-4 font-mono text-xs text-gray-500">
                                            {t.stripeSessionId?.slice(0, 18)}...
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
};

const AdminTransactionsPage = () => {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[60vh] items-center justify-center">
                    <LoaderCircle className="animate-spin text-orange-500" size={32} />
                </div>
            }
        >
            <TransactionsContent />
        </Suspense>
    );
};

export default AdminTransactionsPage;