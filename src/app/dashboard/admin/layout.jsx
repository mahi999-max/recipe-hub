import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/lib/DashboardSidebar";

const AdminGuard = async ({ children }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/login");
  }
  if (session.user.role !== "admin") {
    redirect("/dashboard/user/profile");
  }

  return children;
};

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        {/* ফ্লেক্সবক্স ব্যবহার করা হলো যাতে সাইডবার এবং কন্টেন্ট পাশাপাশি থাকে */}
        <div className="flex min-h-screen">
          {/* সাইডবারের জন্য নির্দিষ্ট উইডথ */}
          <aside>
            <DashboardSidebar />
          </aside>

          {/* মেইন কন্টেন্ট বাকি জায়গা জুড়ে থাকবে */}
          <main className="flex-1 min-w-0 w-0 max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </AdminGuard>
    </Suspense>
  );
}