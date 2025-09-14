import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutPrograms.jsx";
import { Eye, Check, XCircle } from "lucide-react";

export default function SLAdminApproval() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Dummy data
        const dummyData = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        request: "Name Correction",
        wrong: `Wrong Name ${i + 1}`,
        correct: `Correct Name ${i + 1}`,
        }));
        setRequests(dummyData);
    }, []);

    return (
        <>
        <Head title="SL Admin Approval" />
        <AuthenticatedLayout>
            {/* Gradient Background */}
            <div className="min-h-screen flex items-center justify-center p-4 font-['Montserrat']">
            <div className="w-full">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                {/* Title */}
                <h1 className="font-bold text-white text-center mb-6 
                    text-[24px] sm:text-[32px] lg:text-[40px]">
                    SL Admin Approval
                </h1>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                    <thead>
                        <tr
                        className="font-bold text-gray-200 
                            text-[20px] sm:text-[24px] lg:text-[30px]"
                        >
                        <th className="px-4 py-3 text-left border-b border-white/20">
                            Username
                        </th>
                        <th className="px-4 py-3 text-left border-b border-white/20">
                            Request
                        </th>
                        <th className="px-4 py-3 text-left border-b border-white/20">
                            Wrong
                        </th>
                        <th className="px-4 py-3 text-left border-b border-white/20">
                            Correct
                        </th>
                        <th className="px-4 py-3 text-center border-b border-white/20">
                            Proof
                        </th>
                        <th className="px-4 py-3 text-center border-b border-white/20">
                            Submit
                        </th>
                        <th className="px-4 py-3 text-center border-b border-white/20">
                            Reject
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req, index) => (
                        <tr
                            key={req.id}
                            className={`font-medium text-gray-200 
                            text-[12px] sm:text-[16px] lg:text-[16px] 
                            ${index % 2 === 0 ? "bg-white/5" : "bg-transparent"} 
                            hover:bg-white/10 transition`}
                        >
                            <td className="px-4 py-3">{req.username}</td>
                            <td className="px-4 py-3">{req.request}</td>
                            <td className="px-4 py-3 text-red-400">{req.wrong}</td>
                            <td className="px-4 py-3 text-green-400">{req.correct}</td>
                            <td className="px-4 py-3 text-center">
                            <button className="flex items-center mx-auto px-3 py-1 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition">
                                <Eye className="w-4 h-4 mr-1" /> View
                            </button>
                            </td>
                            <td className="px-4 py-3 text-center">
                            <button className="flex items-center mx-auto px-3 py-1 bg-green-500/80 text-white rounded-lg hover:bg-green-600 transition">
                                <Check className="w-4 h-4 mr-1" /> Submit
                            </button>
                            </td>
                            <td className="px-4 py-3 text-center">
                            <button className="flex items-center mx-auto px-3 py-1 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition">
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            </div>
        </AuthenticatedLayout>
        </>
    );
    }