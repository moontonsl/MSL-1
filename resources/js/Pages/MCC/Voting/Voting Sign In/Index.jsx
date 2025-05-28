import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Header, Footer } from "@/Components";

export default function ToVotePage() {
    // Temporary state management until backend is ready
    const [userId, setUserId] = useState("");
    const [serverId, setServerId] = useState("");
    const [userStatus, setUserStatus] = useState(null); // null = not checked, 'eligible' = can vote, 'voted' = already voted
    const [ign, setIgn] = useState("");

    // Temporary function to simulate backend check
    const checkEligibility = () => {
        // This is temporary logic - replace with actual API call when backend is ready
        if (userId && serverId) {
            // Simulate API call delay
            setTimeout(() => {
                // For testing: if userId ends with '1', simulate already voted user
                if (userId.endsWith('1')) {
                    setUserStatus('voted');
                    setIgn('TestUser1');
                } else {
                    setUserStatus('eligible');
                    setIgn('TestUser2');
                }
            }, 500);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative z-10">
                <Header />
            </div>

            <main className="relative z-0">
                <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-10" 
                    style={{ 
                        background: "#000",
                        backgroundImage: "url('/images/MCC/VoteBG.png')", 
                        backgroundSize: "cover", 
                        backgroundPosition: "center",
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}
                >
                    {/* Main Container - Adjust width for mobile */}
                    <div className="w-full max-w-[582px] p-6 md:p-10 bg-neutral-950/30 rounded-2xl outline outline-1 outline-offset-[-0.1px] outline-[#2C2C2C] backdrop-blur-lg flex flex-col items-center mb-6 md:mb-8">
                        {/* MCC Logo */}
                        <img 
                            src="/images/MCC/VoteMCC.png" 
                            alt="MCC Logo" 
                            className="w-20 h-20 mb-4"
                        />
                        
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">MCC S2 AWARDS</h1>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">Login your MLBB Account</h2>
                        
                        {/* Form Container */}
                        <div className="w-full max-w-[320px] space-y-4">
                            {/* User ID */}
                            <div className="w-full">
                                <label className="block text-white text-xl mb-2 text-center">USER ID</label>
                                <input 
                                    type="text" 
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    onBlur={checkEligibility}
                                    placeholder="e.g. 31244913 (****)"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 text-base placeholder-gray-600"
                                />
                            </div>
                            
                            {/* Server ID */}
                            <div className="w-full">
                                <label className="block text-white text-xl mb-2 text-center">SERVER ID</label>
                                <input 
                                    type="text" 
                                    value={serverId}
                                    onChange={(e) => setServerId(e.target.value)}
                                    onBlur={checkEligibility}
                                    placeholder="e.g. ********* (2032)"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 text-base placeholder-gray-600"
                                />
                            </div>
                            
                            {/* Status Message */}
                            {userStatus && (
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    {userStatus === 'eligible' ? (
                                        <>
                                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-white text-base">Account Eligible</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <span className="text-white text-base">Already Voted</span>
                                        </>
                                    )}
                                </div>
                            )}
                            
                            {/* Welcome Text */}
                            {userStatus && (
                                <div className="text-center mt-4 space-y-1">
                                    <p className="text-white text-2xl">
                                        {userStatus === 'eligible' ? 'Welcome ' : 'Hello '}
                                        <span className="text-[#F3C718]">&quot;{ign}&quot;</span>
                                    </p>
                                    <p className="text-white text-2xl">
                                        {userStatus === 'eligible' 
                                            ? <span>Click <span className="text-[#F3C718]">VOTE</span> to participate</span>
                                            : 'You already voted. Thank you for participating!'
                                        }
                                    </p>
                                </div>
                            )}
                            
                            {/* Vote Button */}
                            <div className="flex justify-center mt-6">
                                <Link
                                    href={userStatus === 'eligible' ? '/mcc/voting/vote' : '#'}
                                    disabled={!userStatus || userStatus === 'voted'}
                                    className={`w-40 h-14 flex items-center justify-center ${
                                        userStatus === 'eligible'
                                            ? 'bg-zinc-800 hover:bg-zinc-700 text-white' 
                                            : 'bg-zinc-700 text-gray-400 cursor-not-allowed'
                                    } text-2xl rounded-2xl transition-colors`}
                                >
                                    VOTE
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sponsor Logos */}
                    <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
                        <img src="/images/MCC/Smart.png" alt="Smart Logo" className="h-10 md:h-16" />
                        <img src="/images/MCC/BPI.png" alt="BPI Logo" className="h-10 md:h-16" />
                        <img src="/images/MCC/MoontonLogo.png" alt="Moonton Logo" className="h-10 md:h-16" />
                    </div>
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
