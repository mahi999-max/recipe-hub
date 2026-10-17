"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  Clock3,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllfood } from "./api/getApi";

// Featured Foods animation
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

export default function Banner() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getAllfood();

        console.log("Fetched foods:", data);

        // API সরাসরি array অথবা { foods: [...] } দিলে দুটোই handle করবে
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

  return (
    <>
      {/* ================= HERO BANNER ================= */}
      <section className="relative flex min-h-[550px] h-[calc(100vh-72px)] w-full items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/banner.jfif"
          alt="Delicious food on a table"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Banner Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center text-white"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur-md"
            >
              Discover · Cook · Enjoy
            </motion.span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Welcome to{" "}
              <span className="text-orange-400">RecipeHub</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
              Discover delicious recipes, explore new flavors, and
              turn everyday ingredients into extraordinary meals.
              Your next favorite dish starts here!
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/recipes"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-orange-600 active:scale-95"
              >
                <Search size={19} />
                Browse Recipes
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black active:scale-95"
              >
                Join RecipeHub
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
      </section>

      {/* ================= FEATURED FOODS ================= */}
      <section className="overflow-hidden bg-gray-50 px-5 py-16 dark:bg-gray-950 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              ✨ Handpicked for you
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              Featured{" "}
              <span className="text-orange-500">Foods</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-gray-400">
              Discover delicious recipes made to inspire your next meal.
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-3xl bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <p className="py-10 text-center text-red-500">{error}</p>
          )}

          {/* Recipe Cards */}
          {!loading && !error && foods.length > 0 && (
            <div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {foods.filter((recipe)=>recipe.isfeatured===true).map((recipe) => (
                <motion.article
                  key={recipe._id}
                  variants={cardVariants}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.25 },
                  }}
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

                    {/* Image Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

                    {/* Category */}
                    <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-bold text-orange-600 shadow-sm backdrop-blur-md">
                      {recipe.category || "Recipe"}
                    </span>

                    {/* Arrow Icon */}
                    <motion.div
                      whileHover={{ rotate: 45 }}
                      className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg"
                    >
                      <ArrowUpRight size={21} />
                    </motion.div>

                    {/* Recipe Name */}
                    <h3 className="absolute bottom-5 left-4 right-14 text-xl font-bold leading-snug text-white">
                      {recipe.title || "Untitled Recipe"}
                    </h3>
                  </div>

                  {/* Recipe Details */}
                  <div className="space-y-4 p-5">
                    {/* Cuisine */}
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                        <ChefHat size={18} />
                      </span>

                      <div>
                        <p className="text-xs text-gray-400">Cuisine</p>
                        <p className="font-semibold">
                          {recipe.cuisine || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Prep Time */}
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                        <Clock3 size={18} />
                      </span>

                      <div>
                        <p className="text-xs text-gray-400">Prep Time</p>
                        <p className="font-semibold">
                          {recipe.prepTime ?? "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <Link href="/recipes" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground">
    Explore More
    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
      <ArrowRight size={18} />
    </motion.span>
  </Link>
</motion.div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && foods.length === 0 && (
            <p className="py-10 text-center text-gray-500 dark:text-gray-400">
              No recipes found in the database.
            </p>
          )}
        </div>
      </section>

      {/* ================= POPULAR RECIPES ================= */}
<section className="bg-white px-5 py-14 dark:bg-gray-950 sm:px-8 lg:px-16">
  <div className="mx-auto max-w-7xl">

    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <span className="text-sm font-bold uppercase tracking-wider text-orange-500">
        ❤️ Community Favorites
      </span>

      <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
        Popular <span className="text-orange-500">Recipes</span>
      </h2>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Recipes loved by our cooking community.
      </p>
    </motion.div>

    {/* Popular Recipe Mini Cards */}
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {[...foods]
        .sort(
          (a, b) =>
            ((b.likeCount || 0) + (b.commentCount || 0)) -
            ((a.likeCount || 0) + (a.commentCount || 0))
        )
        .slice(0, 5)
        .map((recipe, index) => (
          <motion.article
            key={recipe._id}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            className="relative rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-orange-500/10 dark:border-gray-800 dark:bg-gray-900"
          >
            {/* Rank */}
            <div className="mb-4 flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 font-extrabold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                #{index + 1}
              </span>

              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500 dark:bg-red-500/10">
                <span aria-hidden="true">♥</span> Popular
              </span>
            </div>

            {/* Recipe Name */}
            <h3 className="line-clamp-2 min-h-12 text-lg font-bold text-gray-900 dark:text-white">
              {recipe.title}
            </h3>

            {/* Author */}
            <p className="mt-3 truncate text-sm text-gray-500 dark:text-gray-400">
              By{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {recipe.authorName || recipe.author?.name || "Community Chef"}
              </span>
            </p>

            {/* Likes & Comments */}
            <div className="mt-4 flex items-center gap-4 border-t border-gray-200 pt-3 text-sm dark:border-gray-700">
              <span className="flex items-center gap-1.5 font-semibold text-rose-500">
                <span aria-hidden="true">♥</span>
                {recipe.likeCount || 0}
                <span className="font-normal text-gray-500">likes</span>
              </span>

              <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <span aria-hidden="true">💬</span>
                {recipe.commentCount || 0}
              </span>
            </div>
          </motion.article>
        ))}
    </motion.div>

    {!loading && foods.length === 0 && (
      <p className="py-8 text-center text-gray-500">
        No popular recipes available yet.
      </p>
    )}
  </div>
</section>

{/* ================ PROFESSIONALS SECTION ================ */}
<section className="bg-orange-50/60 px-5 py-16 dark:bg-gray-950 sm:px-8 lg:px-16">
  <div className="mx-auto max-w-7xl">

    {/* Section Heading */}
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="mb-10 text-center"
    >
      <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
        👨‍🍳 Meet Our Experts
      </span>

      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
        Connect With Our{" "}
        <span className="text-orange-500">Professionals</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
        Connect with experienced chefs and food professionals.
        Learn from their expertise and discover new culinary opportunities.
      </p>
    </motion.div>

    {/* Professionals Data */}
    {/*
      Demo data. Replace these with real professional profiles
      from your backend when available.
    */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[
          {
            id: 1,
            name: "Gordon Bennett",
            role: "Executive Chef",
            achievement: "15+ years of culinary experience",
            contact: "chef.gordon@google.com",
            initials: "GB",
          },
          {
            id: 2,
            name: "Sophia Williams",
            role: "Pastry Chef",
            achievement: "Award-winning pastry specialist",
            contact: "sophia.chef@google.com",
            initials: "SW",
          },
          {
            id: 3,
            name: "Daniel Carter",
            role: "Nutrition Expert",
            achievement: "Specialist in healthy meal planning",
            contact: "daniel.food@google.com",
            initials: "DC",
          },
        ].map((professional) => (
          <motion.article
            key={professional.id}
            variants={cardVariants}
            whileHover={{ y: -7 }}
            className="group rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl font-extrabold text-white shadow-md shadow-orange-500/20">
                {professional.initials}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-orange-500 dark:text-white">
                  {professional.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-orange-500">
                  {professional.role}
                </p>
              </div>

              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                Professional
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/70">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Achievement / Expertise
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                {professional.achievement}
              </p>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                Contact
              </p>

              <a
                href={`mailto:${professional.contact}`}
                className="flex items-center gap-2 break-all text-sm font-medium text-gray-700 transition-colors hover:text-orange-500 dark:text-gray-300"
              >
                <span aria-hidden="true">✉</span>
                {professional.contact}
              </a>
            </div>

            <a
              href={`mailto:${professional.contact}`}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white transition-all duration-300 hover:bg-orange-600 active:scale-95"
            >
              Contact Professional
              <ArrowUpRight size={18} />
            </a>
          </motion.article>
        ))}
      </motion.div>

    <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
      Demo profiles shown. Replace them with verified professional details.
    </p>
  </div>
</section>

{/* ================ WHY CHOOSE RECIPEHUB ================ */}
<section className="relative overflow-hidden bg-white px-5 py-20 dark:bg-gray-950 sm:px-8 lg:px-16">
  <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-500/10" />

  <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/10" />

  <div className="relative mx-auto max-w-7xl">
    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="mx-auto mb-14 max-w-2xl text-center"
    >
      <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
        ✨ Your Culinary Journey
      </span>

      <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
        Why Choose{" "}
        <span className="text-orange-500">RecipeHub?</span>
      </h2>

      <p className="mt-5 leading-7 text-gray-600 dark:text-gray-400">
        Everything you need to discover new dishes, share your cooking
        passion, and connect with a community that loves food.
      </p>
    </motion.div>

    {/* Feature Cards */}
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {[
        {
          id: 1,
          icon: "🍲",
          title: "Explore Recipes",
          description:
            "Discover delicious recipes from different cuisines and find inspiration for your next meal.",
          number: "01",
        },
        {
          id: 2,
          icon: "❤️",
          title: "Save Your Favorites",
          description:
            "Keep track of recipes you love and easily find your favorite dishes whenever you need them.",
          number: "02",
        },
        {
          id: 3,
          icon: "👨‍🍳",
          title: "Meet Food Experts",
          description:
            "Connect with professional chefs and learn from their culinary experience and expertise.",
          number: "03",
        },
        {
          id: 4,
          icon: "🤝",
          title: "Join the Community",
          description:
            "Share your food passion, discover popular dishes, and get inspired by fellow food lovers.",
          number: "04",
        },
      ].map((feature) => (
        <motion.article
          key={feature.id}
          variants={cardVariants}
          whileHover={{
            y: -8,
            transition: { duration: 0.25 },
          }}
          className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gray-50/80 p-7 transition-all duration-300 hover:border-orange-200 hover:bg-white hover:shadow-xl hover:shadow-orange-500/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-500/40 dark:hover:bg-gray-900"
        >
          {/* Number */}
          <span className="absolute right-6 top-5 text-sm font-bold text-gray-300 transition-colors group-hover:text-orange-300 dark:text-gray-700">
            {feature.number}
          </span>

          {/* Icon */}
          <motion.div
            whileHover={{ rotate: -8, scale: 1.1 }}
            className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl shadow-sm transition-colors group-hover:bg-orange-500 dark:bg-orange-500/10"
          >
            <span className="transition-transform group-hover:scale-110">
              {feature.icon}
            </span>
          </motion.div>

          {/* Content */}
          <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-orange-500 dark:text-white">
            {feature.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
            {feature.description}
          </p>

          {/* Bottom Accent */}
          <div className="mt-6 h-1 w-12 rounded-full bg-orange-400 transition-all duration-300 group-hover:w-20" />
        </motion.article>
      ))}
    </motion.div>

    {/* Bottom CTA */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-14 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-10 text-center shadow-xl shadow-orange-500/15 sm:px-12"
    >
      <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
        Ready to Discover Your Next Favorite Dish?
      </h3>

      <p className="mx-auto mt-3 max-w-xl leading-7 text-white/90">
        Explore recipes, save your favorites, and make every meal
        a little more exciting.
      </p>

      <Link
        href="/recipes"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-orange-600 shadow-md transition-all duration-300 hover:scale-105 hover:bg-orange-50 active:scale-95"
      >
        Explore Recipes
        <ArrowUpRight size={19} />
      </Link>
    </motion.div>
  </div>
</section>
    </>
  );
}
