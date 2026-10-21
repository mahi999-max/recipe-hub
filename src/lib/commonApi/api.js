const uri = "https://recipe-hub-server-inky.vercel.app";

export const getapi = async (req) => {
  try {
    const res = await fetch(`${uri}${req}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};