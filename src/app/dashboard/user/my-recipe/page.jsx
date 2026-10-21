'use client'
import { getMyFood, getUseSession } from '@/lib/api/getApi';
import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

const MyRecipe = () => {
    const user = getUseSession();
    const [userfood, setuserfood] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            try {
                const result = await getMyFood(user.id);
                const foodList = Array.isArray(result) ? result : result?.foods || [];
                setuserfood(foodList);
            } catch (error) {
                console.error("Failed to fetch user foods:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    // Delete Function
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this recipe?")) return;

        try {
            const response = await fetch(`https://recipe-hub-server-inky.vercel.app/api/allFoods/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // UI থেকে ইনস্ট্যান্ট ডিলিট করা রেসিপিটি সরিয়ে ফেলা
                setuserfood(userfood.filter((food) => food._id !== id));
                alert("Recipe deleted successfully!");
            } else {
                alert("Failed to delete the recipe.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting.");
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading your recipes...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                My Recipes ({userfood.length})
            </h1>

            {userfood.length === 0 ? (
                <p className="text-gray-500 text-center py-8">You haven't added any recipes yet.</p>
            ) : (
                <div className="space-y-4">
                    {userfood.map((recipe) => (
                        <div 
                            key={recipe._id} 
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Left: Image & Title */}
                            <div className="flex items-center gap-4 w-1/3">
                                {recipe.imageUrl ? (
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                        <Image 
                                            src={recipe.imageUrl} 
                                            alt={recipe.title || "Recipe"} 
                                            fill 
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-500 shrink-0">
                                        No Image
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                                        {recipe.title || "Untitled Recipe"}
                                    </h3>
                                    <p className="text-xs text-gray-500 capitalize">{recipe.category || "General"}</p>
                                </div>
                            </div>

                            {/* Middle: Status Badge */}
                            <div className="w-1/3 text-center">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                                    recipe.status === 'approved' 
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                        : recipe.status === 'rejected'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                    {recipe.status || 'pending'}
                                </span>
                            </div>

                            {/* Right: Delete Action Button */}
                            <div className="w-1/3 flex justify-end">
                                <button
                                    onClick={() => handleDelete(recipe._id)}
                                    className="flex items-center gap-2 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRecipe;