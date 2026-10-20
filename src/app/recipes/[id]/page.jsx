
import { notFound } from "next/navigation";
import FoodDetailsView from "./FoodDetailsView";
import { getUseSession } from "@/lib/api/getApi";
import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const FoodDetailsContent = async ({ params }) => {
  const { id } = await params;

  const response = await fetch(
    `http://localhost:5000/api/allFoods/${id}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    notFound();
  }
  const food = await response.json();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const email = session?.user?.email;

  // এই user recipe-টা কিনেছে কিনা
  let purchased = false;
  if (email) {
    try {
      const checkRes = await fetch(
        `http://localhost:5000/api/purchases/check?email=${encodeURIComponent(email)}&foodId=${id}`,
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
export default FoodDetailsContent;
