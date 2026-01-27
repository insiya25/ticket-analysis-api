import { useEffect, useState } from 'react';
import { Download, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';
import { api } from '../services/api';
import type { TicketData, FilterParams } from '../services/api';
import { exportToCSV, exportToExcel } from '../utils/exportData';
import { FilterBar } from '../components/FilterBar';

const ITEMS_PER_PAGE = 20;

export const RawTickets = () => {
    const [allData, setAllData] = useState<TicketData[]>([]);
    const [filteredData, setFilteredData] = useState<TicketData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<FilterParams>({});

    const fetchData = async (currentFilters: FilterParams = {}) => {
        setLoading(true);
        try {
            // Fetch all tickets by getting available categories based on filters
            // This is a 2-step process: 
            // 1. Get categories that have tickets matching the filters
            // 2. Get tickets for those categories (also applying the filters)
            const categoryResult = await api.getCategoryAnalysis(currentFilters);
            const allTickets: TicketData[] = [];

            // Fetch tickets for each category
            // We use Promise.all to fetch them in parallel for better performance
            const ticketPromises = categoryResult.data.map(category =>
                api.getTicketsByCategory(category['Issue Category'], currentFilters)
                    .then(res => res.data)
                    .catch(err => {
                        console.warn(`Skipping category "${category['Issue Category']}" due to error:`, err);
                        return [];
                    })
            );

            const results = await Promise.all(ticketPromises);
            results.forEach(tickets => allTickets.push(...tickets));

            // Sort by ticket number or date if needed, for now just keeping order
            setAllData(allTickets);

            // Apply text search immediately
            applySearch(allTickets, searchTerm);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const applySearch = (data: TicketData[], term: string) => {
        if (!term.trim()) {
            setFilteredData(data);
            return;
        }

        const searchLower = term.toLowerCase();
        const filtered = data.filter(ticket =>
            ticket.Client?.toLowerCase().includes(searchLower) ||
            ticket.Subject?.toLowerCase().includes(searchLower) ||
            ticket['Raised By']?.toLowerCase().includes(searchLower) ||
            ticket.Status?.toLowerCase().includes(searchLower) ||
            ticket.Category?.toLowerCase().includes(searchLower)
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        fetchData(filters);
    }, [filters]);

    useEffect(() => {
        applySearch(allData, searchTerm);
        setCurrentPage(1);
    }, [searchTerm, allData]);

    const handleFilterChange = (newFilters: any) => {
        const { search, ...apiFilters } = newFilters;
        setSearchTerm(search || '');
        setFilters(apiFilters);
    };

    const handleExportCSV = () => {
        exportToCSV(filteredData, 'raw-tickets');
    };

    const handleExportExcel = () => {
        exportToExcel(filteredData, 'raw-tickets');
    };

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = filteredData.slice(startIndex, endIndex);

    if (loading && allData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Ticket Registry
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Full registry of all support tickets with derived intelligence
                </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-4">
                <FilterBar onFilterChange={handleFilterChange} showSearch={true} initialFilters={{ search: searchTerm }} />

                {/* Export Buttons - Positioned below filters on mobile, or alongside if space permits */}
                <div className="flex justify-end gap-2">
                    {loading && (
                        <div className="flex items-center gap-2 text-blue-500 mr-auto">
                            <RefreshCcw className="w-5 h-5 animate-spin" />
                            <span className="text-sm font-medium">Updating...</span>
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

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">No</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Client</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Subject</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Raised By</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Raised Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Days</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {currentData.length > 0 ? (
                                currentData.map((ticket, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                            {ticket.No}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                            {ticket.Client}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-md">
                                            {ticket.Subject}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                                                {ticket.Category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                            {ticket['Raised By']}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                            {ticket['Raised Date']}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                            {ticket.Status || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                            {ticket.Days}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                                        No tickets found matching the criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} tickets
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {Math.max(1, totalPages)}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
