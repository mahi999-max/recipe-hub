'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ChefHat } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function RecipeCard({ recipe, cardVariants }) {
    const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const [likes, setLikes] = useState(recipe.likeCount || 0);
    const [isLiked, setIsLiked] = useState(false);

    // সেশন থেকে ইউজার আইডি নেওয়া
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id || session?.user?._id || session?.user?.email;

    // পেজ রিলোড বা কম্পোনেন্ট লোড হওয়ার সময় সার্ভার থেকে চেক করা এই ইউজার আগে লাইক দিয়েছে কিনা

    useEffect(() => {
        let cancelled = false;

        const checkUserLikeStatus = async () => {
            if (!userId || !recipe?._id) return;

            try {
                // টোকেন ছাড়াই সরাসরি রিকোয়েস্ট পাঠানো হচ্ছে
                const res = await fetch(`${uri}/api/allFoods/likes/${userId}`);

                if (!res.ok) throw new Error("Failed to fetch liked recipes");

                const likedRecipes = await res.json();

                if (!cancelled && Array.isArray(likedRecipes)) {
                    const isAlreadyLiked = likedRecipes.some(
                        (item) => String(item._id) === String(recipe._id)
                    );

                    setIsLiked(isAlreadyLiked);
                }
            } catch (error) {
                console.error("Like status check error:", error);
            }
        };

        checkUserLikeStatus();

        return () => {
            cancelled = true;
        };
    }, [recipe._id, userId]);


    const handleLikeToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userId) {
            alert('Please login first to like recipes!');
            return;
        }

        try {
            const res = await fetch(
                `${uri}/api/allFoods/likes`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        foodId: recipe._id,
                        userId: String(userId)
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to update like');
            }

            setIsLiked(data.isLiked);

            setLikes(prev =>
                Math.max(
                    0,
                    prev + (data.isLiked ? 1 : -1)
                )
            );

        } catch (error) {
            console.error('Like/Unlike error:', error);
        }
    };

    return (
        <Link href={`/recipes/${recipe._id}`} className="block">
            <motion.article
                variants={cardVariants}
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

                        {/* Like Button */}
                        <button
                            type="button"
                            onClick={handleLikeToggle}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all ${isLiked
                                ? "bg-orange-500 border-orange-500 text-white shadow-md"
                                : "border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-600 dark:text-gray-300"
                                }`}
                            title={isLiked ? "Unlike recipe" : "Like recipe"}
                        >
                            <Heart
                                size={18}
                                className={`transition-colors ${isLiked
                                    ? "fill-white text-white"
                                    : "text-gray-400 group-hover/like:text-red-500"
                                    }`}
                            />
                            <span className={`text-sm font-bold ${isLiked ? "text-white" : ""}`}>
                                {likes}
                            </span>
                        </button>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}
