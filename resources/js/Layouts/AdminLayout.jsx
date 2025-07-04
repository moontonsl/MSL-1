import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaNewspaper, FaCalendar, FaUsers, FaTachometerAlt, FaSignOutAlt, FaBed, FaBook, FaConciergeBell, FaCog, FaTh, FaEllipsisH } from 'react-icons/fa';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), routeName: 'admin.dashboard', icon: FaTh },
        { name: 'Account Management', href: route('admin.users.pending'), routeName: 'admin.users.pending', icon: FaUsers },
        { name: 'News Management', href: route('admin.news'), routeName: 'admin.news', icon: FaNewspaper },
        { name: 'Event Calendar', href: route('admin.events'), routeName: 'admin.events', icon: FaCalendar },
        { name: 'Settings', href: route('admin.settings'), routeName: 'admin.settings', icon: FaCog },
    ];

    const activeNav = navigation.find(item => route().current(item.routeName));

    return (
        <div className="min-h-screen flex bg-[var(--background-color)] relative">
            {/* Background noise effect */}
            <div 
                className="fixed inset-0 opacity-5 pointer-events-none z-0"
                style={{
                    background: 'url(/noise.svg) lightgray 0% 0% / 100px 100px repeat',
                    mixBlendMode: 'overlay'
                }}
            />

            {/* Sidebar */}
            <div className="w-100 h-screen bg-[#212121] text-white flex flex-col shadow-lg rounded-br-3xl rounded-tr-3xl z-10 overflow-hidden">
                <div className="p-6 flex items-center justify-start border-b border-[#4A4A60]">
                    <img src="/msl-logo.png" alt="MSL Logo" className="w-100 h-100" />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                                route().current(item.routeName)
                                    ? 'bg-[#f0f0f0] text-[#2C2C3E] border-2 border-gray-200 shadow font-bold'
                                    : 'text-gray-300 hover:bg-[#4A4A60] hover:text-white'
                            }`}
                        >
                            <item.icon
                                className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                                    route().current(item.routeName)
                                        ? 'text-[#2C2C3E]'
                                        : 'text-gray-300 group-hover:text-white'
                                }`}
                            />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4">
                    <Link
                        href={route('admin.logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-start py-3 px-4 rounded-lg bg-[#f0f0f0] text-[#212121] font-medium hover:bg-[#4A4A60] hover:text-white transition-colors duration-200"
                    >
                        <FaSignOutAlt className="w-5 h-5 mr-2" />
                        Logout
                    </Link>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col ml-0">
                {/* Top Navigation */}
                <nav className="relative z-10 bg-white border-b border-gray-200 shadow-sm p-4" style={{marginLeft: -20,zIndex: 1}}>
                    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center">
                                <span className="text-gray-800 font-semibold text-xl">{activeNav ? activeNav.name : ''}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                
                                <div className="flex items-center space-x-3 font-medium bg-[#212121] rounded-lg px-4 py-2">
                                    <span className="text-white font-medium">{auth.user.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main content */}
                <div className="flex-1 min-h-screen bg-[var(--background-color)] p-8">
                    <main className="bg-[var(--card-background)] rounded-tl-3xl p-8 shadow-md min-h-[calc(100vh-64px-4rem)]">{children}</main>
                </div>
            </div>

            <style jsx>{`
                :root {
                    --background-color: #f0f2f5;
                    --card-background: #ffffff;
                    --text-primary: #333333;
                    --text-secondary: #666666;
                    --text-on-accent: #ffffff;

                    --soft-red-100: #ffe0e0;
                    --soft-red-400: #ff6b6b;
                    --soft-red-500: #e65c5c;
                    --soft-red-600: #cc4d4d;

                    --soft-yellow-100: #fffacd;
                    --soft-yellow-400: #ffd700;
                    --soft-yellow-500: #e6c200;
                    --soft-yellow-600: #ccad00;

                    --soft-green-100: #e0ffe0;
                    --soft-green-400: #6bff6b;
                    --soft-green-500: #5ce65c;
                    --soft-green-600: #4dcc4d;


                }
            `}</style>
        </div>
    );
}