
"use client";

import { authClient } from "@/lib/auth-client";
import { getapi } from "@/lib/commonApi/api";
import { useEffect, useState } from "react";

export default function OverviewPage() {
  const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const [totalFoods, setTotalFoods] = useState(0);
  const [totalFavourites, setTotalFavourites] = useState(0);
  const [totalPurchased, setTotalPurchased] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  useEffect(() => {
    if (isPending) return;

    const loadDashboardData = async () => {
      try {
        // Total foods: আগের working helper ব্যবহার
        const foodsRes = await getapi("/api/allFoods");

        const foods = Array.isArray(foodsRes)
          ? foodsRes
          : foodsRes?.data || [];

        setTotalFoods(foods.length);

        if (!user?.id || !user?.email) {
          console.log("Session user:", user);
          return;
        }

        // Favourite: direct fetch
        const favResponse = await fetch(
          `${uri}/api/allFoods/likes/${encodeURIComponent(user.id)}`
        );

        if (!favResponse.ok) {
          throw new Error(`Favourite API: ${favResponse.status}`);
        }

        const favData = await favResponse.json();
        setTotalFavourites(favData.length);

        // Purchased: direct fetch with email
        // Purchased: নিজের Next.js route দিয়ে (সার্ভারে টোকেন বানিয়ে)
        const purchaseResponse = await fetch("/api/purchases/count");

        if (!purchaseResponse.ok) {
          throw new Error(`Purchase API: ${purchaseResponse.status}`);
        }

        const purchaseData = await purchaseResponse.json();
        setTotalPurchased(purchaseData.count);

      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isPending, user?.id, user?.email]);


  const cards = [
    {
      title: "Total Food Collection",
      value: totalFoods,
    },
    {
      title: "Total Favourites",
      value: totalFavourites,
    },
    {
      title: "Total Purchased",
      value: totalPurchased,
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-4">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="p-4 border rounded-xl shadow-sm bg-card min-w-0"
          >
            <h2 className="text-muted-foreground text-sm">
              {card.title}
            </h2>

            <p className="text-2xl font-bold mt-2">
              {loading ? "Loading..." : card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
