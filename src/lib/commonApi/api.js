const uri = "http://localhost:5000";

export const getapi = async (req) => {
  const res = await fetch(`${uri}${req}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};