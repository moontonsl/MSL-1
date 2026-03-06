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
  const [tournamentType, setTournamentType] = useState('Online');
  const [localTournaments, setLocalTournaments] = useState(tournaments || []);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null); // Currently selected tournament
  const [mobileViewTeam, setMobileViewTeam] = useState(null); // mobile-only player popup
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitModalData, setSubmitModalData] = useState(null);
  const [isEditingResults, setIsEditingResults] = useState(false); // New state for edit mode
  const [filterStatus, setFilterStatus] = useState('ongoing'); // 'ongoing' or 'completed'
  const [showOnline, setShowOnline] = useState(true);
  const [showOnsite, setShowOnsite] = useState(true);

  // Pagination State
  const [pendingPage, setPendingPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [tournamentPage, setTournamentPage] = useState(1);
  const itemsPerPage = 10;

  // Expansion state for cards
  const [expanded, setExpanded] = useState({});
  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

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

  // Filter approved tournaments based on selected tab
  const filteredActiveTournaments = useMemo(() => {
    return transformedTournaments.filter(t => {
      if (t.status !== 'approved') return false;

      // Status filter
      const matchesStatus = filterStatus === 'ongoing' ? !t.results_submitted : t.results_submitted;
      if (!matchesStatus) return false;

      // Type filter
      const type = (t.tournament_type || 'Online').toLowerCase();
      if (type === 'online' && !showOnline) return false;
      if (type === 'onsite' && !showOnsite) return false;

      return true;
    });
  }, [transformedTournaments, filterStatus, showOnline, showOnsite]);

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
    setTournamentType('Online');
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
          tournament_type: tournamentType,
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
            tournament_type: data.tournament.tournament_type,
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

  const openDeleteModal = (tournament) => {
    setDeleteTarget(tournament);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/campus-tournaments/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });

      const data = await response.json();

      if (data.success) {
        setLocalTournaments((existing) => existing.filter((t) => t.id !== deleteTarget.id));
        setShowDeleteModal(false);
        setDeleteTarget(null);
      } else {
        setShowDeleteModal(false);
        alert('Error deleting tournament: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      setShowDeleteModal(false);
      alert('Error deleting tournament. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Set the first active approved tournament as selected by default or when filter changes
  React.useEffect(() => {
    if (filteredActiveTournaments.length > 0) {
      // If currently selected tournament is not in the filtered list, select the first one
      const isSelectedInList = filteredActiveTournaments.some(t => t.id === selectedTournamentId);
      if (!selectedTournamentId || !isSelectedInList) {
        setSelectedTournamentId(filteredActiveTournaments[0].id);
      }
    } else {
      setSelectedTournamentId(null);
    }
  }, [filteredActiveTournaments, selectedTournamentId]);

  const handleTournamentChange = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setIsEditingResults(false); // Reset edit mode when changing tournament
  };

  React.useEffect(() => {
    setPendingPage(1);
    setRejectedPage(1);
    setTournamentPage(1);
  }, [showOnline, showOnsite, filterStatus]);

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
    if (v === '1st') return 'bg-yellow-400/60 border border-yellow-300/80 text-white';
    if (v === '2nd') return 'bg-gray-400/60 border border-gray-300/80 text-white';
    if (v === '3rd') return 'bg-orange-400/60 border border-orange-300/80 text-white';
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

    // Check if exactly one team is marked as 1st place
    const firstPlaceTeams = tournament.teams.filter(team => team.result === '1st');
    if (firstPlaceTeams.length === 0) {
      setSubmitModalData({
        type: 'error',
        title: 'No 1st Place Team Selected',
        message: 'Please select exactly one 1st place team before submitting results.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }
    if (firstPlaceTeams.length > 1) {
      setSubmitModalData({
        type: 'error',
        title: 'Multiple 1st Place Teams Selected',
        message: 'Only one team can be marked as 1st place. Please select only one 1st place team.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }

    // Check if exactly one team is marked as 2nd place
    const secondPlaceTeams = tournament.teams.filter(team => team.result === '2nd');
    if (secondPlaceTeams.length === 0) {
      setSubmitModalData({
        type: 'error',
        title: 'No 2nd Place Team Selected',
        message: 'Please select exactly one 2nd place team before submitting results.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }
    if (secondPlaceTeams.length > 1) {
      setSubmitModalData({
        type: 'error',
        title: 'Multiple 2nd Place Teams Selected',
        message: 'Only one team can be marked as 2nd place. Please select only one 2nd place team.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }

    // Check if exactly one team is marked as 3rd place
    const thirdPlaceTeams = tournament.teams.filter(team => team.result === '3rd');
    if (thirdPlaceTeams.length === 0) {
      setSubmitModalData({
        type: 'error',
        title: 'No 3rd Place Team Selected',
        message: 'Please select exactly one 3rd place team before submitting results.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }
    if (thirdPlaceTeams.length > 1) {
      setSubmitModalData({
        type: 'error',
        title: 'Multiple 3rd Place Teams Selected',
        message: 'Only one team can be marked as 3rd place. Please select only one 3rd place team.',
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
    const firstPlaceTeam = firstPlaceTeams[0];
    const secondPlaceTeam = secondPlaceTeams[0];
    const thirdPlaceTeam = thirdPlaceTeams[0];
    setSubmitModalData({
      type: 'confirm',
      title: isEditingResults ? 'Confirm Update Results' : 'Confirm Results Submission',
      message: `Are you sure you want to ${isEditingResults ? 'update' : 'submit'} the results?\n\n1st Place: ${firstPlaceTeam.name}\n2nd Place: ${secondPlaceTeam.name}\n3rd Place: ${thirdPlaceTeam.name}\n\n${isEditingResults ? 'This will update the existing rankings.' : 'This action cannot be undone.'}`,
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

      // Determine endpoint based on whether we are editing or submitting new
      const endpoint = isEditingResults
        ? `/campus-tournaments/${submitModalData.tournamentId}/update-results`
        : `/campus-tournaments/${submitModalData.tournamentId}/submit-results`;

      const response = await fetch(endpoint, {
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

        // Turn off edit mode
        setIsEditingResults(false);

        // Show success modal
        setSubmitModalData({
          type: 'success',
          title: isEditingResults ? 'Results Updated Successfully!' : 'Results Submitted Successfully!',
          message: isEditingResults ? 'Tournament results have been updated.' : 'Tournament results have been submitted and cannot be changed.',
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

  const Pagination = ({ currentPage, totalItems, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-6 space-x-2 font-montserrat">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 bg-neutral-800/80 text-white rounded-lg border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-700/80 transition-colors text-xs"
        >
          Prev
        </button>
        <div className="flex space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage === page
                ? "bg-[#F2C21A] text-black shadow-[0_0_10px_-3px_rgba(242,194,26,0.5)]"
                : "bg-neutral-800/80 text-white/70 hover:text-white border border-white/10"
                }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 bg-neutral-800/80 text-white rounded-lg border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-700/80 transition-colors text-xs"
        >
          Next
        </button>
      </div>
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

              {/* Pending Requests Section */}
              <div className="w-full max-w-7xl mx-auto bg-neutral-800/80 rounded-2xl border border-neutral-700/50 p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-montserrat font-semibold text-lg md:text-xl">Pending Requests</h2>
                  <span className="text-white/70 text-sm">{localTournaments.filter(t => t.status === 'pending').length} pending</span>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {localTournaments.filter(t => t.status === 'pending').length > 0 ? (
                    localTournaments
                      .filter(t => t.status === 'pending')
                      .sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id))
                      .slice((pendingPage - 1) * itemsPerPage, pendingPage * itemsPerPage)
                      .map((t) => (
                        <div key={t.id} className="flex items-center justify-between bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3">
                          <div className="flex flex-col">
                            <div className="text-white font-montserrat text-sm md:text-base">{(t.school_name || '').toUpperCase()} TOURNAMENT</div>
                            <div className="text-white/60 text-xs md:text-sm">{formatDate(t.start_date)} - {formatDate(t.end_date)} • {t.tournament_type || 'Online'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-md text-xs font-montserrat bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">Pending</span>
                            <button
                              type="button"
                              onClick={() => openDeleteModal(t)}
                              className="bg-red-600 hover:bg-red-700 text-white font-montserrat text-xs font-semibold rounded-lg px-3 py-1.5"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-white/60 text-sm">No pending tournament requests.</div>
                  )}
                </div>
                <Pagination
                  currentPage={pendingPage}
                  totalItems={localTournaments.filter(t => t.status === 'pending').length}
                  onPageChange={setPendingPage}
                />
              </div>

              {/* Rejected Requests Section */}
              <div className="w-full max-w-7xl mx-auto bg-neutral-800/80 rounded-2xl border border-red-900/30 p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-white font-montserrat font-semibold text-lg md:text-xl">Rejected Requests</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 border border-red-500/30">Not Entertained</span>
                  </div>
                  <span className="text-white/70 text-sm">{localTournaments.filter(t => t.status === 'rejected').length} rejected</span>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {localTournaments.filter(t => t.status === 'rejected').length > 0 ? (
                    localTournaments
                      .filter(t => t.status === 'rejected')
                      .sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id))
                      .slice((rejectedPage - 1) * itemsPerPage, rejectedPage * itemsPerPage)
                      .map((t) => (
                        <div key={t.id} className="flex flex-col md:flex-row md:items-center justify-between bg-neutral-900/40 border border-red-500/20 rounded-xl px-4 py-3 gap-3">
                          <div className="flex flex-col">
                            <div className="text-white font-montserrat text-sm md:text-base">{(t.school_name || '').toUpperCase()} TOURNAMENT</div>
                            <div className="text-white/60 text-xs md:text-sm">{formatDate(t.start_date)} - {formatDate(t.end_date)} • {t.tournament_type || 'Online'}</div>
                            {t.rejection_reason && (
                              <div className="text-red-300/80 text-xs mt-1 italic">Reason: {t.rejection_reason}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 self-end md:self-auto">
                            <span className="px-2 py-1 rounded-md text-xs font-montserrat bg-red-500/20 text-red-300 border border-red-400/30">Rejected</span>
                            <button
                              type="button"
                              onClick={() => openDeleteModal(t)}
                              className="bg-red-600 hover:bg-red-700 text-white font-montserrat text-xs font-semibold rounded-lg px-3 py-1.5"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-white/60 text-sm">No rejected tournament requests.</div>
                  )}
                </div>
                <Pagination
                  currentPage={rejectedPage}
                  totalItems={localTournaments.filter(t => t.status === 'rejected').length}
                  onPageChange={setRejectedPage}
                />
              </div>

              <div className="flex flex-col gap-4">
                {/* Filter Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-2 mb-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setFilterStatus('ongoing')}
                      className={`font-montserrat font-semibold text-sm md:text-base px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === 'ongoing'
                        ? 'bg-[#F2C21A] text-black shadow-[0_0_8px_-3px_rgba(242,194,26,1)]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      Ongoing ({transformedTournaments.filter(t => t.status === 'approved' && !t.results_submitted).length})
                    </button>
                    <button
                      onClick={() => setFilterStatus('completed')}
                      className={`font-montserrat font-semibold text-sm md:text-base px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === 'completed'
                        ? 'bg-[#F2C21A] text-black shadow-[0_0_8px_-3px_rgba(242,194,26,1)]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      Completed ({transformedTournaments.filter(t => t.status === 'approved' && t.results_submitted).length})
                    </button>
                  </div>

                  <div className="flex items-center gap-6 px-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={showOnline}
                          onChange={(e) => setShowOnline(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-white/30 rounded-md peer-checked:bg-[#F2C21A] peer-checked:border-[#F2C21A] transition-all duration-200 group-hover:border-[#F2C21A]/50"></div>
                        <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-montserrat text-sm text-white/80 group-hover:text-white transition-colors">Online</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={showOnsite}
                          onChange={(e) => setShowOnsite(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-white/30 rounded-md peer-checked:bg-[#F2C21A] peer-checked:border-[#F2C21A] transition-all duration-200 group-hover:border-[#F2C21A]/50"></div>
                        <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-montserrat text-sm text-white/80 group-hover:text-white transition-colors">Onsite</span>
                    </label>
                  </div>
                </div>

                {/* Tournament List - Paginated Cards */}
                <div className="flex flex-col gap-6">
                  {filteredActiveTournaments.length > 0 ? (
                    filteredActiveTournaments
                      .slice((tournamentPage - 1) * itemsPerPage, tournamentPage * itemsPerPage)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="relative w-full max-w-7xl mx-auto text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50"
                        >
                          {/* Tournament Card Header */}
                          <div className="relative z-10 w-full h-16 md:h-20 flex items-center justify-between bg-neutral-900/70 px-4 md:px-6">
                            <div className="flex-1 text-center">
                              <div className="font-montserrat text-lg md:text-2xl tracking-wide uppercase">{(item.school_name || '').toUpperCase()} TOURNAMENT</div>
                              <div className="font-montserrat text-xs md:text-sm text-white/70">
                                {formatDate(item.start_date)} - {formatDate(item.end_date)} • {item.tournament_type || 'Online'}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => openDeleteModal(item)}
                                  className="bg-red-500 hover:bg-red-600 text-white font-montserrat text-xs font-semibold rounded-lg px-3 py-1.5"
                                >
                                  Delete
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleExpand(item.id)}
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
                            className={`transition-all duration-500 ease-in-out ${expanded[item.id] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
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
                                {/* Mobile Row Header */}
                                <div className="md:hidden grid [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-5 px-4 py-2 text-white/70 text-xs border-b border-white/10 font-montserrat">
                                  <div className="self-center">Team name</div>
                                  <div className="justify-self-start text-left">Status</div>
                                  <div className="text-right"></div>
                                </div>

                                {/* Team Rows */}
                                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                  {Array.isArray(item.teams) && item.teams.length > 0 ? (
                                    item.teams.map((team) => (
                                      <React.Fragment key={team.id}>
                                        {/* Desktop Row */}
                                        <div className="hidden md:grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(120px,1fr)] gap-3 items-center px-6 md:px-10 py-3 border-t border-white/10 hover:bg-white/5 transition">
                                          <div className="text-white/90 font-montserrat md:truncate">{team.name}</div>
                                          {team.players.slice(0, 5).map((player, idx) => (
                                            <div className="flex justify-center" key={idx}>
                                              <PlayerCell player={player} />
                                            </div>
                                          ))}
                                          <div className="flex justify-center">
                                            <select
                                              value={team.result || 'participant'}
                                              onChange={(e) => handleSetResult(item.id, team.id, e.target.value)}
                                              disabled={item.results_submitted && !isEditingResults}
                                              className={`rounded-md px-2 py-1 ${getStatusClasses(team.result || 'participant')} focus:text-black text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#F2C21A] min-w-[128px] ${item.results_submitted && !isEditingResults ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                              <option className="text-black" value="participant">Participant</option>
                                              <option className="text-black" value="1st">1st</option>
                                              <option className="text-black" value="2nd">2nd</option>
                                              <option className="text-black" value="3rd">3rd</option>
                                            </select>
                                          </div>
                                        </div>
                                        {/* Mobile Row */}
                                        <div className="grid md:hidden [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-2 items-center px-4 py-3 border-t border-white/10 hover:bg-white/5 transition">
                                          <div className="text-white/90 font-montserrat truncate">{team.name}</div>
                                          <div className="flex justify-start">
                                            <select
                                              value={team.result || 'participant'}
                                              onChange={(e) => handleSetResult(item.id, team.id, e.target.value)}
                                              disabled={item.results_submitted && !isEditingResults}
                                              className={`rounded-md px-2 py-1 ${getStatusClasses(team.result || 'participant')} focus:text-black text-xs focus:outline-none focus:ring-2 focus:ring-[#F2C21A] min-w-[112px] ${item.results_submitted && !isEditingResults ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                              <option className="text-black" value="participant">Participant</option>
                                              <option className="text-black" value="1st">1st</option>
                                              <option className="text-black" value="2nd">2nd</option>
                                              <option className="text-black" value="3rd">3rd</option>
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
                                      </React.Fragment>
                                    ))
                                  ) : (
                                    <div className="px-4 py-6 text-center text-white/60 font-montserrat">No teams registered yet.</div>
                                  )}
                                </div>

                                {/* Submit/Edit Results Section */}
                                <div className="px-4 md:px-10 py-4 border-t border-white/10 flex flex-wrap justify-center gap-4 bg-neutral-900/70">
                                  {item.results_submitted ? (
                                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                                      <div className="bg-green-500/20 text-green-400 font-montserrat text-sm px-4 py-2 rounded-lg border border-green-400/30">
                                        ✓ Results Submitted
                                      </div>
                                      {item.results_submitted_at && (
                                        <div className="text-white/60 font-montserrat text-xs">
                                          Submitted on {new Date(item.results_submitted_at).toLocaleDateString()}
                                        </div>
                                      )}
                                      <a
                                        href={`/campus-tournaments/${item.id}/export`}
                                        className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-5 py-2 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] hover:bg-[#d4a817] transition-colors flex items-center gap-2"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Excel
                                      </a>
                                      {isEditingResults ? (
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleSubmitResults(item.id)}
                                            className="bg-[#F2C21A] text-black font-montserrat text-xs font-semibold rounded-lg px-4 py-2"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={() => setIsEditingResults(false)}
                                            className="bg-neutral-700 text-white font-montserrat text-xs font-semibold rounded-lg px-4 py-2"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setIsEditingResults(true)}
                                          className="bg-blue-600 text-white font-montserrat text-xs font-semibold rounded-lg px-4 py-2"
                                        >
                                          Edit
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleSubmitResults(item.id)}
                                      className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-6 py-2 shadow-[0_0_8px_-3px_rgba(242,194,26,1)]"
                                    >
                                      Submit Results
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-white/60 text-center py-8 font-montserrat italic">
                      {filterStatus === 'ongoing' ? 'No ongoing tournaments.' : 'No completed tournaments.'}
                    </div>
                  )}

                  {/* Pagination */}
                  <Pagination
                    currentPage={tournamentPage}
                    totalItems={filteredActiveTournaments.length}
                    onPageChange={setTournamentPage}
                  />
                </div>
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
                    onFocus={(e) => { if (e.target.showPicker) { try { e.target.showPicker(); } catch (_) { } } }}
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
                    onFocus={(e) => { if (e.target.showPicker) { try { e.target.showPicker(); } catch (_) { } } }}
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
                <label className="flex flex-col gap-2">
                  <span className="font-montserrat text-lg md:text-xl">Tournament Type</span>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setTournamentType('Online')}
                      className={`flex-1 px-4 py-3 rounded-xl border font-montserrat transition-all ${tournamentType === 'Online'
                        ? 'bg-[#F2C21A] text-black border-[#F2C21A]'
                        : 'bg-transparent text-white border-white/50 hover:border-[#F2C21A]/50'
                        }`}
                    >
                      Online
                    </button>
                    <button
                      type="button"
                      onClick={() => setTournamentType('Onsite')}
                      className={`flex-1 px-4 py-3 rounded-xl border font-montserrat transition-all ${tournamentType === 'Onsite'
                        ? 'bg-[#F2C21A] text-black border-[#F2C21A]'
                        : 'bg-transparent text-white border-white/50 hover:border-[#F2C21A]/50'
                        }`}
                    >
                      Onsite
                    </button>
                  </div>
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
                {mobileViewTeam.players.slice(0, 5).map((player, idx) => (
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
                    className={`px-6 py-2 font-montserrat text-sm font-semibold rounded-lg transition-colors ${submitModalData.type === 'error'
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10" onClick={closeDeleteModal} />
            <div className="relative z-20 w-full max-w-md bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="font-montserrat text-lg md:text-xl font-semibold">Delete Tournament</h3>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="w-8 h-8 grid place-items-center rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="font-montserrat text-sm md:text-base text-white/80 leading-relaxed">
                  Are you sure you want to permanently delete
                  {" "}
                  <span className="text-white font-semibold">{(deleteTarget.school_name || '').toUpperCase()} Tournament</span>
                  ? This action cannot be undone.
                </p>
                <div className="mt-2 text-white/60 text-sm">
                  {formatDate(deleteTarget.start_date)} - {formatDate(deleteTarget.end_date)}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-neutral-700/50 hover:bg-neutral-600/50 text-white font-montserrat text-sm font-medium rounded-lg border border-white/20 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-montserrat text-sm font-semibold rounded-lg border border-red-400/20 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout >
  );
};

export default CampusTournament;
