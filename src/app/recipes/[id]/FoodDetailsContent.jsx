import Image from "next/image";
import { notFound } from "next/navigation";

const FoodDetailsContent = async ({ params }) => {
    const {id}=await params
  const response = await fetch(
    `http://localhost:5000/api/allFoods/${id}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    notFound();
  }

  const food = await response.json();

  return (
     <main className="mx-auto max-w-4xl p-6">
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
        {food.imageUrl && (
          <div className="relative h-80">
            <Image
              src={food.imageUrl}
              alt={food.title || "Recipe"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        <div className="space-y-5 p-6">
          <h1 className="text-3xl font-bold">{food.title}</h1>

          <p>{food.description}</p>

          <p>Category: {food.category}</p>
          <p>Cuisine: {food.cuisine}</p>
          <p>Prep Time: {food.prepTime} minutes</p>
          <p>Cook Time: {food.cookTime} minutes</p>
          <p>Ingredients: {food.ingredients}</p>

          <h2 className="text-xl font-bold">Instructions</h2>

          <ol className="list-inside list-decimal space-y-3">
            {food.instructions?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>

          <p>Price: ${food.price}</p>
        </div>
      </div>
    </main>
  );
};

export default FoodDetailsContent;