import { useEffect, useState } from 'react';
import { Download, RefreshCcw } from 'lucide-react';
import { api } from '../services/api';
import type { CategoryData, FilterParams } from '../services/api';
import { exportToCSV, exportToExcel } from '../utils/exportData';
import { FilterBar } from '../components/FilterBar';

export const CategoryAnalysis = () => {
    const [data, setData] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalTickets, setTotalTickets] = useState(0);
    const [filters, setFilters] = useState<FilterParams>({});

    const fetchData = async (currentFilters: FilterParams = {}) => {
        setLoading(true);
        try {
            const result = await api.getCategoryAnalysis(currentFilters);
            setData(result.data);
            setTotalTickets(result.total_tickets);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(filters);
    }, [filters]);

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    const handleExportCSV = () => {
        const exportData = data.map((item, index) => ({
            Rank: index + 1,
            'Issue Category': item['Issue Category'],
            Count: item.Count,
            'Distribution %': ((item.Count / totalTickets) * 100).toFixed(2) + '%',
        }));
        exportToCSV(exportData, 'category-analysis');
    };

    const handleExportExcel = () => {
        const exportData = data.map((item, index) => ({
            Rank: index + 1,
            'Issue Category': item['Issue Category'],
            Count: item.Count,
            'Distribution %': ((item.Count / totalTickets) * 100).toFixed(2) + '%',
        }));
        exportToExcel(exportData, 'category-analysis');
    };

    if (loading && data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Issue Category Deep-Dive
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Granular breakdown of support categories and operational bottlenecks
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {loading && (
                        <div className="flex items-center gap-2 text-blue-500 mr-2">
                            <RefreshCcw className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Updating...</span>
                        </div>
                    )}
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                    >
                        <Download className="w-4 h-4" />
                        CSV
                    </button>
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                    >
                        <Download className="w-4 h-4" />
                        Excel
                    </button>
                </div>
            </div>

            {/* Filters */}
            <FilterBar onFilterChange={handleFilterChange} />

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Issue Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Count
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Distribution
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {data.map((item, index) => {
                                const percentage = totalTickets > 0 ? (item.Count / totalTickets) * 100 : 0;
                                return (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            #{index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {item['Issue Category']}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                            {item.Count}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[50px]">
                                                    {percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                        No categories found matching the criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Total {data.length} categories identified
            </p>
        </div>
    );
};
