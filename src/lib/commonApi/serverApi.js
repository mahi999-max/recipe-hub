import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { signToken } from "@/lib/token";

const uri = "https://recipe-hub-server-inky.vercel.app";

export const getapiAuth = async (req) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const token = session?.user ? signToken(session.user) : null;

  const res = await fetch(`${uri}${req}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  return await res.json();
};