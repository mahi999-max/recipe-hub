

"use client";

import { useState } from "react";
// import { blockUser } from "@/lib/api/getApi";
import { useRouter } from "next/navigation";
import { blockUser } from "@/lib/actions/core";

export default function UserActions({ userId, isBlocked }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggleBlock = async () => {
    const action = isBlocked ? "unblock" : "block";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await blockUser(userId, !isBlocked);

      router.refresh();
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleBlock}
      disabled={loading}
      className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
        isBlocked
          ? "bg-green-600 hover:bg-green-700"
          : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {loading
        ? "Please wait..."
        : isBlocked
          ? "Unblock"
          : "Block"}
    </button>
  );
}