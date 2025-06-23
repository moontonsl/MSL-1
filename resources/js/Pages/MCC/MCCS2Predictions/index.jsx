import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout.jsx";
import { CheckCircle } from 'lucide-react';

// =====================================================================
// Helper Functions & Data
// =====================================================================

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// =====================================================================
// Team Voting Component
// =====================================================================

const baseTeams = [
    { image: '/images/MCC/MCCS2Predictions/Final Teams/M_UR1.png' },
    { image: '/images/MCC/MCCS2Predictions/Final Teams/M_UR2.png' },
    { image: '/images/MCC/MCCS2Predictions/Final Teams/M_WIL.png' },
    { image: '/images/MCC/MCCS2Predictions/Final Teams/V_UR1.png' },
    { image: '/images/MCC/MCCS2Predictions/Final Teams/V_UR2.png' },
    { image: '/images/MCC/MCCS2Predictions/Final Teams/V_WIL.png' },
    { image: '/images/MCC/MCCS2Predictions/Final Teams/V_MA.png' },
    { image: '/images/MCC/MCCS2Predictions/Final Teams/V_FEB.png' },
  ];
  
  function TeamVoting() {
    const [selected, setSelected] = useState([]);
    const [teams, setTeams] = useState([]);
  
    useEffect(() => {
      setTeams(shuffleArray(baseTeams));
    }, []);
  
    const toggleSelect = (idx) => {
      if (selected.includes(idx)) {
        setSelected(selected.filter(i => i !== idx));
      } else if (selected.length < 2) {
        setSelected([...selected, idx]);
      }
    };
  
    return (
      <div className="w-full flex flex-col items-center relative">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-2 mt-8 tracking-widest">SQUAD OF THE SEASON</h2>
        <p className="text-base md:text-lg text-center text-white mb-6">Choose at least 2 Teams</p>
        <div className="border-4 border-white rounded-2xl p-4 md:p-6 bg-black/40" style={{maxWidth:'1200px'}}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {teams.map((team, idx) => {
              const isSelected = selected.includes(idx);
              const isDimmed = selected.length === 2 && !isSelected;
              return (
                <div key={idx} className={`relative bg-black/80 rounded-xl overflow-hidden flex flex-col items-center group cursor-pointer transition-all duration-200 ${isSelected ? 'ring-4 ring-yellow-400' : ''}`} onClick={() => toggleSelect(idx)} style={{ opacity: isDimmed ? 0.5 : 1 }}>
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
                    <CheckCircle size={32} className={`transition-opacity duration-300 ${isSelected ? 'opacity-100 text-yellow-400' : 'opacity-0'}`} />
                  </div>
                  <img src={team.image} alt={`Team ${idx+1}`} className="w-full h-32 md:h-56 object-cover" />
                  {isDimmed && <div className="absolute inset-0 bg-black/60 z-10" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

// =====================================================================
// Player Voting Component
// =====================================================================

const roles = ['GOLD', 'JUNGLER', 'EXP', 'MIDDLE', 'ROAMER'];
const basePlayers = Array(8).fill({
  name: 'DAKI',
  image: '/images/MCC/MCCS2Predictions/Player Card.png',
});

const CARD_HEIGHT = 300;
const CARD_WIDTH = 120;

function PlayerVoting() {
  const [selected, setSelected] = useState({});
  const [shuffledPlayers, setShuffledPlayers] = useState([]);

  useEffect(() => {
    setShuffledPlayers(roles.map(() => shuffleArray(basePlayers)));
  }, []);

  const selectPlayer = (roleIdx, playerIdx) => {
    if (selected[roleIdx] === playerIdx) {
      setSelected({ ...selected, [roleIdx]: undefined });
    } else if (selected[roleIdx] === undefined) {
      setSelected({ ...selected, [roleIdx]: playerIdx });
    }
  };

  return (
    <div className="w-full flex flex-col items-center mb-24">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-2">PLAYERS OF THE SEASON</h2>
      <p className="text-center text-white text-lg mb-6">Choose 1 Player per Role</p>
      <div className="flex flex-col gap-0 md:gap-8 w-full max-w-6xl">
        {roles.map((role, roleIdx) => (
          <div key={role} className="flex items-start -space-x-8 md:-space-x-12 w-full relative justify-start md:justify-center">
            <div
              className="flex items-center justify-center bg-stone-900 scale-[0.6] sm:scale-[0.6] md:scale-90 lg:scale-100 flex-shrink-0 relative z-10"
              style={{ width: 56, height: CARD_HEIGHT, borderRadius: '16px' }}
            >
              <span
                className="text-yellow-400 font-bold font-montserrat text-3xl tracking-widest uppercase"
                style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', letterSpacing: '0.1em' }}
              >
                {role}
              </span>
            </div>
            <div className="flex flex-row -space-x-10 md:gap-11 overflow-x-auto w-full max-w-[85vw] sm:max-w-[90vw] md:max-w-none md:justify-center custom-scrollbar relative z-0 items-start">
              {shuffledPlayers[roleIdx] && shuffledPlayers[roleIdx].map((player, playerIdx) => {
                const isSelected = selected[roleIdx] === playerIdx;
                const isDimmed = selected[roleIdx] !== undefined && !isSelected;
                return (
                  <div
                    key={playerIdx}
                    className={`relative rounded-2xl overflow-hidden flex flex-col items-center group cursor-pointer transition-all duration-200 scale-[0.6] sm:scale-[0.6] md:scale-90 lg:scale-100 flex-shrink-0 ${isSelected ? 'ring-4 ring-yellow-400' : ''}`}
                    style={{ width: CARD_WIDTH, height: CARD_HEIGHT, background: '#18181b', opacity: isDimmed ? 0.5 : 1 }}
                    onClick={() => selectPlayer(roleIdx, playerIdx)}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <CheckCircle size={32} className={`transition-opacity duration-300 ${isSelected ? 'opacity-100 text-yellow-400' : 'opacity-0'}`} />
                    </div>
                    <img
                      src={player.image}
                      alt={player.name}
                      width={CARD_WIDTH}
                      height={CARD_HEIGHT}
                      style={{ width: CARD_WIDTH, height: CARD_HEIGHT, display: 'block' }}
                    />
                    {isDimmed && <div className="absolute inset-0 bg-black/60 z-10" />}
                  </div>
                );
              })}
            </div>
            <div className="absolute left-0 right-0 -bottom-4 h-1 bg-white rounded-full w-full" style={{ maxWidth: '90%', margin: '0 auto' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// Main Page Component
// =====================================================================

export default function MCCS2PredictionsPage() {
  return (
    <MainLayout>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }
      `}</style>
      <div
        className="min-h-screen bg-no-repeat bg-cover bg-center bg-fixed w-full"
        style={{ backgroundImage: "url('/images/MCC/MCCS2Predictions/PredictionsBG.png')" }}
      >
        <div className="flex-1 w-full flex flex-col items-center justify-start pt-12 gap-16">
          <div className="text-center">
            <img src="/images/MCC/Pamantasan.png" alt="Pamantasan Lakas" className="h-20 md:h-24 mx-auto" />
            <h1 className="text-xl md:text-3xl font-bold text-white uppercase tracking-widest mt-4">
              Public Choice Awards
            </h1>
          </div>
          <TeamVoting />
          <PlayerVoting />
        </div>
      </div>
    </MainLayout>
  );
}
