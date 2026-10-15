"use client";

import { useState } from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChefHat,
  House,
  BookOpen,
  LayoutDashboard,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { getUseSession } from "./api/getApi";
import { authClient } from "./auth-client";
import Image from "next/image";

const Logout = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect("/auth/login");
      },
    },
  });
};

export default function Navbar() {
  // হুক বা সেশন ডেটা কম্পোনেন্টের ভেতরে কল করা হলো
  const user = getUseSession();
  console.log("Active user: ", user);

  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navLinks = [
    { name: "Home", href: "/", icon: House },
    { name: "Browse Recipes", href: "/recipes", icon: BookOpen },
  ];

  // যদি ইউজার লগইন করা থাকে (active), তবেই নেভলিস্টে ড্যাশবোর্ড যোগ হবে
  if (user) {
    const dashboardHref=user?.role==='admin' ?'/dasboard/admin/overview' : '/dashboard/user/overview'
    navLinks.push({
      name: "Dashboard",
      href: dashboardHref,
      icon: LayoutDashboard,
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-default-200 bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Animated Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            whileHover={{ rotate: 12, scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md"
          >
            <ChefHat size={27} strokeWidth={2.2} />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="text-2xl font-extrabold tracking-tight text-foreground"
          >
            Recipe
            <span className="text-primary">Hub</span>
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive(href)
                  ? "text-orange-500 bg-orange-50"
                  : "text-default-600 hover:bg-default-100 hover:text-foreground"
              }`}
            >
              <Icon size={17} />
              {name}

              {isActive(href) && (
                <motion.span
                  layoutId="navbar-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-primary/10"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Authentication Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <div>HI !! {user?.name}</div>
              {user?.image && (
                <Image 
                  src={user.image} 
                  height={30} 
                  width={30} 
                  className="rounded-full object-cover" 
                  alt="image" 
                />
              )}
              <button
                onClick={() => Logout()}
                className="flex items-center justify-center gap-2 rounded-xl border border-default-200 px-3 py-3 text-sm font-semibold text-foreground hover:bg-default-100 cursor-pointer"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-default-200 px-3 py-3 text-sm font-semibold text-foreground hover:bg-default-100"
              >
                <LogIn size={17} />
                Login
              </Link>

              <Link
                href="/auth/registerPage"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
              >
                <UserPlus size={17} />
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-default-100 md:hidden"
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={
          isOpen
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden md:hidden"
      >
        <div className="space-y-2 border-t border-default-200 px-4 py-4 sm:px-6">
          {navLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                isActive(href)
                  ? "bg-primary/10 text-primary"
                  : "text-default-600 hover:bg-default-100"
              }`}
            >
              <Icon size={19} />
              {name}
            </Link>
          ))}

          <div className="grid grid-cols-2 gap-3 pt-2">
            {user ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  Logout();
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-default-200 px-3 py-3 text-sm font-semibold text-foreground hover:bg-default-100"
              >
                <LogOut size={17} />
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-default-200 px-3 py-3 text-sm font-semibold text-foreground hover:bg-default-100"
                >
                  <LogIn size={17} />
                  Login
                </Link>

                <Link
                  href="/auth/registerPage"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
                >
                  <UserPlus size={17} />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
}