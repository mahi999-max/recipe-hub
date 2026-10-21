import { Suspense } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { LoaderCircle } from "lucide-react";
import FoodDetailsView from "./FoodDetailsView";
import { auth } from "@/lib/auth";

const FoodDetailsContent = async ({ params }) => {
  const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const { id } = await params;

  const response = await fetch(`${uri}/api/allFoods/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }
  const food = await response.json();

  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  let purchased = false;
  if (email) {
    try {
      const checkRes = await fetch(
        `${uri}/api/purchases/check?email=${encodeURIComponent(email)}&foodId=${id}`,
        { cache: "no-store" }
      );
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        purchased = checkData.purchased;
      }
    } catch (error) {
      console.error("Purchase check error:", error);
    }
  }

  return (
    <FoodDetailsView
      food={food}
      foodId={id}
      email={email}
      purchased={purchased}
    />
  );
};

// এই wrapper-ই default export, async না
export default function FoodDetailsPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoaderCircle className="animate-spin text-orange-500" size={32} />
        </div>
      }
    >
      <FoodDetailsContent params={params} />
    </Suspense>
  );
}