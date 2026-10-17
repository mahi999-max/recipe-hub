



import { getAllUsers } from "@/lib/api/getApi";
import Image from "next/image";
import { ShieldCheck, ShieldAlert, Users } from "lucide-react";
import UserActions from "./UserActions";

const TotalUsers = async () => {
    const allUsers = await getAllUsers();

    const users = Array.isArray(allUsers) ? allUsers : [];

    return (
        <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-500/10">
                        <Users size={26} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                            Manage Users
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            View and manage all registered users.
                        </p>
                    </div>
                </div>
            </div>

            {/* Total Users */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Registered Users
                </p>
                <h2 className="mt-2 text-3xl font-bold text-orange-600">
                    {users.length}
                </h2>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left">
                        <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {users.map((user) => {
                                const role = (
                                    user.role ||
                                    user.userType ||
                                    "user"
                                ).toLowerCase();

                                const isAdmin = role === "admin";
                                const isBlocked = user.isBlocked === true;

                                return (
                                    <tr
                                        key={user._id || user.id || user.email}
                                        className="transition-colors hover:bg-orange-50/50 dark:hover:bg-gray-800/50"
                                    >
                                        {/* Image */}
                                        <td className="px-6 py-4">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                                                {user.image ? (
                                                    <Image
                                                        src={user.image}
                                                        alt={user.name || "User"}
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center font-bold text-orange-600">
                                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Name */}
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {user.name || "Unnamed User"}
                                            </p>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {user.email}
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isAdmin
                                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300"
                                                    : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                                                    }`}
                                            >
                                                {isAdmin && <ShieldCheck size={14} />}
                                                {role}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-4 text-center">
                                            {isAdmin ? (
                                                <span className="text-xs font-medium text-gray-400">
                                                    Not applicable
                                                </span>
                                            ) : (
                                                <UserActions
                                                    userId={String(user._id || user.id)}
                                                    isBlocked={user.isBlocked === true}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {users.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TotalUsers;