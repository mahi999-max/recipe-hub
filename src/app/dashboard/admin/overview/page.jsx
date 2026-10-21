import { Suspense } from "react";
import { AlertTriangle, Crown, Users, Utensils, LoaderCircle } from "lucide-react";
import { getAllfood } from "@/lib/api/getApi";
import { getAllReports, getAllUsers } from "@/lib/api/getApiServer";

const safe = async (fn) => {
  try {
    const data = await fn();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Overview fetch error:", error);
    return [];
  }
};

const OverviewContent = async () => {
  const [userArray, recipeArray, reportArray] = await Promise.all([
    safe(getAllUsers),
    safe(getAllfood),
    safe(getAllReports),
  ]);

  const statdata = {
    TotalUsers: userArray.length,
    TotalPremium: userArray.filter(
      (u) => u?.role === "premium" || u?.isPremium === true
    ).length,
    TotalRecipies: recipeArray.length,
    TotalReports: reportArray.length,
  };

  const stats = [
    {
      title: "Total Users",
      count: statdata.TotalUsers,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      description: "Active registered users",
    },
    {
      title: "Total Recipes",
      count: statdata.TotalRecipies,
      icon: Utensils,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      description: "Published food recipes",
    },
    {
      title: "Total Premium Members",
      count: statdata.TotalPremium,
      icon: Crown,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      description: "Active premium subscribers",
    },
    {
      title: "Total Reports",
      count: statdata.TotalReports,
      icon: AlertTriangle,
      color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
      description: "Pending reports to review",
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
  );
};

const AdminOverview = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoaderCircle className="animate-spin text-orange-500" size={32} />
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
};

export default AdminOverview;