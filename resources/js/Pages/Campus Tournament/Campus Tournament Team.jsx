import React, { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import MainLayout from "@/Layouts/MainLayout.jsx";

// Temporary: replace with real fetch from backend when available
const generateMockTeamForUser = (user) => {
  const captainId = (user && user.id) ? user.id : 1;
  return {
    id: 101,
    name: 'My Campus Team',
    captainId,
    players: [
      { id: captainId, name: `${(user && user.name) || 'You'} ${((user && user.surname) || '')}`.trim() || 'You', verified: true },
      { id: 2, name: 'Teammate 2', verified: true },
      { id: 3, name: 'Teammate 3', verified: true },
      { id: 4, name: 'Teammate 4', verified: false },
      { id: 5, name: 'Teammate 5', verified: true },
    ],
  };
};

const CampusTournamentTeam = () => {
  const { user, team: teamFromProps, isCaptain: isCaptainFromProps, message } = usePage().props || {};
  
  // If there's a message (error), show it
  if (message) {
    return (
      <MainLayout>
        <div
          className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/Campus Tournament/MainBG.png')" }}
        >
          <div className="w-full min-h-screen bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold mb-4">Campus Tournament</h1>
              <p className="text-lg">{message}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // If no team data, show loading or error
  if (!teamFromProps) {
    return (
      <MainLayout>
        <div
          className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/Campus Tournament/MainBG.png')" }}
        >
          <div className="w-full min-h-screen bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold mb-4">Campus Tournament</h1>
              <p className="text-lg">Loading team data...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const team = teamFromProps;
  const isCaptain = isCaptainFromProps || false;

  const formatPlayer = (player) => {
    if (!player) return 'Player';
    return `${player.name || ''} ${player.surname || ''}`.trim() || player.username || 'Player';
  };

  const PlayerCell = ({ player }) => {
    // Since only verified users can register, all team members will be verified
    return (
      <div className="w-full md:w-auto flex flex-col items-center gap-1 text-white/80 text-xs md:text-sm font-montserrat">
        <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/20 bg-white/10">
          <svg className="absolute inset-0 m-auto w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {player?.avatarUrl && (
            <img src={player.avatarUrl} alt={formatPlayer(player)} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="truncate max-w-[8ch] md:max-w-[12ch]">{formatPlayer(player)}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
      </div>
    );
  };

  // Team is always mocked for now; backend can replace via props later

  return (
    <MainLayout>
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/Campus Tournament/MainBG.png')" }}
      >
        <div className="w-full min-h-screen bg-black/60">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-16">
            <div className="flex flex-col items-center gap-2 md:gap-3">
              <img src="/images/About Page/SL Logo.png" alt="SL Logo" className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain" />
              <div className="text-white text-center font-montserrat font-extrabold text-[32px] md:text-[48px] lg:text-[56px] leading-tight">
                CAMPUS TOURNAMENT
              </div>
            </div>
            <p className="mt-2 text-white/90 font-montserrat text-[12px] sm:text-[14px] md:text-base max-w-3xl text-center mx-auto">
              Your registered team for the ongoing Campus Tournament.
            </p>

            <div className="mt-6 md:mt-10">
              <div className="relative w-full max-w-7xl mx-auto text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50">
                {/* Header */}
                <div className="relative z-10 w-full h-16 md:h-20 flex items-center justify-between bg-neutral-900/70 px-4 md:px-6">
                  <div className="flex-1 text-center">
                    <div className="font-montserrat text-lg md:text-2xl tracking-wide">Team Name</div>
                    <div className="font-montserrat text-xs md:text-sm text-white/70">{team.team_name}</div>
                  </div>
                  <div className="flex items-center gap-2" />
                </div>

                {/* Roster */}
                <div className="px-0 pb-4">
                  {/* Desktop grid */}
                  <div className="hidden md:block mt-0 rounded-b-2xl bg-neutral-800/70 backdrop-blur-sm border-t border-neutral-700/40">
                    <div className="grid [grid-template-columns:repeat(5,minmax(140px,1fr))_minmax(120px,1fr)] gap-3 px-6 md:px-10 py-2 text-white/70 text-xs md:text-sm border-b border-white/10 font-montserrat">
                      <div className="text-center">Player 1</div>
                      <div className="text-center">Player 2</div>
                      <div className="text-center">Player 3</div>
                      <div className="text-center">Player 4</div>
                      <div className="text-center">Player 5</div>
                      <div className="text-center">Action</div>
                    </div>

                    <div className="grid [grid-template-columns:repeat(5,minmax(140px,1fr))_minmax(120px,1fr)] gap-3 items-center px-6 md:px-10 py-3">
                      {team.members && team.members.slice(0, 5).map((member, idx) => (
                        <div className="flex justify-center" key={idx}>
                          <PlayerCell player={member.player} />
                        </div>
                      ))}
                      <div className="flex justify-center">
                        <button
                          type="button"
                          disabled={!isCaptain}
                          className={`bg-[#F2C21A] text-black font-montserrat text-xs md:text-sm font-semibold rounded-lg px-6 md:px-7 py-1.5 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] min-w-[88px] justify-center ${!isCaptain ? 'opacity-60 cursor-not-allowed' : ''}`}
                          onClick={() => { 
                            if (isCaptain) {
                              // Find the captain from team members
                              const captainMember = team.members?.find(member => member.role === 'captain');
                              const captainData = captainMember?.player;
                              
                              // Store team data for editing
                              sessionStorage.setItem('campusTournamentEditTeam', JSON.stringify(team));
                              
                              // Store captain data separately
                              if (captainData) {
                                sessionStorage.setItem('campusTournamentCaptain', JSON.stringify(captainData));
                              }
                              
                              router.visit('/Tournament/CampusTournamentReg');
                            }
                          }}
                          title="Edit team details"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile vertical list */}
                  <div className="md:hidden mt-0 rounded-b-2xl bg-neutral-800/70 backdrop-blur-sm border-t border-neutral-700/40 px-4 py-3">
                    <div className="space-y-3">
                      {team.members && team.members.slice(0,5).map((member, idx) => {
                        return (
                          <div key={idx} className="flex items-center justify-between border border-white/10 rounded-lg px-3 py-2 bg-white/5">
                            <div className="flex items-center gap-3">
                              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-white/10">
                                <svg className="absolute inset-0 m-auto w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
                                  <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                {member.player?.avatarUrl && (
                                  <img src={member.player.avatarUrl} alt={formatPlayer(member.player)} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="font-montserrat text-sm">{formatPlayer(member.player)}</div>
                            </div>
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3">
                      <button
                        type="button"
                        disabled={!isCaptain}
                        className={`w-full bg-[#F2C21A] text-black font-montserrat text-sm font-semibold rounded-lg px-5 py-2 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] ${!isCaptain ? 'opacity-60 cursor-not-allowed' : ''}`}
                        onClick={() => { 
                          if (isCaptain) {
                            // Find the captain from team members
                            const captainMember = team.members?.find(member => member.role === 'captain');
                            const captainData = captainMember?.player;
                            
                            // Store team data for editing
                            sessionStorage.setItem('campusTournamentEditTeam', JSON.stringify(team));
                            
                            // Store captain data separately
                            if (captainData) {
                              sessionStorage.setItem('campusTournamentCaptain', JSON.stringify(captainData));
                            }
                            
                            router.visit('/Tournament/CampusTournamentReg');
                          }
                        }}
                        title="Edit team details"
                      >
                        Edit team
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {!isCaptain && (
                <div className="mt-3 text-xs text-white/60 font-montserrat">
                  You can view your team roster here. Only a Captain can edit details so ask your captain to update details if needed.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CampusTournamentTeam;


