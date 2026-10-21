"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // server আর client-এর আইকন না মিললে hydration error হয়, তাই mount-এর পর দেখাই
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <div className="h-10 w-10" />;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="rounded-xl border border-gray-200 p-2.5 text-gray-700 transition hover:bg-orange-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}