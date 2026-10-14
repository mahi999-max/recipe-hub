import { Suspense } from "react";
import FoodDetailsContent from "./FoodDetailsContent";

const FoodDetailsPage = async ({ params }) => {

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading recipe details...</div>}>
      <FoodDetailsContent params={params} />
    </Suspense>
  );
};

export default FoodDetailsPage;