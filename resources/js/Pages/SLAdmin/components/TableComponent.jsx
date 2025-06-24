import React, { useState } from 'react';
import { Facebook } from 'lucide-react';
import avatar from '../assets/42ca9ea53c9f0acd1d273d2864b58719215b59f4.png';

const randomNames = ['Jessie', 'Alex', 'Jamie', 'Taylor', 'Morgan', 'Jordan', 'Casey', 'Reese'];
const randomFullnames = [
    'Kent Jessie Sumagang',
    'Alex Rivera',
    'Jamie Lee Santos',
    'Taylor Cruz',
    'Morgan dela Peña',
    'Jordan Martinez',
    'Casey Navarro',
    'Reese Aquino',
];
const randomSchools = ['Negros College', 'Mindanao State U', 'Central University', 'Northern Tech'];
const yearLevels = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
const statuses = ['New', 'Approved', 'Rejected'];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateMockData = (count = 40) =>
    Array.from({ length: count }, (_, i) => ({
        avatar,
        name: getRandomItem(randomNames),
        fullName: getRandomItem(randomFullnames),
        mslId: `${Math.floor(10000000 + Math.random() * 90000000)} (S4B${i})`,
        school: getRandomItem(randomSchools),
        year: getRandomItem(yearLevels),
        status: getRandomItem(statuses),
    }));

const mockData = generateMockData();

const ITEMS_PER_PAGE = 20;

const TableComponent = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(mockData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = mockData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-[#1a1a1a] text-white shadow custom-scrollbar">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-[#2a2a2a] text-xs uppercase text-gray-400">
                    <tr>
                        <th className="px-4 py-3 text-left">MSL Account</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Fullname</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">School / Institution</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Year Level</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
                        <th className="px-4 py-3 text-left">Details</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                    {currentData.map((item, index) => (
                        <tr key={index} className="hover:bg-[#2f2f2f] transition-colors">
                            <td className="flex items-center gap-3 px-4 py-3">
                                <div className="bg-gradient-to-tr from-[#D4AF37] to-[#FFFACD] p-[2px] rounded-full">
                                    <div className="bg-neutral-900 rounded-full">
                                        <img
                                            src={item.avatar}
                                            alt={item.name}
                                            className="h-[32px] w-[32px] rounded-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="font-medium text-white">{item.name}</div>
                                    <div className="text-xs text-gray-400">{item.mslId}</div>
                                </div>
                                <Facebook className="ml-2 h-4 w-4 text-blue-500 hidden md:table-cell" />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">{item.fullName}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{item.school}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{item.year}</td>
                            <td className="px-4 py-3 hidden md:table-cell">
                  <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                          item.status === 'Approved'
                              ? 'bg-green-600/10 text-green-400'
                              : item.status === 'Rejected'
                                  ? 'bg-red-600/10 text-red-400'
                                  : 'bg-yellow-600/10 text-yellow-400'
                      }`}
                  >
                    {item.status}
                  </span>
                            </td>
                            <td className="px-4 py-3">
                                <button className="rounded bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-200 whitespace-nowrap">
                                    View Profile
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            {mockData.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center mt-4 gap-2 text-sm text-white">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={`px-3 py-1 rounded ${
                                currentPage === i + 1 ? 'bg-white text-black font-bold' : 'bg-neutral-800'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

        </>
    );
};

export default TableComponent;
