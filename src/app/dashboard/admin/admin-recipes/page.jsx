'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Trash2, Star, Utensils, Search } from 'lucide-react';
import { getAllfood } from '@/lib/api/getApi';
import AdminActions from './AdminActions';

export default function ManageRecipesPage() {
    const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getAllfood()
                console.log("all food:", data);
                setRecipes(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleToggleFeatured = async (recipeId, currentStatus) => {
        try {
            // Optimistic UI update
            setRecipes(prev =>
                prev.map(item =>
                    item._id === recipeId ? { ...item, isFeatured: !currentStatus } : item
                )
            );

            await fetch(`${uri}/api/allFoods/${recipeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isfeatured: !currentStatus })
            });
        } catch (error) {
            console.error("Error toggling featured status:", error);
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (!confirmDelete) return;

        try {
            setRecipes(prev => prev.filter(item => item._id !== recipeId));

            // API Request to delete from backend
            await fetch(`${uri}/api/allFoods/${recipeId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };

    const filteredRecipes = recipes.filter(recipe =>
        recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
       <div className="w-full min-w-0 max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                        <Utensils className="text-orange-500" /> Manage Recipes
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Total {recipes.length} recipes published on the platform
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                </div>
            </div>

            {/* Recipe Table */}
            <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-4">Image</th>
                                <th scope="col" className="px-6 py-4">Title / Name</th>
                                <th scope="col" className=" hidden sm:table-cell  px-6 py-4">Category</th>
                                <th scope="col" className="px-6 py-4">Likes</th>
                                <th scope="col" className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Loading recipes...
                                    </td>
                                </tr>
                            ) : filteredRecipes.length > 0 ? (
                                filteredRecipes.map((recipe) => (
                                    <tr
                                        key={recipe._id}
                                        className="transition-colors hover:bg-orange-50/50 dark:hover:bg-gray-800/50"
                                    >
                                        {/* Image */}
                                        <td className="px-6 py-4">
                                            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                                                <Image
                                                    src={recipe.imageUrl || "/placeholder-food.jpg"}
                                                    alt={recipe.title || "Recipe"}
                                                    fill
                                                    sizes="56px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>

                                        {/* Name / Title */}
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {recipe.title}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                ${recipe.price} • Rating: {recipe.rating || 0}★
                                            </span>
                                        </td>

                                        {/* Category */}
                                        <td className="hidden sm:table-cell px-6 py-4">
                                            <span className="inline-flex rounded-full bg-orange-100 dark:bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
                                                {recipe.category || "General"}
                                            </span>
                                        </td>

                                        {/* Likes (Heart Number) */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 font-semibold text-red-500">
                                                <Heart size={16} className="fill-red-500 text-red-500" />
                                                <span>{recipe.likeCount || 0}</span>
                                            </div>
                                        </td>

                                        {/* Actions (Feature & Delete) */}
                                        {/* Actions Column */}
                                        <td className="px-6 py-4 text-center">
                                            <AdminActions
                                                recipeId={recipe._id}
                                                initialFeatured={recipe.isFeatured || recipe.isfeatured}
                                                onDeleteSuccess={(deletedId) => {
                                                    setRecipes(prev => prev.filter(r => r._id !== deletedId));
                                                }}
                                                onToggleSuccess={(updatedId, newStatus) => {
                                                    setRecipes(prev => prev.map(r => r._id === updatedId ? { ...r, isFeatured: newStatus } : r));
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No recipes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}