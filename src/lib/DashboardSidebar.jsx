'use client'
import React from 'react';
import { getUseSession } from '@/lib/api/getApi';
import Link from 'next/link';
import { Users, Utensils, Crown, AlertTriangle, LayoutDashboard, House, Blender, ShoppingCart, KanbanSquare, DollarSign } from 'lucide-react';
import { CgAdd } from 'react-icons/cg';
import { PersonGear, Persons, StarFill } from '@gravity-ui/icons';

export default function DashboardSidebar() {
  const user = getUseSession();
const isAdmin = user?.role === 'admin' || user?.email === 'admin@gmail.com';
console.log("User Role: ", user?.role);
// console.log("User Role: ",user?.role);
  // সাধারণ ইউজারের ড্যাশবোর্ড আইটেম
  const normalUserLinks = [
    {icon: House, label: "Overview", href:'/dashboard/user/overview'},
    {icon: Blender, label: "My Recipes",href:'/dashboard/user/my-recipe'},
    {icon: CgAdd, label: "Add Recipe",href:'/dashboard/user/add-recipe'},
    {icon: StarFill, label: "My Favourite",href:'/dashboard/user/fav'},
    {icon: ShoppingCart, label: "My Purchased Recipes",href:'/dashboard/user/purchased'},
    {icon: PersonGear, label: "Profile",href:'/dashboard/user/profile'},
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
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      <div className="mb-8 px-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isAdmin ? "Admin Dashboard" : "User Dashboard"}
        </h2>
        <p className="text-xs text-gray-500 mt-1">Role: {user?.role}</p>
      </div>

      <nav className="space-y-2">
        {menuLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon size={19} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}