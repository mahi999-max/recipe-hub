'use client'
import React, { useState } from 'react';
import { getUseSession } from '@/lib/api/getApi';
import Link from 'next/link';
import { Users, Utensils, Crown, AlertTriangle, LayoutDashboard, House, Blender, ShoppingCart, KanbanSquare, DollarSign, Menu, X } from 'lucide-react';
import { CgAdd } from 'react-icons/cg';
import { PersonGear, Persons, StarFill } from '@gravity-ui/icons';

export default function DashboardSidebar() {
  const user = getUseSession();
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@gmail.com';
  console.log("User Role: ", user?.role);
  // console.log("User Role: ",user?.role);
  // সাধারণ ইউজারের ড্যাশবোর্ড আইটেম
  const [isOpen, setIsOpen] = useState(false);

  const normalUserLinks = [
    { icon: House, label: "Overview", href: '/dashboard/user/overview' },
    { icon: Blender, label: "My Recipes", href: '/dashboard/user/my-recipe' },
    { icon: CgAdd, label: "Add Recipe", href: '/dashboard/user/add-recipe' },
    { icon: StarFill, label: "My Favourite", href: '/dashboard/user/fav' },
    { icon: ShoppingCart, label: "My Purchased Recipes", href: '/dashboard/user/purchased' },
    { icon: PersonGear, label: "Profile", href: '/dashboard/user/profile' },
  ];

  // অ্যাডমিন ইউজারের জন্য স্পেসিফিক ৪টি আইটেম
  const adminLinks = [
    { label: "Overview", href: "/dashboard/admin/overview", icon: House },
    { label: "Manage Users", href: "/dashboard/admin/admin-users", icon: Persons },
    { label: "Manage Recipes", href: "/dashboard/admin/admin-recipes", icon: KanbanSquare },
    { label: "Recipe Reports", href: "/dashboard/admin/admin-reports", icon: AlertTriangle },
    { label: "Transactions", href: "/dashboard/admin/admin-transactions", icon: DollarSign },
  ];

  // রোল অনুযায়ী লিংক নির্ধারণ
  const menuLinks = isAdmin ? adminLinks : normalUserLinks;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg
        bg-white dark:bg-gray-900 border border-gray-200
        dark:border-gray-700 shadow"
        aria-label="Open dashboard menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
    fixed inset-y-0 left-0 z-50
w-64 min-h-screen shrink-0
lg:static lg:inset-auto lg:z-auto
    bg-white dark:bg-gray-900
    border-r border-gray-200 dark:border-gray-800 p-4
    transform transition-transform duration-300 ease-in-out

    ${isOpen ? "translate-x-0" : "-translate-x-full"}

    lg:static lg:translate-x-0
  `}
      >

        {/* Sidebar Header */}
        <div className="mb-8 px-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isAdmin ? "Admin Dashboard" : "User Dashboard"}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Role: {user?.role}
            </p>
          </div>

          {/* Close Button - Mobile Only */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-gray-600 dark:text-gray-300"
            aria-label="Close dashboard menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {menuLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3
                text-sm font-semibold rounded-xl
                text-gray-700 dark:text-gray-300
                hover:bg-orange-50 hover:text-orange-600
                dark:hover:bg-gray-800 transition-colors"
              >
                <Icon size={19} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}