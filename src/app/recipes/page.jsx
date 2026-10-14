'use client'
import { ArrowUpRight, ChefHat, Clock3 } from 'lucide-react';
import { motion } from "framer-motion";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getAllfood } from '@/lib/api/getApi';
import Link from 'next/link';
import RecipeFilter from './RecipeFilter'; // আপনার তৈরি করা ফিল্টার কম্পোনেন্ট

const containerVariants = {
  hidden: {},
  visible: {
    // transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function BrowseRecipes() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ফিল্টার স্টেটগুলো
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getAllfood();
        const foodList = Array.isArray(data)
          ? data
          : Array.isArray(data?.foods)
            ? data.foods
            : [];

        setFoods(foodList);
      } catch (err) {
        console.error("Failed to fetch foods:", err);
        setError("Recipes could not be loaded. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // ফিল্টার লজিক (নাম, ক্যাটাগরি এবং কুইজিন মিলিয়ে চেক করা)
  const filteredFoods = foods.filter((recipe) => {
    const matchesTitle = recipe.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesCuisine = selectedCuisine === 'All' || recipe.cuisine?.toLowerCase() === selectedCuisine.toLowerCase();

    return matchesTitle && matchesCategory && matchesCuisine;
  });

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white">
        Browse Recipes
      </h1>

      {/* ফিল্টার কম্পোনেন্ট */}
      <RecipeFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCuisine={selectedCuisine}
        setSelectedCuisine={setSelectedCuisine}
      />

      {loading && <p className="text-center py-8 text-gray-500">Loading recipes...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}

      {/* রেসিপি গ্রিড */}
      <div
        variants={containerVariants}
        initial="hidden"
        // whileInView="visible"
        // viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {!loading && filteredFoods.length > 0 ? (
          filteredFoods.map((recipe) => (
            <Link
              href={`/recipes/${recipe._id}`}
              key={recipe._id}
              className="block"
            >
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

                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                      <ChefHat size={18} />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400">Cuisine</p>
                      <p className="font-semibold">{recipe.cuisine || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))
        ) : (
          !loading && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No recipes found matching your criteria.
            </div>
          )
        )}
      </div>
    </div>
  );
}