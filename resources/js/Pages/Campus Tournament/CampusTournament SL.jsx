import React, { useState } from 'react';
import MainLayout from "@/Layouts/MainLayout.jsx";

// Temporary mock data generator until backend is wired
const generateMockTeams = () => [
  {
    id: 1,
    name: 'Team Alpha',
    players: [
      { name: 'Player 1', verified: true },
      { name: 'Player 2', verified: true },
      { name: 'Player 3', verified: true },
      { name: 'Player 4', verified: true },
      { name: 'Player 5', verified: true },
    ],
  },
  {
    id: 2,
    name: 'Team Bravo',
    players: [
      { name: 'Player 1', verified: true },
      { name: 'Player 2', verified: false },
      { name: 'Player 3', verified: true },
      { name: 'Player 4', verified: true },
      { name: 'Player 5', verified: false },
    ],
  },
  {
    id: 3,
    name: 'Team Charlie',
    players: [
      { name: 'Player 1', verified: false },
      { name: 'Player 2', verified: false },
      { name: 'Player 3', verified: true },
      { name: 'Player 4', verified: true },
      { name: 'Player 5', verified: true },
    ],
  },
];

const CampusTournament = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [expanded, setExpanded] = useState({}); // id -> boolean

  const formatDate = (value) => {
    try {
      if (!value) return '';
      const date = new Date(`${value}T00:00:00`);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return value;
    }
  };

  const handleOpen = () => setIsCreateOpen(true);
  const handleClose = () => {
    setIsCreateOpen(false);
    setStartDate('');
    setEndDate('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!startDate || !endDate) return;
    setTournaments((existing) => [
      ...existing,
      {
        id: Date.now(),
        startDate,
        endDate,
        teams: generateMockTeams(), // placeholder teams
      },
    ]);
    handleClose();
  };

  const handleDelete = (id) => {
    setTournaments((existing) => existing.filter((t) => t.id !== id));
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSetResult = (tournamentId, teamId, result) => {
    setTournaments((prev) =>
      prev.map((tournament) => {
        if (tournament.id !== tournamentId) return tournament;
        return {
          ...tournament,
          teams: (tournament.teams || []).map((team) =>
            team.id === teamId ? { ...team, result } : team
          ),
        };
      })
    );
  };

  const PlayerCell = ({ player }) => {
    return (
      <div className="w-full md:w-auto flex flex-col items-center gap-1 text-white/80 text-xs md:text-sm font-montserrat">
        <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/20 bg-white/10">
          <svg
            className="absolute inset-0 m-auto w-5 h-5 text-white/50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {player?.avatarUrl && (
            <img src={player.avatarUrl} alt={player?.name || 'Player'} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="truncate max-w-[8ch] md:max-w-[12ch]">{player?.name || 'Player'}</span>
          <span className={`w-2.5 h-2.5 rounded-full ${player?.verified ? 'bg-green-400' : 'bg-red-500'}`} />
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/Campus Tournament/MainBG.png')" }}
      >
        <div className="w-full min-h-screen bg-black/60">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-16">
            <div className="flex items-center gap-3 md:gap-4">
              <img
                src="/images/About Page/SL Logo.png"
                alt="SL Logo"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain"
              />
              <div className="text-white font-montserrat font-extrabold text-[32px] md:text-[48px] lg:text-[56px] leading-tight">
                CAMPUS TOURNAMENT
              </div>
            </div>
            <p className="mt-2 text-white/90 font-montserrat text-[12px] sm:text-[14px] md:text-base max-w-3xl">
              Campus Tournament is a local campus event where student players compete every two weeks for diamond rewards.
            </p>

            <div className="mt-6 md:mt-10 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleOpen}
                  className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-xl md:rounded-2xl px-6 md:px-8 py-2.5 md:py-3 shadow-[0_0_8px_-3px_rgba(242,194,26,1)]"
                >
                  CREATE +
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {tournaments.map((item) => (
                  <div
                    key={item.id}
                    className="relative w-full max-w-7xl mx-auto text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50"
                  >
                    {/* Header */}
                    <div className="relative z-10 w-full h-16 md:h-20 flex items-center justify-between bg-neutral-900/70 px-4 md:px-6">
                      <div className="flex-1 text-center">
                        <div className="font-montserrat text-lg md:text-2xl tracking-wide">TOURNAMENT</div>
                        <div className="font-montserrat text-xs md:text-sm text-white/70">
                          {formatDate(item.startDate)} - {formatDate(item.endDate)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          aria-label="Toggle teams"
                          className="grid place-items-center w-9 h-9 rounded-lg border border-white/20 hover:bg-white/10 transition"
                        >
                          <svg
                            className={`w-5 h-5 transition-transform duration-300 ${expanded[item.id] ? 'rotate-180' : ''}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="ml-1 bg-[#F2C21A] text-black font-montserrat text-xs md:text-sm font-semibold rounded-lg px-3 py-1.5 shadow-[0_0_8px_-3px_rgba(242,194,26,1)]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Dropdown Content */}
                    <div
                      className={`transition-all duration-500 ease-in-out ${expanded[item.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                    >
                      <div className="px-0 pb-4">
                        <div className="mt-0 rounded-b-2xl bg-neutral-800/70 backdrop-blur-sm border-t border-neutral-700/40">
                          {/* Table Header */}
                          <div className="grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(130px,1fr)_minmax(120px,1fr)] gap-3 px-6 md:px-10 py-2 text-white/70 text-xs md:text-sm border-b border-white/10 font-montserrat">
                            <div className="self-center">Team name</div>
                            <div className="text-center">Player 1</div>
                            <div className="text-center">Player 2</div>
                            <div className="text-center">Player 3</div>
                            <div className="text-center">Player 4</div>
                            <div className="text-center">Player 5</div>
                            <div className="text-center">Verification</div>
                            <div className="text-center">Result</div>
                          </div>

                          {/* Team Rows */}
                          {Array.isArray(item.teams) && item.teams.length > 0 ? (
                            item.teams.map((team) => (
                              <div
                                key={team.id}
                                className="grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(130px,1fr)_minmax(120px,1fr)] gap-3 items-center px-6 md:px-10 py-3 border-t border-white/10 hover:bg-white/5 transition"
                              >
                                <div className="text-white/90 font-montserrat md:truncate">{team.name}</div>
                                {team.players.slice(0, 5).map((player, idx) => (
                                  <div className="flex justify-center" key={idx}>
                                    <PlayerCell player={player} />
                                  </div>
                                ))}
                                {(() => {
                                  const allVerified = team.players.slice(0, 5).every((p) => !!p.verified);
                                  return (
                                    <div className="flex justify-center items-center gap-2">
                                      <span className={`w-2.5 h-2.5 rounded-full ${allVerified ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                      <span className="font-montserrat text-xs md:text-sm text-white/80">{allVerified ? 'Verified' : 'Pending'}</span>
                                    </div>
                                  );
                                })()}
                                <div className="flex justify-center">
                                  <select
                                    value={team.result || ''}
                                    onChange={(e) => handleSetResult(item.id, team.id, e.target.value)}
                                    className="bg-transparent border border-white/40 rounded-md px-2 py-1 text-white focus:text-black text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#F2C21A] min-w-[96px]"
                                  >
                                    <option className="text-black" value="">Select</option>
                                    <option className="text-black" value="win">Win</option>
                                    <option className="text-black" value="lose">Lose</option>
                                  </select>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center text-white/60 font-montserrat">No teams registered yet.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={handleClose} />
            <div className="relative z-20 w-full max-w-3xl bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-10 shadow-2xl">
              <div className="font-montserrat text-2xl md:text-3xl font-semibold mb-6">Create Tournament</div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
                <label className="flex flex-col gap-2">
                  <span className="font-montserrat text-lg md:text-xl">Start date</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onFocus={(e) => { if (e.target.showPicker) { try { e.target.showPicker(); } catch (_) {} } }}
                    className="bg-transparent border border-white/50 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F2C21A]"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-montserrat text-lg md:text-xl">End date</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onFocus={(e) => { if (e.target.showPicker) { try { e.target.showPicker(); } catch (_) {} } }}
                    className="bg-transparent border border-white/50 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F2C21A]"
                  />
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-xl px-8 py-3 shadow-[0_0_8px_-3px_rgba(242,194,26,1)]"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CampusTournament;
