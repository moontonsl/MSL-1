import React, { useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import MainLayout from "@/Layouts/MainLayout.jsx";

// Temporary mock requests until backend is wired
const generateMockRequests = () => ([
  { id: 1, schoolName: 'West Visayas State University - Main', startDate: '2025-09-18', endDate: '2025-09-25', slName: 'Dave Lima' },
  { id: 2, schoolName: 'City College of San Jose del Monte', startDate: '2025-10-02', endDate: '2025-10-09', slName: 'Zheena Duero' },
  { id: 3, schoolName: 'Iloilo Science and Technology University', startDate: '2025-10-16', endDate: '2025-10-23', slName: 'Caezar Flores' },
]);

// Temporary mock tournaments (read-only view)
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

const generateMockTournaments = () => ([
  {
    id: 101,
    startDate: '2025-09-01',
    endDate: '2025-09-07',
    teams: generateMockTeams().map((team, index) => ({
      ...team,
      result: index === 0 ? 'win' : index === 1 ? 'invalid' : 'participant',
    })),
  },
  {
    id: 102,
    startDate: '2025-09-15',
    endDate: '2025-09-22',
    teams: generateMockTeams().map((team, index) => ({
      ...team,
      result: index === 0 ? 'participant' : index === 1 ? 'win' : 'participant',
    })),
  },
]);

const RegionalAdmin = () => {
  const { tournaments, approvedTournaments, user } = usePage().props;
  const [localTournaments, setLocalTournaments] = useState(tournaments || []);
  const [decisionById, setDecisionById] = useState({}); // { [id]: 'approved' | 'rejected' }
  const [viewing, setViewing] = useState(null); // request being viewed in modal
  const [expanded, setExpanded] = useState({}); // id -> boolean
  const [mobileViewTeam, setMobileViewTeam] = useState(null); // mobile-only player popup
  const [isProcessing, setIsProcessing] = useState({}); // Track which requests are being processed
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Show confirmation modal
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Show success modal
  const [pendingAction, setPendingAction] = useState(null); // Store pending action data
  
  // Use real approved tournaments data instead of mock data
  const [staticTournaments] = useState(approvedTournaments || []);

  // Transform real tournament data to match the expected format
  const transformedTournaments = useMemo(() => {
    if (!staticTournaments || staticTournaments.length === 0) return [];
    
    return staticTournaments.map(tournament => ({
      id: tournament.id,
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      teams: tournament.teams ? tournament.teams.map(team => ({
        id: team.id,
        name: team.team_name,
        players: team.members ? team.members.map(member => ({
          id: member.player_id,
          name: member.player ? `${member.player.name} ${member.player.surname}`.trim() : 'Unknown Player',
          verified: true, // Assuming all registered players are verified
          role: member.role
        })) : []
      })) : []
    }));
  }, [staticTournaments]);

  const hasPending = useMemo(() => localTournaments.some(r => r.status === 'pending'), [localTournaments]);

  const handleConfirmAction = (action, tournament) => {
    setPendingAction({ action, tournament });
    setShowConfirmModal(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  const formatDate = (value) => {
    try {
      if (!value) return '';
      
      // Handle different date formats
      let date;
      if (typeof value === 'string') {
        // If it's already a valid date string, use it directly
        if (value.includes('T') || value.includes(' ')) {
          date = new Date(value);
        } else {
          // If it's just a date (YYYY-MM-DD), add time
          date = new Date(`${value}T00:00:00`);
        }
      } else {
        date = new Date(value);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', value);
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      console.error('Date formatting error:', e, 'Value:', value);
      return 'Invalid Date';
    }
  };

  const handleApprove = (id) => {
    const tournament = localTournaments.find(t => t.id === id);
    handleConfirmAction('approve', tournament);
  };

  const executeApprove = async (id) => {
    setIsProcessing(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await fetch(`/campus-tournaments/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state to remove the approved tournament
        setLocalTournaments(prev => prev.filter(t => t.id !== id));
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        alert('Error approving tournament: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error approving tournament:', error);
      alert('Error approving tournament. Please try again.');
    } finally {
      setIsProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setIsProcessing(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await fetch(`/campus-tournaments/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          rejection_reason: reason,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state to remove the rejected tournament
        setLocalTournaments(prev => prev.filter(t => t.id !== id));
      } else {
        alert('Error rejecting tournament: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error rejecting tournament:', error);
      alert('Error rejecting tournament. Please try again.');
    } finally {
      setIsProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusClasses = (value) => {
    const v = value || 'participant';
    if (v === 'win') return 'bg-yellow-400/60 border border-yellow-300/80 text-white';
    if (v === 'invalid') return 'bg-red-700/40 border border-red-600/70 text-white';
    return 'bg-green-500/30 border border-green-400/70 text-white';
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
            {/* Title + Logo (same as /Tournament/SL) */}
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
            <div className="mt-1 md:mt-2 text-white font-montserrat font-extrabold text-[22px] md:text-[28px] leading-tight">
              Tournament Requests
            </div>

            {/* Requests Table */}
            <div className="mt-2 md:mt-4">
              <div className="relative w-full max-w-7xl mx-auto text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50">
                {/* Header Row (hidden on mobile) */}
                <div className="hidden md:grid [grid-template-columns:minmax(220px,2.2fr)_repeat(3,minmax(140px,1fr))_minmax(200px,1.3fr)] items-center gap-3 px-5 md:px-8 py-3 bg-neutral-900/70 text-white/80 text-xs md:text-sm font-montserrat">
                  <div className="font-semibold">School name</div>
                  <div className="text-center font-semibold">Start date</div>
                  <div className="text-center font-semibold">End date</div>
                  <div className="text-center font-semibold">SL name</div>
                  <div className="text-right font-semibold">Action</div>
                </div>

                {/* Body */}
                <div className="divide-y divide-white/10">
                  {localTournaments.length === 0 && (
                    <div className="px-6 py-8 text-center text-white/60 font-montserrat">No requests.</div>
                  )}

                  {localTournaments.map((req) => {
                    const isProcessingThis = isProcessing[req.id];
                    return (
                      <div key={req.id}>
                        {/* Desktop row */}
                        <div className="hidden md:grid [grid-template-columns:minmax(220px,2.2fr)_repeat(3,minmax(140px,1fr))_minmax(200px,1.3fr)] items-center gap-3 px-5 md:px-8 py-3 hover:bg-white/5 transition-colors">
                          <div className="font-montserrat text-white/90 md:truncate">{req.school_name}</div>
                          <div className="text-center font-montserrat text-white/80">{formatDate(req.start_date)}</div>
                          <div className="text-center font-montserrat text-white/80">{formatDate(req.end_date)}</div>
                          <div className="text-center font-montserrat text-white/80">{req.sl_name}</div>
                          <div className="flex justify-end items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(req.id)}
                              disabled={isProcessingThis}
                              className={`bg-[#F2C21A] text-black font-montserrat text-[11px] md:text-xs font-semibold rounded-lg px-3 py-1.5 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {isProcessingThis ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(req.id)}
                              disabled={isProcessingThis}
                              className={`bg-red-500 hover:bg-red-600 text-white font-montserrat text-[11px] md:text-xs font-semibold rounded-lg px-3 py-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {isProcessingThis ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        </div>

                        {/* Mobile row: show School, Action buttons, and View */}
                        <div className="md:hidden grid [grid-template-columns:minmax(180px,1fr)_minmax(140px,auto)_auto] items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                          <div className="font-montserrat text-white/90">{req.school_name}</div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(req.id)}
                              disabled={isProcessingThis}
                              className={`bg-[#F2C21A] text-black font-montserrat text-[11px] font-semibold rounded-lg px-3 py-1.5 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {isProcessingThis ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(req.id)}
                              disabled={isProcessingThis}
                              className={`bg-red-500 hover:bg-red-600 text-white font-montserrat text-[11px] font-semibold rounded-lg px-3 py-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {isProcessingThis ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setViewing(req)}
                              className="bg-white/10 hover:bg-white/20 text-white font-montserrat text-[11px] font-semibold rounded-lg px-3 py-1.5"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Helper note */}
              <div className="mt-3 text-xs text-white/60 font-montserrat">
                Approve or reject each request. Approved tournaments will appear on the Campus Tournament page.
              </div>
            </div>

            {/* View Modal */}
            {viewing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60" onClick={() => setViewing(null)} />
                <div className="relative z-10 w-[92%] max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 p-5 text-white shadow-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-montserrat font-semibold text-lg">Request details</div>
                      <div className="mt-0.5 text-white/70 font-montserrat text-sm">{viewing.schoolName}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewing(null)}
                      className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-md px-2 py-1 font-montserrat text-sm"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4 space-y-2 font-montserrat text-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-white/70">SL name</div>
                      <div className="text-white/90">{viewing.slName}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-white/70">Start date</div>
                      <div className="text-white/90">{formatDate(viewing.startDate)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-white/70">End date</div>
                      <div className="text-white/90">{formatDate(viewing.endDate)}</div>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setViewing(null)}
                      className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-4 py-2 shadow-[0_0_8px_-3px_rgba(242,194,26,1)]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Ongoing Tournaments (read-only) */}
            <div className="mt-10">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-white font-montserrat font-extrabold text-[22px] md:text-[28px] leading-tight">
                  Ongoing Tournaments
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                {transformedTournaments.map((item) => (
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
                      </div>
                    </div>

                    {/* Dropdown Content */}
                    <div
                      className={`transition-all duration-500 ease-in-out ${expanded[item.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                    >
                      <div className="px-0 pb-0">
                        <div className="mt-0 rounded-b-2xl bg-neutral-800/70 backdrop-blur-sm border-t border-neutral-700/40">
                          {/* Table Header - Desktop */}
                          <div className="hidden md:grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(120px,1fr)] gap-3 px-6 md:px-10 py-2 text-white/70 text-xs md:text-sm border-b border-white/10 font-montserrat">
                            <div className="self-center">Team name</div>
                            <div className="text-center">Player 1</div>
                            <div className="text-center">Player 2</div>
                            <div className="text-center">Player 3</div>
                            <div className="text-center">Player 4</div>
                            <div className="text-center">Player 5</div>
                            <div className="grid place-items-center">Status</div>
                          </div>
                          {/* Table Header - Mobile (Team + Status) */}
                          <div className="md:hidden grid [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-5 px-4 py-2 text-white/70 text-xs border-b border-white/10 font-montserrat">
                            <div className="self-center">Team name</div>
                            <div className="justify-self-start text-left">Status</div>
                            <div className="text-right"></div>
                          </div>

                          {/* Team Rows */}
                          {Array.isArray(item.teams) && item.teams.length > 0 ? (
                            item.teams.map((team) => (
                              <>
                                {/* Desktop Row */}
                                <div
                                  key={`d-${team.id}`}
                                  className="hidden md:grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(120px,1fr)] gap-3 items-center px-6 md:px-10 py-3 border-t border-white/10 hover:bg-white/5 transition"
                                >
                                  <div className="text-white/90 font-montserrat md:truncate">{team.name}</div>
                                  {team.players.slice(0, 5).map((player, idx) => (
                                    <div className="flex justify-center" key={idx}>
                                      <PlayerCell player={player} />
                                    </div>
                                  ))}
                                  <div className="flex justify-center">
                                    <span className={`rounded-md px-2 py-1 text-xs md:text-sm min-w-[128px] text-center ${getStatusClasses(team.result || 'participant')}`}>
                                      {(team.result || 'participant').charAt(0).toUpperCase() + (team.result || 'participant').slice(1)}
                                    </span>
                                  </div>
                                </div>
                                {/* Mobile Row */}
                                <div
                                  key={`m-${team.id}`}
                                  className="grid md:hidden [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-2 items-center px-4 py-3 border-t border-white/10 hover:bg-white/5 transition"
                                >
                                  <div className="text-white/90 font-montserrat truncate">{team.name}</div>
                                  <div className="flex justify-start">
                                    <span className={`rounded-md px-2 py-1 text-xs min-w-[112px] text-center ${getStatusClasses(team.result || 'participant')}`}>
                                      {(team.result || 'participant').charAt(0).toUpperCase() + (team.result || 'participant').slice(1)}
                                    </span>
                                  </div>
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => setMobileViewTeam(team)}
                                      className="px-3 py-1 rounded-md border border-white/30 text-white/90 text-xs bg-white/10 hover:bg-white/20"
                                    >
                                      View
                                    </button>
                                  </div>
                                </div>
                              </>
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

            {/* Mobile Players Modal */}
            {mobileViewTeam && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={() => setMobileViewTeam(null)} />
                <div className="relative z-20 w-[92%] md:max-w-lg bg-neutral-900/90 text-white border border-white/20 rounded-2xl p-4 md:p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-montserrat text-base md:text-lg font-semibold">{mobileViewTeam.name}</div>
                    <button
                      type="button"
                      onClick={() => setMobileViewTeam(null)}
                      className="w-8 h-8 grid place-items-center rounded-md border border-white/20 hover:bg-white/10"
                      aria-label="Close"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mobileViewTeam.players.slice(0,5).map((player, idx) => (
                      <div key={idx} className="flex items-center justify-between border border-white/10 rounded-lg px-3 py-2 bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-white/10">
                            <svg className="absolute inset-0 m-auto w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div className="font-montserrat text-sm">{player.name}</div>
                        </div>
                        <span className={`w-2.5 h-2.5 rounded-full ${player.verified ? 'bg-green-400' : 'bg-red-500'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Empty/pending indicator */}
            {!hasPending && (
              <div className="mt-6 text-sm text-white/70 font-montserrat">No pending requests.</div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={handleConfirmClose} />
          <div className="relative z-20 w-full max-w-md bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              {/* Confirmation Message */}
              <h3 className="font-montserrat text-xl md:text-2xl font-semibold mb-3 text-yellow-400">
                Confirm Action
              </h3>
              
              <p className="font-montserrat text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                Are you sure you want to <strong>{pendingAction.action}</strong> the tournament request from <strong>{pendingAction.tournament?.school_name}</strong>?
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-montserrat text-sm font-semibold rounded-lg px-6 py-3 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeApprove(pendingAction.tournament.id)}
                  disabled={isProcessing[pendingAction.tournament.id]}
                  className="flex-1 bg-[#F2C21A] text-black font-montserrat text-sm font-semibold rounded-lg px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing[pendingAction.tournament.id] ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={handleSuccessClose} />
          <div className="relative z-20 w-full max-w-md bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h3 className="font-montserrat text-xl md:text-2xl font-semibold mb-3 text-green-400">
                Tournament Approved Successfully!
              </h3>
              
              <p className="font-montserrat text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                The tournament request has been approved and is now available for student registration.
              </p>
              
              {/* Close Button */}
              <button
                onClick={handleSuccessClose}
                className="w-full bg-[#F2C21A] text-black font-montserrat text-sm font-semibold rounded-lg px-6 py-3 hover:bg-[#F2C21A]/90 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default RegionalAdmin;


