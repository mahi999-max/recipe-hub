'use client'
import { getAllfood, getAllReports, getAllUsers, getUseSession } from '@/lib/api/getApi';
import { AlertTriangle, Crown, Users, Utensils } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import TotalUsers from '../admin-users/page';

const AdminOverview = () => {
      const [users, setUsers] = useState([]);
      const[recipe, setrecipies]=useState([])
      const[report,setreport]=useState([])
    // const user=getAllUsers()
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                const recipe=await getAllfood()
                const report=await getAllReports()
                console.log("Fetched Users:", data);
                setUsers(Array.isArray(data) ? data : []);
                setrecipies(Array.isArray(recipe) ? recipe : []) 
                setreport(Array.isArray(report) ? report : []) 
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers()
    },[]
)
    console.log(users);
  const userArray = Array.isArray(users) ? users : [];
 const recipeArray=Array.isArray(recipe) ? recipe : []
 const reportArray=Array.isArray(report) ? report : []
    
    const statdata = {
        TotalUsers: userArray.length,
        // এখানে role === "premium" অথবা আপনার প্রপার্টি অনুযায়ী ফিল্টার করা হয়েছে
        TotalPremium: userArray.filter(u => u?.role === "premium" || u?.isPremium === true).length,
        TotalRecipies: recipeArray.length,
        TotalReports: reportArray.length
    };
   const stats = [
    {
      title: "Total Users",
      count: statdata.TotalUsers,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      description: "Active registered users"
    },
    {
      title: "Total Recipes",
      count: statdata.TotalRecipies,
      icon: Utensils,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      description: "Published food recipes"
    },
    {
      title: "Total Premium Members",
      count: statdata.TotalPremium,
      icon: Crown,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      description: "Active premium subscribers"
    },
    {
      title: "Total Reports",
      count: statdata.TotalReports,
      icon: AlertTriangle,
      color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
      description: "Pending reports to review"
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Admin Overview
        </h1>
        <p className="text-sm text-gray-500">Welcome back, Admin!</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
                    {stat.count}
                  </h3>
                </div>
                <div className={`p-4 rounded-2xl border ${stat.color}`}>
                  <Icon size={28} />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

)};

export default AdminOverview;