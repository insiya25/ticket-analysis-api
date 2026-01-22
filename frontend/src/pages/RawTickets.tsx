import { useEffect, useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import type { TicketData } from '../services/api';
import { exportToCSV, exportToExcel } from '../utils/exportData';

const ITEMS_PER_PAGE = 20;

export const RawTickets = () => {
    const [allData, setAllData] = useState<TicketData[]>([]);
    const [filteredData, setFilteredData] = useState<TicketData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all tickets by getting all categories
                const categoryResult = await api.getCategoryAnalysis();
                const allTickets: TicketData[] = [];

                // Fetch tickets for each category
                for (const category of categoryResult.data) {
                    try {
                        const ticketsResult = await api.getTicketsByCategory(category['Issue Category']);
                        allTickets.push(...ticketsResult.data);
                    } catch (error) {
                        console.warn(`Skipping category "${category['Issue Category']}" due to error:`, error);
                        // Continue with other categories
                    }
                }

                setAllData(allTickets);
                setFilteredData(allTickets);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = allData.filter(ticket => {
            const searchLower = searchTerm.toLowerCase();
            return (
                ticket.Client?.toLowerCase().includes(searchLower) ||
                ticket.Subject?.toLowerCase().includes(searchLower) ||
                ticket['Raised By']?.toLowerCase().includes(searchLower) ||
                ticket.Status?.toLowerCase().includes(searchLower) ||
                ticket.Category?.toLowerCase().includes(searchLower)
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, allData]);

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
                    Ticket Registry
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Full registry of all support tickets with derived intelligence
                </p>
            </div>

            {/* Search and Export */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
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
                            {currentData.map((ticket, index) => (
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
                            ))}
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
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
