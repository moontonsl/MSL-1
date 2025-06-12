import React, { useState, useEffect } from "react";
import { Header, Footer } from "@/Components";
import { CheckCircle } from "lucide-react";

// Team data structure for different brackets
const BRACKET_TEAMS = {
    "MINDANAO BRACKET": [
        { id: 1, name: "UR Team 1", image: "/images/MCC/MINDANAO/M_UR1.png" },
        { id: 2, name: "MA Team", image: "/images/MCC/MINDANAO/M_MA.png" },
        { id: 3, name: "WIL Team", image: "/images/MCC/MINDANAO/M_WIL.png" },
        { id: 4, name: "UR Team 2", image: "/images/MCC/MINDANAO/M_UR2.png" },
        { id: 5, name: "FEB Team", image: "/images/MCC/MINDANAO/M_FEB.png" },
    ],
    "VISAYAS BRACKET": [
        { id: 1, name: "UR Team 1", image: "/images/MCC/VISAYAS/V_UR1.png" },
        { id: 2, name: "MA Team", image: "/images/MCC/VISAYAS/V_MA.png" },
        { id: 3, name: "WIL Team", image: "/images/MCC/VISAYAS/V_WIL.png" },
        { id: 4, name: "UR Team 2", image: "/images/MCC/VISAYAS/V_UR2.png" },
        { id: 5, name: "FEB Team", image: "/images/MCC/VISAYAS/V_FEB.png" },
    ],
    "LUZON A BRACKET": [
        { id: 1, name: "UR Team 1", image: "/images/MCC/LUZON A/LA_UR1.png" },
        { id: 2, name: "MA Team", image: "/images/MCC/LUZON A/LA_MA.png" },
        { id: 3, name: "WIL Team", image: "/images/MCC/LUZON A/LA_WIL.png" },
        { id: 4, name: "UR Team 2", image: "/images/MCC/LUZON A/LA_UR2.png" },
        { id: 5, name: "FEB Team", image: "/images/MCC/LUZON A/LA_FEB.png" },
    ],
    "LUZON B BRACKET": [
        { id: 1, name: "MA Team", image: "/images/MCC/LUZON B/LB_MA.png" },
        { id: 2, name: "WIL Team", image: "/images/MCC/LUZON B/LB_WIL.png" },
        { id: 3, name: "UR Team 1", image: "/images/MCC/LUZON B/LB_UR1.png" },
        { id: 4, name: "UR Team 2", image: "/images/MCC/LUZON B/LB_UR2.png" },
        { id: 5, name: "FEB Team", image: "/images/MCC/LUZON B/LB_FEB.png" },
    ]
};

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const BracketSection = ({ title, status = 'open' }) => {
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [shuffledTeams, setShuffledTeams] = useState([]);

    // Shuffle teams on component mount and when status changes
    useEffect(() => {
        setShuffledTeams(shuffleArray(BRACKET_TEAMS[title] || []));
    }, [status, title]);

    const handleTeamSelect = (teamId) => {
        if (status !== 'open') return;
        
        if (selectedTeams.includes(teamId)) {
            setSelectedTeams(selectedTeams.filter(id => id !== teamId));
        } else if (selectedTeams.length < 2) {
            setSelectedTeams([...selectedTeams, teamId]);
        }
    };

    const handleSubmit = () => {
        if (selectedTeams.length === 0) return;
        // TODO: Implement the submission logic here
        console.log(`Submitting votes for ${title}:`, {
            bracket: title,
            selectedTeams: selectedTeams.map(teamId => 
                BRACKET_TEAMS[title].find(team => team.id === teamId)
            )
        });
        // Reset selection after submission
        setSelectedTeams([]);
    };

    const isTeamSelectable = (teamId) => {
        if (status !== 'open') return false;
        return selectedTeams.includes(teamId) || selectedTeams.length < 2;
    };

    const getCoverMessage = () => {
        switch (status) {
            case 'closed':
                return 'VOTING CLOSED';
            case 'upcoming':
                return 'OPENS ON JUNE 18';
            default:
                return '';
        }
    };

    const getOverlayStyle = () => {
        switch (status) {
            case 'closed':
                return 'bg-black/80';
            case 'upcoming':
                return 'bg-[#F3C718]/50';
            default:
                return '';
        }
    };

    return (
        <div className="w-full max-w-[1640px] relative mb-24 px-4 md:px-8">
            {/* Section Title */}
            <div className="text-center mb-4">
                <h2 className="text-4xl md:text-6xl font-bold font-space leading-tight">
                    {title}
                </h2>
            </div>

            {/* Subtitle */}
            <div className="flex justify-center items-center mb-6">
                <p className="text-base font-medium font-poppins leading-snug">
                    Choose at least 2 Teams
                </p>
            </div>

            {/* Teams Container */}
            <div className="relative">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center gap-2 md:gap-4 p-4 md:p-8 outline outline-[3px] outline-white">
                        {/* Cover Overlay */}
                        {status !== 'open' && (
                            <div className={`absolute inset-0 z-20 flex items-center justify-center ${getOverlayStyle()}`}>
                                <h3 className="text-4xl md:text-6xl font-bold font-space text-white text-center">
                                    {getCoverMessage()}
                                </h3>
                            </div>
                        )}
                        
                        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between w-full gap-4">
                            {shuffledTeams.map((team) => {
                                const isSelected = selectedTeams.includes(team.id);
                                const isDisabled = !isTeamSelectable(team.id);

                                return (
                                    <div
                                        key={team.id}
                                        className={`w-[45%] md:w-[19%] cursor-pointer transition-all duration-300 ${
                                            isDisabled && !isSelected ? 'opacity-50' : 'opacity-100'
                                        }`}
                                        onClick={() => !isDisabled && handleTeamSelect(team.id)}
                                    >
                                        {/* Team Card */}
                                        <div 
                                            className={`relative rounded-[20px] overflow-hidden ${
                                                isSelected 
                                                    ? 'outline outline-[3px] outline-yellow-400' 
                                                    : ''
                                            }`}
                                        >
                                            {/* Checkmark */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <CheckCircle 
                                                    size={32} 
                                                    className={`transition-opacity duration-300 ${
                                                        isSelected 
                                                            ? 'opacity-100 text-yellow-400' 
                                                            : 'opacity-0'
                                                    }`}
                                                />
                                            </div>

                                            {/* Team Image */}
                                            <div className="aspect-[620/570] relative">
                                                <img 
                                                    src={team.image}
                                                    alt={team.name}
                                                    className="w-full h-full object-contain"
                                                />
                                                {/* Overlay for unselected and disabled state */}
                                                <div 
                                                    className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                                                        isDisabled && !isSelected ? 'opacity-50' : 'opacity-0'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    {status === 'open' && selectedTeams.length > 0 && (
                        <div className="flex justify-center">
                            <button
                                onClick={handleSubmit}
                                className="bg-[#F3C718] text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#F3C718]/90 transition-all duration-300 transform hover:scale-105"
                            >
                                Submit Vote
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function PredictionsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative z-10">
                <Header />
            </div>

            <main 
                className="relative z-0 min-h-screen py-8 md:py-16"
                style={{
                    backgroundImage: "url('/images/MCC/VoteBG.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed"
                }}
            >
                <div className="Main flex flex-col justify-center items-center overflow-hidden">
                    {/* Header Section - Adjusted spacing */}
                    <div className="MccHeaderLogo w-full px-4 md:px-20 lg:px-80 py-2 md:py-2.5 flex flex-col justify-center items-center overflow-hidden">
                        <img 
                            className="MccHlogo1 h-20 md:h-28 object-contain" 
                            src="/images/MCC/Pamantasan.png" 
                            alt="MCC Logo"
                        />
                        <div className="text-center mt-0.8 md:mt-3">
                            <h1 className="text-[1.75rem] md:text-[3.25rem] lg:text-[3.25rem] font-bold font-space leading-tight">
                                GROUP STAGE PREDICTION
                            </h1>
                        </div>
                        <div className="mt-0 md:mt-0 text-center flex flex-col gap-0">
                            <p className="text-lg md:text-xl font-poppins font-medium leading-none">
                                Predict who will make it to the Finals?
                            </p>
                            <p className="text-lg md:text-xl font-poppins font-bold leading-none">
                                Choose at least 2 Teams!
                            </p>
                        </div>
                    </div>

                    {/* Body Section with Brackets */}
                    <div className="Body w-full flex flex-col items-center gap-4 md:gap-8 mt-8 md:mt-16">
                        <BracketSection title="MINDANAO BRACKET" status="closed" />
                        <BracketSection title="VISAYAS BRACKET" status="upcoming" />
                        <BracketSection title="LUZON A BRACKET" />
                        <BracketSection title="LUZON B BRACKET" />
                    </div>
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
