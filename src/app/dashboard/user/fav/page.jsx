'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ChefHat, Clock3, ArrowUpRight, Utensils } from 'lucide-react';
import { getUseSession } from '@/lib/api/getApi';
import { authClient } from '@/lib/auth-client';

export default function FavoritesPage() {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const session=authClient.useSession()
    const userId = session?.data?.user?.id;
    console.log("userID: ",userId);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                // ব্যাকএন্ডে ইউজারের আইডি দিয়ে ফেচ করার রুট
                const res = await fetch(`https://recipe-hub-server-inky.vercel.app/api/allFoods/likes/${userId}`);
                const data = await res.json();
                setFavoriteRecipes(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching favorite recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchFavorites();
        }
    }, [userId]);

    if (loading) {
        return <div className="text-center py-20 font-semibold text-gray-500">Loading your favorite recipes...</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-3">
                    <Heart className="fill-red-500 text-red-500" size={32} />
                    My Favorite Recipes
                </h1>
                <p className="text-gray-500 mt-2">Here are the recipes you have liked and saved.</p>
            </div>

            {favoriteRecipes.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <Utensils size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No favorite recipes found!</p>
                    <p className="text-sm text-gray-400 mt-1">Explore recipes and hit the heart icon to save them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {favoriteRecipes.map((recipe) => (
                        <Link
                            href={`/recipes/${recipe._id}`}
                            key={recipe._id}
                            className="block"
                        >
                            <motion.article
                                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.25 } }}
                                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50 transition-shadow duration-300 hover:shadow-2xl hover:shadow-orange-500/15 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20"
                            >
                                {/* Image Frame */}
                                <div className="relative h-56 overflow-hidden bg-gray-200 dark:bg-gray-800">
                                    {recipe.imageUrl ? (
                                        <Image
                                            src={recipe.imageUrl}
                                            alt={recipe.title || "Recipe"}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-500">
                                            No image available
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-bold text-orange-600 shadow-sm backdrop-blur-md">
                                        {recipe.category || "Recipe"}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="space-y-4 p-5">
                                    <h3 className="text-xl font-bold leading-snug text-gray-900 dark:text-white truncate">
                                        {recipe.title || "Untitled Recipe"}
                                    </h3>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                                                <ChefHat size={18} />
                                            </span>
                                            <div>
                                                <p className="text-xs text-gray-400">Cuisine</p>
                                                <p className="font-semibold">{recipe.cuisine || "Not specified"}</p>
                                            </div>
                                        </div>

                                        {/* Liked Indicator Badge */}
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-sm">
                                            <Heart size={16} className="fill-red-500" />
                                            <span>{recipe.likeCount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}