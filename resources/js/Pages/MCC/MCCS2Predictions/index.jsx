import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout.jsx";
import { CheckCircle } from 'lucide-react';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const baseTeams = [
  { image: '/images/MCC/MCCS2Predictions/FINAL 8/LA_UR1.png' },
  { image: '/images/MCC/MCCS2Predictions/FINAL 8/LB_UR2.png' },
  { image: '/images/MCC/MCCS2Predictions/FINAL 8/M_WIL.png' },
  { image: '/images/MCC/MCCS2Predictions/FINAL 8/V_WIL.png' },
  { image: '/images/MCC/MCCS2Predictions/FINAL 8/V_MA.png' },
  { image: '/images/MCC/MCCS2Predictions/FINAL 8/LB_FEB.png' },
  { image: '/images/MCC/MCCS2Predictions/FINAL 8/LA_MA.png' },
  { image: '/images/MCC/MCCS2Predictions/FINAL 8/M_MA.png' },
];


// Player data organized by role
const playersByRole = {
  GOLD: [
    { name: 'SINFUL', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_SINFUL.png' },
    { name: 'VanixLl', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_VanixLl.png' },
    { name: 'SANCHEZ', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_SANCHEZ.png' },
    { name: 'AOG1RI', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_AOG1RI.png' },
    { name: 'KIRR', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_KIRR.png' },
    { name: 'Shaun', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_Shaun.png' },
    { name: 'Reoshi', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_Reoshi.png' },
    { name: 'KlutZ', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_KlutZ.png' },
  ],
  JUNGLER: [
    { name: 'TATING', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_TATING.png' },
    { name: 'Mijizy', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_Mijizy.png' },
    { name: 'ESTACIO', image: '/images/MCC/MCCS2Predictions/Players/Jungler/JG_ESTACIO.png' },
    { name: 'nari', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_nari.png' },
    { name: 'Daledalus', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_Daledalus.png' },
    { name: 'JANCY-BOY', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_JANCY-BOY.png' },
    { name: 'Saikiii', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_Saikiii.png' },
    { name: 'Oying', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_Oying.png' },
  ],
  EXP: [
    { name: 'SEAJEY', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_SEAJEY.png' },
    { name: 'Emjayy', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Emjayy.png' },
    { name: 'Ren', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Ren.png' },
    { name: 'Pann', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Pann.png' },
    { name: 'Jinx', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Jinx.png' },
    { name: 'MIRACLEE', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_MIRACLEE.png' },
    { name: 'Flackkooo', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Flackkooo.png' },
    { name: 'Soren-Khent', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Soren-Khent.png' },
  ],
  MIDDLE: [
    { name: 'lmpostor', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_lmpostor.png' },
    { name: 'Cinderella', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_Cinderella.png' },
    { name: 'LIM', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_LIM.png' },
    { name: 'Qorki-Levels', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_Qorki-Levels.png' },
    { name: 'Xinchi', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_Xinchi.png' },
    { name: 'VICT-JAVELLANA', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_VICT-JAVELLANA.png' },
    { name: 'ZYWIN', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_ZYWIN.png' },
    { name: 'Mirena', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_Mirena.png' },
  ],
  ROAMER: [
    { name: 'laytutu', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_laytutu.png' },
    { name: 'Lawrencio', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Lawrencio.png' },
    { name: 'Alaskador', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Alaskador.png' },
    { name: 'PACULAN', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_PACULAN.png' },
    { name: 'Jamyyyx', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Jamyyyx.png' },
    { name: 'Clarencezzx', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Clarencezzx.png' },
    { name: 'Syong', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Syong.png' },
    { name: 'Ch4kwawa', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Ch4kwawa.png' },
  ],
};

const roles = ['GOLD', 'JUNGLER', 'EXP', 'MIDDLE', 'ROAMER'];

const CARD_WIDTH = typeof window !== 'undefined' && window.innerWidth >= 768 ? 110 : 115;
const CARD_HEIGHT = 290;

function TeamVoting({ selectedTeams, setSelectedTeams }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    setTeams(shuffleArray(baseTeams));
  }, []);

  const toggleSelect = (idx) => {
    if (selectedTeams.includes(idx)) {
      setSelectedTeams(selectedTeams.filter(i => i !== idx));
    } else if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, idx]);
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      <img src="/images/MCC/MCCS2Predictions/SOTS.png" alt="Squad of the Season" className="h-8 sm:h-10 md:h-20 mx-auto mb-0 mt-1 md:mt-8"/>
      <p className="text-base md:text-lg font-semibold text-center text-white -mt-1 mb-2">Choose Up to 2 Teams</p>
      <div className="rounded-2xl p-4 md:p-6 bg-black/40" style={{ maxWidth: '1200px' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {teams.map((team, idx) => {
            const isSelected = selectedTeams.includes(idx);
            const isDimmed = selectedTeams.length === 2 && !isSelected;
            return (
              <div
                key={idx}
                className={`relative bg-black/80 rounded-xl overflow-hidden flex flex-col items-center group cursor-pointer transition-all duration-200 ${isSelected ? 'ring-4 ring-yellow-400' : ''}`}
                onClick={() => toggleSelect(idx)}
                style={{ opacity: isDimmed ? 0.5 : 1 }}
              >
                <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
                  <CheckCircle size={32} className={`transition-opacity duration-300 ${isSelected ? 'opacity-100 text-yellow-400' : 'opacity-0'}`} />
                </div>
                <img src={team.image} alt={`Team ${idx + 1}`} className="w-full h-32 md:h-56 object-cover" />
                {isDimmed && <div className="absolute inset-0 bg-black/60 z-10" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlayerVoting({ selectedPlayers, setSelectedPlayers }) {
  const [shuffledPlayers, setShuffledPlayers] = useState([]);

  useEffect(() => {
    setShuffledPlayers(roles.map(role => shuffleArray(playersByRole[role])));
  }, []);

  const selectPlayer = (roleIdx, playerIdx) => {
    const currentSelections = selectedPlayers[roleIdx] || [];

    if (currentSelections.includes(playerIdx)) {
      const newSelections = currentSelections.filter(idx => idx !== playerIdx);
      setSelectedPlayers({ ...selectedPlayers, [roleIdx]: newSelections.length > 0 ? newSelections : undefined });
    } else if (currentSelections.length < 3) {
      const newSelections = [...currentSelections, playerIdx];
      setSelectedPlayers({ ...selectedPlayers, [roleIdx]: newSelections });
    }
  };

  return (
    <div className="w-full flex flex-col items-center mb-18 mt-10">
      <img src="/images/MCC/MCCS2Predictions/POTS.png" alt="Players of the Season" className="h-8 sm:h-10 md:h-20 mx-auto mb-0 mt-1 md:mt-8"/>
      <p className="text-center text-white text-lg font-semibold mb-6 md:mb-12">Choose Up to 3 Players per Role</p>
      <div className="flex flex-col gap-4 md:gap-12 w-full max-w-[95%] md:max-w-[1400px]">
      {roles.map((role, roleIdx) => (
  <div key={role} className="flex items-start w-full justify-start md:justify-center relative gap-1 md:gap-0 pl-2 md:pl-0">
    <div
      className="flex items-center justify-center bg-stone-900 flex-shrink-0 relative z-10 mr-2 md:mr-3"
      style={{
        width: typeof window !== 'undefined' && window.innerWidth >= 768 ? 56 : 35,
        height: typeof window !== 'undefined' && window.innerWidth >= 768 ? CARD_HEIGHT * 0.9 : CARD_HEIGHT * 0.65,
        borderRadius: '12px',
        marginRight: typeof window !== 'undefined' && window.innerWidth >= 768 ? '0.75rem' : '0.75rem'
      }}
    >
      <span
        className="text-yellow-400 font-bold font-montserrat tracking-widest uppercase"
        style={{
          transform: 'rotate(-90deg)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.15em',
          fontSize: typeof window !== 'undefined' && window.innerWidth >= 768 ? '1.875rem' : '0.875rem'
        }}
      >
        {role}
      </span>
    </div>

    <div className="w-full max-w-[90vw] md:max-w-none overflow-x-auto relative z-0 py-2 custom-scrollbar">
      <div className="flex flex-row gap-2 md:gap-4 md:justify-start pl-1 md:pl-0 md:mx-auto" style={{
        maxWidth: typeof window !== 'undefined' && window.innerWidth >= 768 ? '1200px' : 'none'
      }}>
        {shuffledPlayers[roleIdx] && shuffledPlayers[roleIdx].map((player, playerIdx) => {
          const currentSelections = selectedPlayers[roleIdx] || [];
          const isSelected = currentSelections.includes(playerIdx);
          const isDimmed = currentSelections.length === 3 && !isSelected;
          return (
            <div
              key={playerIdx}
              className={`relative rounded-2xl flex flex-col items-center cursor-pointer transition-all duration-200 ${isSelected ? 'ring-4 ring-yellow-400' : ''}`}
              style={{
                width: typeof window !== 'undefined' && window.innerWidth >= 768 ? CARD_WIDTH : CARD_WIDTH * 0.73,
                height: typeof window !== 'undefined' && window.innerWidth >= 768 ? CARD_HEIGHT * 0.9 : CARD_HEIGHT * 0.65,
                transform: 'scale(1)',
                opacity: isDimmed ? 0.5 : 1,
                flexShrink: 0,
                background: '#18181b',
                padding: '2px',
              }}
              onClick={() => selectPlayer(roleIdx, playerIdx)}
            >
                             <div className="w-full h-full rounded-xl overflow-hidden">
                 <div className="absolute top-2 right-2 z-10">
                   <CheckCircle size={typeof window !== 'undefined' && window.innerWidth >= 768 ? 32 : 20} className={`transition-opacity duration-300 ${isSelected ? 'opacity-100 text-yellow-400' : 'opacity-0'}`} />
                 </div>
                 <img
                   src={player.image}
                   alt={player.name}
                   style={{
                     width: '100%',
                     height: '100%',
                     objectFit: 'cover',
                   }}
                 />
                 {isDimmed && <div className="absolute inset-0 bg-black/60 z-10" />}
               </div>
             </div>
          );
        })}
      </div>
    </div>

      {/* White horizontal line (only in desktop view) */}
      <div className="absolute left-0 right-0 -bottom-4 h-1 bg-white rounded-full w-full hidden md:block" style={{ maxWidth: '90%', margin: '0 auto' }} />
    </div>
  ))}
</div>
</div>
)}

export default function MCCS2PredictionsPage() {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState({});

  const allRolesSelected = roles.every((_, idx) => selectedPlayers[idx] && selectedPlayers[idx].length >= 1);
  const canSubmit = selectedTeams.length >= 1 && selectedTeams.length <= 2 && allRolesSelected;

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
        className="min-h-screen bg-no-repeat bg-cover bg-center bg-fixed w-full pb-32"
        style={{ backgroundImage: "url('/images/MCC/MCCS2Predictions/PredictionsBG.png')" }}
      >
        <div className="flex-1 w-full flex flex-col items-center justify-start pt-0 gap-4">
          <div className="text-center">
            <img src="/images/MCC/MCC_HLOGO.png" alt="Pamantasan Lakas" className="h-70 md:h-50" />
            <h1 className="text-xl md:text-3xl font-bold text-white uppercase tracking-wide">
              Public Choice Awards
            </h1>
          </div>

          <TeamVoting selectedTeams={selectedTeams} setSelectedTeams={setSelectedTeams} />
          <PlayerVoting selectedPlayers={selectedPlayers} setSelectedPlayers={setSelectedPlayers} />

          {canSubmit && (
            <button
              onClick={() => console.log("Submitted selections:", selectedTeams, selectedPlayers)}
              className="mt-10 px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg rounded-full shadow-lg transition-all duration-300"
            >
              Submit Vote
            </button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
