import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Ticket, RefreshCcw } from 'lucide-react';
import { api } from '../services/api';
import type { FullAnalysisResponse, FilterParams } from '../services/api';
import { FilterBar } from '../components/FilterBar';

const COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#06b6d4', '#6366f1', '#f97316', '#14b8a6', '#a855f7'
];

export const Overview = () => {
    const [data, setData] = useState<FullAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterParams>({});

    const fetchData = async (currentFilters: FilterParams = {}) => {
        setLoading(true);
        try {
            const result = await api.getFullAnalysis(currentFilters);
            setData(result);
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

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!data) {
        return <div className="text-center text-red-500 mt-10">Failed to load data</div>;
    }

    const topCategories = data.category_analysis.data.slice(0, 10);
    const topClients = data.client_analysis.data.slice(0, 10);

    const metrics = [
        {
            title: 'Total Support Tickets',
            value: data.total_tickets.toLocaleString(),
            icon: Ticket,
            trend: '+12%',
            trendLabel: 'from last month',
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Active Clients',
            value: data.client_analysis.total_clients,
            icon: Users,
            trend: '+2',
            trendLabel: 'new this week',
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Issue Categories',
            value: data.category_analysis.total_categories,
            icon: TrendingUp,
            trend: '16',
            trendLabel: 'total categories',
            color: 'from-pink-500 to-pink-600',
        },
        {
            title: 'Avg Resolution Time',
            value: '3.2 days',
            icon: Clock,
            trend: '-0.5',
            trendLabel: 'days since last report',
            color: 'from-green-500 to-green-600',
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Ticket Analysis Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Comprehensive overview of support ticket metrics and trends
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color}`}>
                                <metric.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-green-500 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {metric.trend}
                            </span>
                        </div>
                        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                            {metric.title}
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {metric.value}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            {metric.trendLabel}
                        </p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Top 10 Issue Categories - Horizontal Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Top 10 Issue Categories
                    </h2>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCategories} layout="vertical" margin={{ left: 150 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis type="number" stroke="#9ca3af" />
                                <YAxis
                                    dataKey="Issue Category"
                                    type="category"
                                    stroke="#9ca3af"
                                    width={140}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff',
                                    }}
                                />
                                <Bar dataKey="Count" radius={[0, 8, 8, 0]}>
                                    {topCategories.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top 10 High-Activity Clients - Vertical Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Top 10 High-Activity Clients
                    </h2>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topClients} margin={{ bottom: 80 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis
                                    dataKey="Client"
                                    stroke="#9ca3af"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                    tick={{ fontSize: 11 }}
                                />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff',
                                    }}
                                />
                                <Bar dataKey="Tickets Raised" radius={[8, 8, 0, 0]}>
                                    {topClients.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
