'use client'
import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle2, AlertTriangle, ChefHat } from 'lucide-react';

export default function ManageReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const uri = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const fetchReports = async () => {
        try {
            const res = await fetch(`${uri}/api/reports`);
            const data = await res.json();
            setReports(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleRemoveFood = async (reportId, foodId) => {
        if (!window.confirm("Are you sure you want to delete this recipe permanently?")) return;

        try {
            await fetch(`${uri}/api/allFoods/${foodId}`, {
                method: 'DELETE',
            });

            await fetch(`${uri}/api/reports/${reportId}`, {
                method: 'DELETE',
            });

            setReports(prev => prev.filter(report => report._id !== reportId));
            alert("Recipe removed and report cleared successfully.");
        } catch (error) {
            console.error("Error removing food:", error);
        }
    };

    const handleDismissReport = async (reportId) => {
        if (!window.confirm("Are you sure you want to dismiss this report?")) return;

        try {
            await fetch(`${uri}/api/reports/${reportId}`, {
                method: 'DELETE',
            });

            setReports(prev => prev.filter(report => report._id !== reportId));
        } catch (error) {
            console.error("Error dismissing report:", error);
        }
    };

    if (loading) {
        return <div className="text-center py-20 font-semibold text-gray-500">Loading reports...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Manage Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Review user reports and take moderation actions.</p>
                </div>
                <span className="bg-orange-100 text-orange-600 dark:bg-orange-500/20 px-4 py-1.5 rounded-full font-bold text-sm">
                    Total Reports: {reports.length}
                </span>
            </div>

            {reports.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <AlertTriangle size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No reports found!</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                                <th className="px-6 py-4">Food ID</th>
                                <th className="px-6 py-4">Reporter Email</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                            {reports.map((report) => (
                                <tr key={report._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{report.foodId}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{report.email || report.userId || "Anonymous"}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                                            {report.reason}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {report.time ? new Date(report.time).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Remove Food Button */}
                                            <button
                                                onClick={() => handleRemoveFood(report._id, report.foodId)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs shadow-md shadow-red-600/20 transition-all"
                                                title="Delete food from database"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>

                                            {/* Dismiss Report Button */}
                                            <button
                                                onClick={() => handleDismissReport(report._id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-xs transition-all"
                                                title="Dismiss report"
                                            >
                                                <CheckCircle2 size={14} />
                                                Dismiss
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}