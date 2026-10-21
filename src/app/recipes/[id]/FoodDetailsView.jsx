
"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Flag,
  ShoppingCart,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChefHat,
  Utensils,
  Tags,
  LoaderCircle,
} from "lucide-react";

const reportOptions = [
  "Spam",
  "Offensive Content",
  "Copyright Issue",
];

const FoodDetailsView = ({ food, foodId, email, purchased }) => {
  const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!email) {
      window.location.href = "/auth/signin";
      return;
    }

    setPurchasing(true);

    try {
      const res = await fetch("/api/recipe_checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodId, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Purchase error:", error);
      alert(error.message || "Checkout failed");
      setPurchasing(false);
    }
  };

  const handleReport = async () => {
    if (!selectedReason) {
      setMessage("Please select a reason.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${uri}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foodId,
          email,
          reason: selectedReason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit report.");
      }

      setMessage("Report submitted successfully!");
      setSelectedReason("");

      setTimeout(() => {
        setIsReportOpen(false);
        setMessage("");
      }, 1200);
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl shadow-orange-100/50">

        {/* Food Image */}
        <div className="relative h-64 sm:h-96">
          {food.imageUrl ? (
            <Image
              src={food.imageUrl}
              alt={food.title || "Recipe"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-orange-100">
              <ChefHat size={72} className="text-orange-400" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 text-white sm:p-10">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold">
              <Utensils size={15} />
              {food.category || "Recipe"}
            </span>

            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              {food.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
              {food.description}
            </p>
          </div>
        </div>

        <div className="space-y-8 p-5 sm:p-10">

          {/* Recipe Information */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl bg-orange-50 p-5">
              <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                <Clock size={25} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Prep Time</p>
                <p className="text-lg font-bold text-gray-800">
                  {food.prepTime ?? "—"} min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-amber-50 p-5">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <ChefHat size={25} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cook Time</p>
                <p className="text-lg font-bold text-gray-800">
                  {food.cookTime ?? "—"} min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-emerald-50 p-5">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <Tags size={25} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cuisine</p>
                <p className="text-lg font-bold text-gray-800">
                  {food.cuisine || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <span className="h-7 w-1.5 rounded-full bg-orange-500" />
              Ingredients
            </h2>

            {Array.isArray(food.ingredients) ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {food.ingredients.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-700"
                  >
                    <CheckCircle
                      size={19}
                      className="mt-0.5 shrink-0 text-orange-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl bg-gray-50 p-4 text-gray-700">
                {food.ingredients || "No ingredients listed."}
              </p>
            )}
          </section>

          {/* Instructions */}
          <section>
            <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <span className="h-7 w-1.5 rounded-full bg-orange-500" />
              Cooking Instructions
            </h2>

            {Array.isArray(food.instructions) &&
              food.instructions.length > 0 ? (
              <ol className="space-y-4">
                {food.instructions.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4 leading-7 text-gray-700">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500">No instructions available.</p>
            )}
          </section>

          {/* Price and Actions */}
          <div className="flex flex-col gap-5 border-t border-gray-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Recipe Price</p>
              <p className="mt-1 text-3xl font-extrabold text-orange-600">
                ${food.price ?? 0}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => {
                  setMessage("");
                  setSelectedReason("");
                  setIsReportOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-6 py-3.5 font-semibold text-red-600 transition hover:border-red-500 hover:bg-red-50"
              >
                <Flag size={19} />
                Report
              </button>

              {purchased ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-6 py-3.5 font-semibold text-green-700">
                  <CheckCircle size={20} />
                  Purchased
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {purchasing ? (
                    <>
                      <LoaderCircle size={20} className="animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Purchase
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!loading) setIsReportOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h2 id="report-title" className="text-xl font-bold text-gray-900">
                    Report Recipe
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Why are you reporting this recipe?
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close report modal"
                disabled={loading}
                onClick={() => setIsReportOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {reportOptions.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setSelectedReason(reason);
                    setMessage("");
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${selectedReason === reason
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50/50"
                    }`}
                >
                  <span className="font-medium">{reason}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedReason === reason
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                      }`}
                  >
                    {selectedReason === reason && (
                      <CheckCircle size={15} className="text-white" />
                    )}
                  </span>
                </button>
              ))}
            </div>

            {message && (
              <p
                role="status"
                className={`mt-4 text-sm ${message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {message}
              </p>
            )}

            <button
              type="button"
              disabled={!selectedReason || loading}
              onClick={handleReport}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag size={18} />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default FoodDetailsView;
