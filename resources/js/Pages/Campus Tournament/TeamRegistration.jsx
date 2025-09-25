import React from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";

function InputGroup({ label, placeholder, subtext }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1 font-['Montserrat']">
                    {label}
                </label>
            )}
            <input
                type="text"
                className="w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60 font-['Montserrat']"
                placeholder={placeholder || label}
            />
            {subtext && (
                <p className="text-[10px] text-white/60 mt-1 font-['Montserrat']">{subtext}</p>
            )}
        </div>
    );
}

export default function TeamRegistration() {
    return (
        <MainLayout>
            <Head title="Team Registration" />
            <section
                className="relative min-h-[calc(100vh-160px)] py-8 md:py-12"
                style={{
                    backgroundImage: "url('/images/Campus Tournament/MainBG.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/45" />

                <div className="relative max-w-3xl mx-auto px-4 font-['Montserrat']">
                    <div className="flex flex-col items-center gap-2 md:gap-3 mb-6 md:mb-8">
                        <img
                            src="/images/About Page/SL Logo.png"
                            alt="SL Logo"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain select-none pointer-events-none"
                        />
                        <h1 className="text-white font-bold font-['Montserrat'] tracking-tight text-[24px] md:text-[32px] lg:text-[40px]">
                            CAMPUS TOURNAMENT
                        </h1>
                        <p className="text-white/80 font-['Montserrat'] text-[14px] md:text-[16px] lg:text-[16px] text-center max-w-2xl">
                            Campus Tournament is a local campus event where student players compete every two weeks
                            for diamond rewards.
                        </p>
                    </div>

                    <div className="bg-neutral-900/70 rounded-xl border border-white/10 shadow-xl backdrop-blur p-4 md:p-6">
                        <div className="text-center text-white font-bold font-['Montserrat'] tracking-tight text-[20px] md:text-[24px] lg:text-[30px] uppercase rounded-md py-2 mb-3">
                            School
                        </div>

                        <div className="bg-yellow-400/15 border border-yellow-400/40 rounded-md p-3 md:p-4 mb-4">
                            <p className="text-[12px] md:text-sm font-semibold text-yellow-300 mb-1">Reminder:</p>
                            <ul className="list-disc list-inside text-[11px] md:text-[12px] text-yellow-100/90 space-y-1">
                                <li>Each team may include only one senior high school student in their roster.</li>
                                <li>
                                    To register, make sure that all team members have an MSL Account.
                                </li>
                            </ul>
                        </div>

                        <form className="space-y-4">

                            <InputGroup
                                label="Captain"
                                subtext="* Only the team captain must register their whole team"
                            />

                            <InputGroup
                                label="Discord ID (For Communication)"
                                placeholder="Enter your Discord ID"
                                subtext="Format: username#0000 or User ID"
                            />

                            <InputGroup
                                label="Team Name"
                                subtext="* Maximum of 4 words, must be culturally appropriate"
                            />

                            <div className="pt-2 space-y-3">
                                <div>
                                    <h3 className="text-white/90 font-semibold text-sm mb-1">Player 2</h3>
                                    <InputGroup
                                        placeholder="Search the MSL Username of your teammate"
                                        subtext="* Player must be from your school and have an MSL account"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-white/90 font-semibold text-sm mb-1">Player 3</h3>
                                    <InputGroup
                                        placeholder="Search the MSL Username of your teammate"
                                        subtext="* Player must be from your school and have an MSL account"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-white/90 font-semibold text-sm mb-1">Player 4</h3>
                                    <InputGroup
                                        placeholder="Search the MSL Username of your teammate"
                                        subtext="* Player must be from your school and have an MSL account"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-white/90 font-semibold text-sm mb-1">Player 5</h3>
                                    <InputGroup
                                        placeholder="Search the MSL Username of your teammate"
                                        subtext="* Player must be from your school and have an MSL account"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center pt-2">
                                <button
                                    type="button"
                                    className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm border border-white/30"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-white/70 text-[11px] md:text-xs mt-4 max-w-3xl mx-auto">
                        Make sure that you have read the
                        {' '}
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-yellow-300 underline hover:text-yellow-200">
                            Rulebook
                        </a>
                        {' '}to avoid conflicts. Also, join the{' '}
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-yellow-300 underline hover:text-yellow-200">
                            Discord Server
                        </a>
                        {' '}or our{' '}
                        <a href="https://www.facebook.com/MSLPhilippines" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline hover:text-yellow-200">
                            Facebook Page
                        </a>
                        {' '}for more information and announcements.
                    </p>
                </div>
            </section>
        </MainLayout>
    );
}


