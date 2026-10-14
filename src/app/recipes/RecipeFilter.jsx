'use client';
import React from 'react';

const categories = [
  "pasta", "pizza", "burger", "salad", "rice", 
  "dessert", "Healthy Meals", "soup", "another(not matched)", "breakfast"
];

const cuisines = [
  "Italian", "American", "French", "Bengali", 
  "South Asian", "European", "Mexican", "Mediterranean", "another(not matched)"
];

export default function RecipeFilter({ 
  searchTerm, setSearchTerm, 
  selectedCategory, setSelectedCategory, 
  selectedCuisine, setSelectedCuisine 
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      
      {/* Search by Recipe Title */}
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="Search by recipe name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Filter by Category */}
      <div className="w-full md:w-1/3">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Filter by Cuisine */}
      <div className="w-full md:w-1/3">
        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="w-full px-4 py-2 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="All">All Cuisines</option>
          {cuisines.map((cui, index) => (
            <option key={index} value={cui}>{cui}</option>
          ))}
        </select>
      </div>

    </div>
  );
}