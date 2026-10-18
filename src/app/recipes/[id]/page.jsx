
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
    headers: await headers()
});
console.log(session?.user?.email);
     const email=session?.user?.email


  return <FoodDetailsView food={food} foodId={id} email={email}/>;
};

export default FoodDetailsContent;
