import React, { useEffect, useState } from 'react';
import { Calendar, Search, X, ChevronDown, User } from 'lucide-react';
import { api } from '../services/api';

interface FilterBarProps {
    onFilterChange: (filters: {
        start_date?: string;
        end_date?: string;
        client_name?: string;
        search?: string;
    }) => void;
    initialFilters?: {
        start_date?: string;
        end_date?: string;
        client_name?: string;
        search?: string;
    };
    showSearch?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    onFilterChange,
    initialFilters = {},
    showSearch = true
}) => {
    const [clients, setClients] = useState<string[]>([]);
    const [startDate, setStartDate] = useState(initialFilters.start_date || '');
    const [endDate, setEndDate] = useState(initialFilters.end_date || '');
    const [clientName, setClientName] = useState(initialFilters.client_name || '');
    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
    const [isClientOpen, setIsClientOpen] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const result = await api.getClients();
                setClients(result.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchClients();
    }, []);

    const handleApply = () => {
        onFilterChange({
            start_date: startDate,
            end_date: endDate,
            client_name: clientName,
            search: searchTerm
        });
    };

    const handleClear = () => {
        setStartDate('');
        setEndDate('');
        setClientName('');
        setSearchTerm('');
        onFilterChange({});
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4 animate-fade-in">
            {/* Search Bar (if enabled) */}
            {showSearch && (
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap lg:flex-nowrap">
                {/* Date Filters */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-40">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
                            placeholder="Start Date"
                        />
                    </div>
                    <span className="text-gray-400">to</span>
                    <div className="relative flex-1 sm:w-40">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
                            placeholder="End Date"
                        />
                    </div>
                </div>

                {/* Client Filter */}
                <div className="relative w-full sm:w-64">
                    <button
                        onClick={() => setIsClientOpen(!isClientOpen)}
                        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none hover:bg-white dark:hover:bg-gray-800"
                    >
                        <div className="flex items-center gap-2 truncate">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{clientName || 'All Clients'}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isClientOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isClientOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsClientOpen(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                                <button
                                    onClick={() => {
                                        setClientName('');
                                        setIsClientOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700"
                                >
                                    All Clients
                                </button>
                                {clients.map((client) => (
                                    <button
                                        key={client}
                                        onClick={() => {
                                            setClientName(client);
                                            setIsClientOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white truncate"
                                    >
                                        {client}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <button
                        onClick={handleApply}
                        className="flex-1 lg:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                        Apply
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Clear Filters"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
