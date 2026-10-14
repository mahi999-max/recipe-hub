"use client";

import { useState } from "react";
import { Plus, Trash2, ChefHat } from "lucide-react";
import { addRecipe } from "@/lib/actions/addRecipe";
import { getUseSession } from "@/lib/api/getApi";

export default function AddRecipe() {
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);

  const [loading, setLoading] = useState(false);
  const user=getUseSession()
  console.log(user);
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    const newRecipe = {
      ...data,
      prepTime: Number(data.prepTime),
      cookTime: Number(data.cookTime),
      price: Number(data.price),
      ingredients: ingredients
        .filter((item) => item.trim())
        .join(", "),
      instructions: instructions.filter((item) => item.trim()),
      likeCount: 0,
      favouriteCount: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      userId:user?._id
    };

    const result = await addRecipe(newRecipe);

    console.log("Recipe added:", result);
    alert("Recipe added successfully!");

    form.reset();
    setIngredients([""]);
    setInstructions([""]);
  } catch (error) {
    console.error("Failed to add recipe:", error);
    alert("Failed to add recipe!");
  } finally {
    setLoading(false);
  }
};

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-orange-50/50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <ChefHat size={27} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Add New Recipe
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Share your delicious recipe with everyone.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-8"
        >
          {/* Basic Information */}
          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-800">
              Basic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>Recipe Title *</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Classic Margherita Pizza"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Describe your recipe..."
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Image URL *</label>
                <input
                  type="url"
                  name="imageUrl"
                  required
                  placeholder="https://example.com/recipe.jpg"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  name="category"
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option>Pizza</option>
                  <option>Pasta</option>
                  <option>Rice</option>
                  <option>Burger</option>
                  <option>Salad</option>
                  <option>Soup</option>
                  <option>Dessert</option>
                  <option>Breakfast</option>
                  <option>Seafood</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Cuisine *</label>
                <select
                  name="cuisine"
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select cuisine
                  </option>
                  <option>Italian</option>
                  <option>Indian</option>
                  <option>Bangladeshi</option>
                  <option>Chinese</option>
                  <option>American</option>
                  <option>Mexican</option>
                  <option>French</option>
                  <option>Mediterranean</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Cooking Details */}
          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-800">
              Cooking Details
            </h2>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Prep Time (min) *</label>
                <input
                  type="number"
                  name="prepTime"
                  min="0"
                  required
                  placeholder="20"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Cook Time (min) *</label>
                <input
                  type="number"
                  name="cookTime"
                  min="0"
                  required
                  placeholder="30"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  placeholder="4.99"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Ingredients */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-gray-800">
                Ingredients
              </h2>

              <button
                type="button"
                onClick={() => setIngredients([...ingredients, ""])}
                className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                <Plus size={17} /> Add Ingredient
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={ingredient}
                    required={index === 0}
                    onChange={(e) =>
                      setIngredients((prev) =>
                        prev.map((item, i) =>
                          i === index ? e.target.value : item
                        )
                      )
                    }
                    placeholder={`Ingredient ${index + 1}`}
                    className={inputClass}
                  />

                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setIngredients((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="rounded-xl p-3 text-red-500 hover:bg-red-50"
                      aria-label="Remove ingredient"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Instructions */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-gray-800">
                Instructions
              </h2>

              <button
                type="button"
                onClick={() => setInstructions([...instructions, ""])}
                className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                <Plus size={17} /> Add Step
              </button>
            </div>

            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="mt-2 flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                    {index + 1}
                  </span>

                  <textarea
                    value={instruction}
                    required={index === 0}
                    onChange={(e) =>
                      setInstructions((prev) =>
                        prev.map((item, i) =>
                          i === index ? e.target.value : item
                        )
                      )
                    }
                    rows={2}
                    placeholder={`Step ${index + 1}`}
                    className={inputClass}
                  />

                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setInstructions((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="mt-2 rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label="Remove step"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="reset"
              onClick={() => {
                setIngredients([""]);
                setInstructions([""]);
              }}
              className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 active:scale-95"
            >
              <Plus size={18} />
              Add Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}