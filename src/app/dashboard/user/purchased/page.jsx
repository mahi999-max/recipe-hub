import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import {
    ChefHat,
    ShoppingBag,
    UserRound,
    Clock,
    ArrowRight,
    LoaderCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { signToken } from "@/lib/token";

const PurchasedContent = async () => {
    const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;

    if (!user?.email) {
        return (
            <div className="mx-auto max-w-lg px-6 py-20 text-center">
                <UserRound className="mx-auto mb-4" size={42} />
                <h1 className="text-2xl font-bold">Please log in</h1>
                <p className="mt-2 text-gray-500">
                    Log in to see your purchased recipes.
                </p>
                <Link
                    href="/auth/login"
                    className="mt-5 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white"
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    let purchases = [];
    let failed = false;

    try {
        const token = signToken(user);
        const res = await fetch(`${uri}/api/my-purchases`, {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load purchases");
        purchases = await res.json();
    } catch (error) {
        console.error("My purchases fetch error:", error);
        failed = true;
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="font-semibold text-orange-500">RECIPEHUB ACCOUNT</p>
                    <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        My Purchased Recipes
                    </h1>
                    <p className="mt-2 text-gray-500">
                        {purchases.length} recipe{purchases.length === 1 ? "" : "s"} purchased
                    </p>
                </div>

                {failed && (
                    <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                        Could not load your purchases. Please try again later.
                    </p>
                )}

                {!failed && purchases.length === 0 && (
                    <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
                        <ShoppingBag className="mx-auto mb-4 text-orange-500" size={42} />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            No purchases yet
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Recipes you buy will show up here.
                        </p>
                        <Link
                            href="/recipes"
                            className="mt-5 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
                        >
                            Browse Recipes
                        </Link>
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {purchases.map((p) => (
                        <article
                            key={p.orderId}
                            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="relative h-48">
                                {p.food.imageUrl ? (
                                    <Image
                                        src={p.food.imageUrl}
                                        alt={p.food.title || "Recipe"}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-orange-100">
                                        <ChefHat size={48} className="text-orange-400" />
                                    </div>
                                )}
                                <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                                    Purchased
                                </span>
                            </div>

                            <div className="p-5">
                                <h2 className="line-clamp-1 text-lg font-bold text-gray-900 dark:text-white">
                                    {p.food.title}
                                </h2>
                                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                    {p.food.description}
                                </p>

                                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={15} />
                                        {new Date(p.paidAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                    <span className="font-bold text-orange-600">
                                        ${p.amount}
                                    </span>
                                </div>

                                <Link
                                    href={`/recipes/${p.food._id}`}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                                >
                                    View Recipe
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default function MyPurchasedRecipesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[60vh] items-center justify-center">
                    <LoaderCircle className="animate-spin text-orange-500" size={32} />
                </div>
            }
        >
            <PurchasedContent />
        </Suspense>
    );
}