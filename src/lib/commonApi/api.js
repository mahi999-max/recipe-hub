const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const getapi = async (req) => {
  const res = await fetch(`${uri}${req}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  return await res.json();
};