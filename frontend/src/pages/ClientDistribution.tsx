import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, TrendingUp, Download, RefreshCcw } from 'lucide-react';
import { api } from '../services/api';
import type { ClientData, FilterParams } from '../services/api';
import { exportToCSV, exportToExcel } from '../utils/exportData';
import { FilterBar } from '../components/FilterBar';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316', '#14b8a6', '#a855f7'];

export const ClientDistribution = () => {
    const [data, setData] = useState<ClientData[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalTickets, setTotalTickets] = useState(0);
    const [filters, setFilters] = useState<FilterParams>({});

    const fetchData = async (currentFilters: FilterParams = {}) => {
        setLoading(true);
        try {
            const result = await api.getClientAnalysis(currentFilters);
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
        exportToCSV(data, 'client-distribution');
    };

    const handleExportExcel = () => {
        exportToExcel(data, 'client-distribution');
    };

    if (loading && data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const topClients = data.slice(0, 10);
    const pieData = topClients.map(item => ({
        name: item.Client,
        value: item['Tickets Raised'],
    }));

    const mostActiveClient = data.length > 0 ? data[0] : null;

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Client Relationship Analysis
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Activity distribution across your client portfolio
                    </p>
                </div>
                {loading && (
                    <div className="flex items-center gap-2 text-blue-500">
                        <RefreshCcw className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-medium">Updating...</span>
                    </div>
                )}
            </div>

            {/* Filters */}
            <FilterBar onFilterChange={handleFilterChange} showSearch={false} />

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6" />
                        <h3 className="text-sm font-medium opacity-90">Total Clients</h3>
                    </div>
                    <p className="text-4xl font-bold">{data.length}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6" />
                        <h3 className="text-sm font-medium opacity-90">Most Active Client</h3>
                    </div>
                    <p className="text-2xl font-bold truncate">{mostActiveClient?.Client || '-'}</p>
                    <p className="text-sm opacity-90 mt-1">{mostActiveClient?.['Tickets Raised'] || 0} tickets</p>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6" />
                        <h3 className="text-sm font-medium opacity-90">Total Tickets</h3>
                    </div>
                    <p className="text-4xl font-bold">{totalTickets.toLocaleString()}</p>
                </div>
            </div>

            {/* Charts and Table */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Top 10 Client Share
                    </h2>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Client Ranking Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Client Ranking
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors duration-200"
                            >
                                <Download className="w-4 h-4" />
                                CSV
                            </button>
                            <button
                                onClick={handleExportExcel}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors duration-200"
                            >
                                <Download className="w-4 h-4" />
                                Excel
                            </button>
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-[400px]">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Rank
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Client
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Tickets
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150"
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                            #{index + 1}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                            {item.Client}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-right text-gray-900 dark:text-white">
                                            {item['Tickets Raised']}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
