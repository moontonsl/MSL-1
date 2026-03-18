import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBTS17.jsx";
import { Lock, Save, Layout, HelpCircle } from "lucide-react";
import BG from "../Assets/Images/BTMPLS17-BG.png";
import Logo from "../Assets/Images/BTLogo.png";

export default function Update({ currentRegion, currentQuestion }) {
    const REGIONS = [
        "ALL REGIONS",
        "National Capital Region",
        "CALABARZON & Bicol Region",
        "Central & North Luzon",
        "Zambales, Tarlac & Nueva Ecija",
        "Bataan, Pampanga & Bulacan"
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
        region: currentRegion || REGIONS[0],
        question: currentQuestion || "Which MPL PH Team has won the most championships?",
    });

    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleAuth = (e) => {
        e.preventDefault();
        if (data.code === "3054") {
            setIsAuthorized(true);
        } else {
            alert("Invalid Access Code");
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("MPLS17Battletrips.store"), {
            onSuccess: () => {
                alert("Settings updated successfully!");
                reset("code");
            },
        });
    };

    return (
        <>
            <Head title="Update Battle Trips Settings" />
            <Helmet>
                <title>Update | MPLS17 Battle Trips</title>
            </Helmet>

            <AuthenticatedLayout>
                <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 font-['Montserrat'] bg-cover bg-top bg-no-repeat" style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}>
                    <img src={Logo} alt="Battle Trips Logo" className="w-48 mb-6" />

                    <div className="w-full max-w-md">
                        {!isAuthorized ? (
                            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#e59639] text-black">
                                <div className="flex items-center justify-center w-16 h-16 bg-[#e59639]/10 rounded-full mx-auto mb-6">
                                    <Lock className="text-[#e59639]" size={32} />
                                </div>
                                <h1 className="text-2xl font-bold text-center mb-2">Restricted Access</h1>
                                <p className="text-gray-500 text-center mb-8 text-sm">Please enter the security code to update event settings.</p>
                                
                                <form onSubmit={handleAuth} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-700">Security Code</label>
                                        <input
                                            type="password"
                                            value={data.code}
                                            onChange={(e) => setData("code", e.target.value)}
                                            placeholder="Enter 4-digit code"
                                            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#e59639] outline-none transition-all text-center text-2xl tracking-[1em] font-mono"
                                            maxLength={4}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-[#e59639] hover:bg-[#d47f20] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#e59639]/20 transition-all active:scale-95"
                                    >
                                        Authorize Access
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#e59639] text-black">
                                <div className="flex items-center justify-between mb-8">
                                    <h1 className="text-2xl font-bold">Update Content</h1>
                                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-tighter">Authorized</div>
                                </div>

                                <form onSubmit={submit} className="space-y-6">
                                    {/* REGION SELECTION */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Layout size={18} className="text-[#e59639]" />
                                            <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Active Region Title</label>
                                        </div>
                                        <select
                                            value={data.region}
                                            onChange={(e) => setData("region", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#e59639] outline-none transition-all appearance-none bg-white cursor-pointer"
                                        >
                                            {REGIONS.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-[10px] text-gray-400 italic">This title appears above the form on the landing page.</p>
                                    </div>

                                    {/* QUESTION EDIT */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <HelpCircle size={18} className="text-[#e59639]" />
                                            <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Mini Game Question</label>
                                        </div>
                                        <textarea
                                            value={data.question}
                                            onChange={(e) => setData("question", e.target.value)}
                                            rows={4}
                                            placeholder="Enter your question here..."
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#e59639] outline-none transition-all resize-none"
                                        />
                                        {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
                                    </div>

                                    <div className="pt-4 space-y-3">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-[#e59639] hover:bg-[#d47f20] disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#e59639]/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Save size={20} />
                                            {processing ? "Saving Changes..." : "Publish Updates"}
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setIsAuthorized(false)}
                                            className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors"
                                        >
                                            Log Out from Editor
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                    
                    <a href="/MPLS17Battletrips" className="mt-8 text-black/60 hover:text-black text-sm font-medium transition-colors border-b border-transparent hover:border-black/30">
                        View Public Page
                    </a>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
