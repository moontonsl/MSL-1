import React, { useState, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
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
  const { tournaments, user } = usePage().props;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [localTournaments, setLocalTournaments] = useState(tournaments || []);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null); // Currently selected tournament
  const [mobileViewTeam, setMobileViewTeam] = useState(null); // mobile-only player popup
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitModalData, setSubmitModalData] = useState(null);

  // Transform real tournament data to match the expected format
  const transformedTournaments = useMemo(() => {
    if (!localTournaments || localTournaments.length === 0) return [];
    
    return localTournaments.map(tournament => ({
      ...tournament,
      teams: tournament.teams ? tournament.teams.map(team => ({
        id: team.id,
        name: team.team_name,
        result: team.result || 'participant', // Include result field
        players: team.members ? team.members.map(member => ({
          id: member.player_id,
          name: member.player ? `${member.player.name} ${member.player.surname}`.trim() : 'Unknown Player',
          verified: true, // Assuming all registered players are verified
          role: member.role
        })) : []
      })) : []
    }));
  }, [localTournaments]);

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
      
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'Value:', value);
      return 'Invalid Date';
    }
  };

  const handleOpen = () => setIsCreateOpen(true);
  const handleClose = () => {
    setIsCreateOpen(false);
    setStartDate('');
    setEndDate('');
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // If end date is before or equal to start date, clear it
    if (endDate && new Date(date) >= new Date(endDate)) {
      setEndDate('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!startDate || !endDate) return;
    
    // Validate dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check if start date is today or earlier
    if (start <= today) {
      alert('Start date must be tomorrow or later.');
      return;
    }
    
    // Check if end date is today or earlier
    if (end <= today) {
      alert('End date must be tomorrow or later.');
      return;
    }
    
    // Check if start date is earlier than end date
    if (start >= end) {
      alert('Start date must be earlier than end date.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/campus-tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add the new tournament to local state
        setLocalTournaments((existing) => [
          ...existing,
          {
            id: data.tournament.id,
            start_date: data.tournament.start_date,
            end_date: data.tournament.end_date,
            status: data.tournament.status,
            school_name: data.tournament.school_name,
            sl_name: data.tournament.sl_name,
            // teams: [], // No teams yet for new tournaments
          },
        ]);
        handleClose();
        setIsSuccessOpen(true);
      } else {
        alert('Error creating tournament: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Error creating tournament. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return;
    
    try {
      const response = await fetch(`/campus-tournaments/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLocalTournaments((existing) => existing.filter((t) => t.id !== id));
      } else {
        alert('Error deleting tournament: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Error deleting tournament. Please try again.');
    }
  };

  // Set the first active approved tournament as selected by default
  React.useEffect(() => {
    const activeTournaments = transformedTournaments.filter(t => 
      t.status === 'approved' && 
      !t.results_submitted
    );
    if (activeTournaments.length > 0 && !selectedTournamentId) {
      setSelectedTournamentId(activeTournaments[0].id);
    }
  }, [transformedTournaments, selectedTournamentId]);

  const handleTournamentChange = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
  };

  const handleSetResult = (tournamentId, teamId, result) => {
    setLocalTournaments((prev) =>
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

  const getStatusClasses = (value) => {
    const v = value || 'participant';
    if (v === 'win') return 'bg-yellow-400/60 border border-yellow-300/80 text-white';
    if (v === 'invalid') return 'bg-red-700/40 border border-red-600/70 text-white';
    return 'bg-green-500/30 border border-green-400/70 text-white';
  };

  const handleSubmitResults = async (tournamentId) => {
    const tournament = transformedTournaments.find((t) => t.id === tournamentId);
    
    if (!tournament || !tournament.teams || tournament.teams.length === 0) {
      setSubmitModalData({
        type: 'error',
        title: 'No Teams Found',
        message: 'No teams found for this tournament.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }
    
    // Check if exactly one team is marked as winner
    const winningTeams = tournament.teams.filter(team => team.result === 'win');
    if (winningTeams.length === 0) {
      setSubmitModalData({
        type: 'error',
        title: 'No Winning Team Selected',
        message: 'Please select exactly one winning team before submitting results.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }
    if (winningTeams.length > 1) {
      setSubmitModalData({
        type: 'error',
        title: 'Multiple Winners Selected',
        message: 'Only one team can be marked as winner. Please select only one winning team.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }
    
    // Check if all teams have results set
    const teamsWithoutResults = tournament.teams.filter(team => !team.result || team.result === '');
    if (teamsWithoutResults.length > 0) {
      setSubmitModalData({
        type: 'error',
        title: 'Incomplete Results',
        message: 'Please set results for all teams before submitting.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }
    
    // Show confirmation modal
    const winningTeam = winningTeams[0];
    setSubmitModalData({
      type: 'confirm',
      title: 'Confirm Results Submission',
      message: `Are you sure you want to submit the results?\n\nWinner: ${winningTeam.name}\n\nThis action cannot be undone.`,
      showCancel: true,
      tournamentId: tournamentId,
      tournament: tournament
    });
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!submitModalData.tournamentId) return;
    
    setIsSubmitting(true);
    setShowSubmitModal(false);
    
    try {
      // Prepare results data
      const results = submitModalData.tournament.teams.map(team => ({
        team_id: team.id,
        result: team.result
      }));
      
      const response = await fetch(`/campus-tournaments/${submitModalData.tournamentId}/submit-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({ results }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state to mark results as submitted
        setLocalTournaments((prev) =>
          prev.map((t) =>
            t.id === submitModalData.tournamentId
              ? { ...t, results_submitted: true, results_submitted_at: new Date().toISOString() }
              : t
          )
        );
        
        // Show success modal
        setSubmitModalData({
          type: 'success',
          title: 'Results Submitted Successfully!',
          message: 'Tournament results have been submitted and cannot be changed.',
          showCancel: false
        });
        setShowSubmitModal(true);
      } else {
        setSubmitModalData({
          type: 'error',
          title: 'Submission Failed',
          message: data.error || 'Unknown error occurred while submitting results.',
          showCancel: false
        });
        setShowSubmitModal(true);
      }
    } catch (error) {
      console.error('Error submitting results:', error);
      setSubmitModalData({
        type: 'error',
        title: 'Submission Failed',
        message: 'Error submitting results. Please try again.',
        showCancel: false
      });
      setShowSubmitModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false);
    setSubmitModalData(null);
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
                {/* Tournament Selector Dropdown */}
                {transformedTournaments.filter(t => t.status === 'approved').length > 1 && (
                  <div className="relative w-full max-w-7xl mx-auto">
                    <div className="bg-neutral-800/80 rounded-2xl border border-neutral-700/50 p-4">
                      <label className="block text-white/80 font-montserrat text-sm mb-2">Select Tournament:</label>
                      <select
                        value={selectedTournamentId || ''}
                        onChange={(e) => handleTournamentChange(parseInt(e.target.value))}
                        className="w-full bg-neutral-700/50 border border-white/20 rounded-lg px-4 py-2 text-white font-montserrat focus:outline-none focus:ring-2 focus:ring-[#F2C21A]"
                      >
                        {transformedTournaments
                          .filter(t => t.status === 'approved')
                          .map((tournament) => (
                            <option key={tournament.id} value={tournament.id}>
                              {tournament.school_name.toUpperCase()} TOURNAMENT - {formatDate(tournament.start_date)} to {formatDate(tournament.end_date)}
                              {tournament.results_submitted ? ' (Completed)' : ''}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Single Tournament Display */}
                {selectedTournamentId && (() => {
                  const selectedTournament = transformedTournaments.find(t => t.id === selectedTournamentId);
                  if (!selectedTournament) return null;
                  
                  return (
                    <div className="relative w-full max-w-7xl mx-auto text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50">
                      {/* Header */}
                      <div className="relative z-10 w-full h-16 md:h-20 flex items-center justify-between bg-neutral-900/70 px-4 md:px-6">
                        <div className="flex-1 text-center">
                          <div className="font-montserrat text-lg md:text-2xl tracking-wide">{selectedTournament.school_name.toUpperCase()} TOURNAMENT</div>
                          <div className="font-montserrat text-xs md:text-sm text-white/70">
                            {formatDate(selectedTournament.start_date)} - {formatDate(selectedTournament.end_date)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Show delete button only for pending tournaments */}
                          {selectedTournament.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleDelete(selectedTournament.id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-montserrat text-xs font-semibold rounded-lg px-3 py-1.5"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Tournament Content - Always Expanded */}
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
                          {Array.isArray(selectedTournament.teams) && selectedTournament.teams.length > 0 ? (
                            selectedTournament.teams.map((team) => (
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
                                    <select
                                      value={team.result || 'participant'}
                                      onChange={(e) => handleSetResult(selectedTournament.id, team.id, e.target.value)}
                                      disabled={selectedTournament.results_submitted}
                                      className={`rounded-md px-2 py-1 ${getStatusClasses(team.result || 'participant')} focus:text-black text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#F2C21A] min-w-[128px] ${selectedTournament.results_submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                      <option className="text-black" value="">Select</option>
                                      <option className="text-black" value="win">Win</option>
                                      <option className="text-black" value="invalid">Invalid</option>
                                      <option className="text-black" value="participant">Participant</option>
                                    </select>
                                  </div>
                                </div>
                                {/* Mobile Row */}
                                <div
                                  key={`m-${team.id}`}
                                  className="grid md:hidden [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-2 items-center px-4 py-3 border-t border-white/10 hover:bg-white/5 transition"
                                >
                                  <div className="text-white/90 font-montserrat truncate">{team.name}</div>
                                  <div className="flex justify-start">
                                    <select
                                      value={team.result || 'participant'}
                                      onChange={(e) => handleSetResult(selectedTournament.id, team.id, e.target.value)}
                                      disabled={selectedTournament.results_submitted}
                                      className={`rounded-md px-2 py-1 ${getStatusClasses(team.result || 'participant')} focus:text-black text-xs focus:outline-none focus:ring-2 focus:ring-[#F2C21A] min-w-[112px] ${selectedTournament.results_submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                      <option className="text-black" value="">Select</option>
                                      <option className="text-black" value="win">Win</option>
                                      <option className="text-black" value="invalid">Invalid</option>
                                      <option className="text-black" value="participant">Participant</option>
                                    </select>
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
                          {/* Submit Results Button */}
                          <div className="px-4 md:px-10 py-2 md:py-3 border-t border-white/10 flex justify-center sticky bottom-0 bg-neutral-900/70">
                            {selectedTournament.results_submitted ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="bg-green-500/20 text-green-400 font-montserrat text-sm px-4 py-2 rounded-lg border border-green-400/30">
                                  ✓ Results Submitted
                                </div>
                                {selectedTournament.results_submitted_at && (
                                  <div className="text-white/60 font-montserrat text-xs">
                                    Submitted on {new Date(selectedTournament.results_submitted_at).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSubmitResults(selectedTournament.id)}
                                disabled={isSubmitting}
                                className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-5 py-2 mt-1 mb-1 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSubmitting ? 'Submitting...' : 'Submit Results'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
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
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    onFocus={(e) => { if (e.target.showPicker) { try { e.target.showPicker(); } catch (_) {} } }}
                    min={(() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      return tomorrow.toISOString().split('T')[0];
                    })()}
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
                    min={(() => {
                      // If start date is selected, use start date + 1 day as minimum
                      if (startDate) {
                        const startDateObj = new Date(startDate);
                        startDateObj.setDate(startDateObj.getDate() + 1);
                        return startDateObj.toISOString().split('T')[0];
                      }
                      // Otherwise, use tomorrow as minimum
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      return tomorrow.toISOString().split('T')[0];
                    })()}
                    className="bg-transparent border border-white/50 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F2C21A]"
                  />
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-xl px-8 py-3 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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

      {/* Success Modal */}
      {isSuccessOpen && (
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
                Tournament Created Successfully!
              </h3>
              
              <p className="font-montserrat text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                Your tournament request has been created successfully. Please wait for Regional Admin approval.
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

      {/* Submit Results Modal */}
      {showSubmitModal && submitModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10" onClick={handleCloseSubmitModal} />
          <div className="relative z-20 w-full max-w-md bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Icon based on modal type */}
                {submitModalData.type === 'error' && (
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                )}
                {submitModalData.type === 'success' && (
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {submitModalData.type === 'confirm' && (
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <h3 className="font-montserrat text-lg md:text-xl font-semibold">
                  {submitModalData.title}
                </h3>
              </div>
              <button
                onClick={handleCloseSubmitModal}
                className="w-8 h-8 grid place-items-center rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="mb-6">
              <p className="font-montserrat text-sm md:text-base text-white/80 leading-relaxed whitespace-pre-line">
                {submitModalData.message}
              </p>
            </div>
            
            {/* Modal Actions */}
            <div className="flex gap-3 justify-end">
              {submitModalData.showCancel && (
                <button
                  onClick={handleCloseSubmitModal}
                  className="px-4 py-2 bg-neutral-700/50 hover:bg-neutral-600/50 text-white font-montserrat text-sm font-medium rounded-lg border border-white/20 transition-colors"
                >
                  Cancel
                </button>
              )}
              {submitModalData.type === 'confirm' ? (
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#F2C21A] hover:bg-[#F2C21A]/90 text-black font-montserrat text-sm font-semibold rounded-lg shadow-[0_0_8px_-3px_rgba(242,194,26,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
                </button>
              ) : (
                <button
                  onClick={handleCloseSubmitModal}
                  className={`px-6 py-2 font-montserrat text-sm font-semibold rounded-lg transition-colors ${
                    submitModalData.type === 'error' 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  );
};

export default CampusTournament;
