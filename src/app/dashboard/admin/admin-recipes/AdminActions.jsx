'use client'
import React, { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';

export default function AdminActions({ recipeId, initialFeatured, onDeleteSuccess, onToggleSuccess }) {
    const [isfeatured, setIsfeatured] = useState(Boolean(initialFeatured));
    const [loading, setLoading] = useState(false);
    const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    // Featured Toggle Handler
    const handleToggleFeatured = async () => {
        const newStatus = !isfeatured;
        setIsfeatured(newStatus); // Instant UI feedback

        try {
            const res = await fetch(`${uri}/api/allFoods/${recipeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isfeatured: newStatus })
            });

            if (res.ok) {
                if (onToggleSuccess) onToggleSuccess(recipeId, newStatus);
            } else {
                setIsfeatured(!newStatus); // Rollback if API fails
            }
        } catch (error) {
            console.error("Error toggling featured status:", error);
            setIsfeatured(!newStatus); // Rollback
        }
    };

    // Delete Handler
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this recipe?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const res = await fetch(`${uri}api/allFoods/${recipeId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                if (onDeleteSuccess) onDeleteSuccess(recipeId);
            } else {
                alert("Failed to delete recipe from database.");
            }
        } catch (error) {
            console.error("Error deleting recipe:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center gap-3">
            {/* Feature Star Button */}
            <button
                onClick={handleToggleFeatured}
                disabled={loading}
                title={isfeatured ? "Unfeature Recipe" : "Make Featured"}
                className={`p-2 rounded-xl border transition-colors ${
                    isfeatured
                        ? "bg-amber-500/10 border-amber-300 text-amber-600 dark:text-amber-400"
                        : "border-gray-200 dark:border-gray-700 text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                }`}
            >
                <Star size={18} className={isfeatured ? "fill-amber-500 text-amber-500" : ""} />
            </button>

            <button
                onClick={handleDelete}
                disabled={loading}
                title="Delete Recipe"
                className="p-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}