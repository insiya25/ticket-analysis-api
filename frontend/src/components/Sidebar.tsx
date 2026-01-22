import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Users, Database, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Overview' },
        { to: '/category-analysis', icon: PieChart, label: 'Category Analysis' },
        { to: '/client-distribution', icon: Users, label: 'Client Distribution' },
        { to: '/raw-tickets', icon: Database, label: 'Raw Tickets' },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="flex flex-col h-full p-6">
                    {/* Logo */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            EquiTicket
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Ticket Analysis Dashboard
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Theme Toggle */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                        <ThemeToggle />
                    </div>
                </div>
            </aside>
        </>
    );
};
