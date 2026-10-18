'use client'
import { ArrowUpRight, ChefHat, Clock3, Heart } from 'lucide-react';
import { motion } from "framer-motion";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getAllfood } from '@/lib/api/getApi';
import Link from 'next/link';
import RecipeFilter from './RecipeFilter'; // আপনার তৈরি করা ফিল্টার কম্পোনেন্ট
import RecipeCard from './RecipeCard';

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
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {!loading && filteredFoods.length > 0 ? (
          filteredFoods.map((recipe) => (
           
           <RecipeCard key={recipe?._id} recipe={recipe} cardVariants={cardVariants}></RecipeCard>
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