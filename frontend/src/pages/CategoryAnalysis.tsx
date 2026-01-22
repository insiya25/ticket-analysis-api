import { useEffect, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { api } from '../services/api';
import type { CategoryData } from '../services/api';
import { exportToCSV, exportToExcel } from '../utils/exportData';

export const CategoryAnalysis = () => {
    const [data, setData] = useState<CategoryData[]>([]);
    const [filteredData, setFilteredData] = useState<CategoryData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [totalTickets, setTotalTickets] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.getCategoryAnalysis();
                setData(result.data);
                setFilteredData(result.data);
                setTotalTickets(result.total_tickets);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = data.filter(item =>
            item['Issue Category'].toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    const handleExportCSV = () => {
        const exportData = filteredData.map((item, index) => ({
            Rank: index + 1,
            'Issue Category': item['Issue Category'],
            Count: item.Count,
            'Distribution %': ((item.Count / totalTickets) * 100).toFixed(2) + '%',
        }));
        exportToCSV(exportData, 'category-analysis');
    };

    const handleExportExcel = () => {
        const exportData = filteredData.map((item, index) => ({
            Rank: index + 1,
            'Issue Category': item['Issue Category'],
            Count: item.Count,
            'Distribution %': ((item.Count / totalTickets) * 100).toFixed(2) + '%',
        }));
        exportToExcel(exportData, 'category-analysis');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Issue Category Deep-Dive
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Granular breakdown of support categories and operational bottlenecks
                </p>
            </div>

            {/* Search and Export */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex gap-2">
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
                            {filteredData.map((item, index) => {
                                const percentage = (item.Count / totalTickets) * 100;
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
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredData.length} of {data.length} categories
            </p>
        </div>
    );
};
