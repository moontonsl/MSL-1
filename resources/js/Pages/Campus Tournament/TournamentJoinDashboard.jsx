import React, { useState, useRef, useLayoutEffect, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout.jsx';
import RosterLockNotice from '@/Components/RosterLockNotice.jsx';
import { ChevronDown, User } from 'lucide-react';

const UNIVERSITY_TITLE = 'BATANGAS STATE UNIVERSITY-LIPA CITY';
const EVENT_DATE = 'Mar 12, 2026 – Mar 23, 2026';

const ROLE_IMAGE_MAP = {
  Jungler: 'zxq_icon_jgl.png',
  Roam: 'zxq_icon_roam.png',
  'Gold Laner': 'zxq_icon_gold.png',
  'Exp Laner': 'zxq_icon_exp.png',
  'Mid Laner': 'zxq_icon_mid.png',
};

function getVacantRoleLabel(role) {
  // Punchy labels to avoid truncation in the tight grid.
  if (role === 'Gold Laner') return 'Gold';
  if (role === 'Exp Laner') return 'Exp';
  if (role === 'Mid Laner') return 'Mid';
  return role;
}

function RoleIcon({ role }) {
  const file = ROLE_IMAGE_MAP[role];
  if (!file) return null;
  return (
    <img
      src={`/images/Campus Tournament/Roles/${file}`}
      alt={role}
      className="w-5 h-5 object-contain"
      aria-hidden
    />
  );
}

/** Roles open for new joins (vacant slots only). */
function getAvailableRolesForJoin(team) {
  if (!team?.slots) return [];
  return team.slots.filter((s) => !s.isFilled).map((s) => s.role);
}

/** Current user's role when `playerName === 'You'` (demo). */
function getCurrentUserRole(team) {
  const slot = team?.slots?.find((s) => s.isFilled && s.playerName === 'You');
  return slot?.role ?? null;
}

/** Edit: vacant roles plus current role (can stay or move to an open lane). */
function getAvailableRolesForEdit(team) {
  const vacant = getAvailableRolesForJoin(team);
  const current = getCurrentUserRole(team);
  const set = new Set(vacant);
  if (current) set.add(current);
  return Array.from(set);
}

/** @type {{ id: string, teamName: string, type: 'solo' | 'team', status?: 'Confirmed' | 'Pending', slots: Array<{ isFilled: boolean, playerName?: string, role: string, accepted?: boolean, ign?: string, avatarUrl?: string, facebook_link?: string }>, userOnTeam?: boolean, registrationStatus?: 'confirmed' | 'pending' }[]} */
const DUMMY_TEAMS = [
  {
    id: 'team-1',
    teamName: 'Solo Team 1',
    type: 'solo',
    status: 'Confirmed',
    slots: [
      { isFilled: true, playerName: 'Miya Tan', role: 'Gold Laner', accepted: true, ign: 'MiyaIGN' },
      { isFilled: false, role: 'Jungler' },
      { isFilled: false, role: 'Roam' },
      { isFilled: true, playerName: 'John Doe', role: 'Mid Laner', accepted: true, ign: 'JohnIGN' },
      { isFilled: false, role: 'Exp Laner' },
    ],
  },
  {
    id: 'team-2',
    teamName: 'Solo Team 2',
    type: 'solo',
    status: 'Confirmed',
    userOnTeam: true,
    slots: [
      { isFilled: true, playerName: 'You', role: 'Jungler', accepted: true, ign: 'YouIGN' },
      { isFilled: false, role: 'Roam' },
      { isFilled: true, playerName: 'Alex Rivera', role: 'Gold Laner', accepted: true, ign: 'AlexIGN' },
      { isFilled: false, role: 'Mid Laner' },
      { isFilled: false, role: 'Exp Laner' },
    ],
  },
  {
    id: 'team-3',
    teamName: 'Campus Squad Alpha',
    type: 'team',
    status: 'Confirmed',
    registrationStatus: 'confirmed',
    slots: [
      { isFilled: true, playerName: 'Chris Lee', role: 'Exp Laner', accepted: true, ign: 'ChrisIGN' },
      { isFilled: true, playerName: 'Sam Cruz', role: 'Jungler', accepted: true, ign: 'SamIGN' },
      { isFilled: true, playerName: 'Pat Santos', role: 'Roam', accepted: true, ign: 'PatIGN' },
      { isFilled: true, playerName: 'Kim Park', role: 'Gold Laner', accepted: true, ign: 'KimIGN' },
      { isFilled: true, playerName: 'Lee Wong', role: 'Mid Laner', accepted: true, ign: 'LeeIGN' },
    ],
  },
  {
    id: 'team-4',
    teamName: 'Night Owls',
    type: 'team',
    status: 'Pending',
    registrationStatus: 'pending',
    slots: [
      { isFilled: true, playerName: 'Rhea M.', role: 'Mid Laner', accepted: true, ign: 'RheaIGN' },
      { isFilled: true, playerName: 'Ezra Jung', role: 'Jungler', accepted: true, ign: 'EzraIGN' },
      { isFilled: true, playerName: 'Dino K.', role: 'Roam', accepted: true, ign: 'DinoIGN' },
      { isFilled: true, playerName: 'Noah Gold', role: 'Gold Laner', accepted: true, ign: 'NoahIGN' },
      { isFilled: true, playerName: 'Olivia Exp', role: 'Exp Laner', accepted: true, ign: 'OliviaIGN' },
    ],
  },
];

function SlotCell({ slot, onEmptyClick }) {
  if (slot.isFilled) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative h-8 w-8 rounded-full border border-neutral-600 bg-neutral-800 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-gray-400 shrink-0" aria-hidden />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-[#111111]" />
        </div>

        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm text-white font-medium truncate w-full" title={slot?.playerName || 'Player'}>
            {slot?.playerName || 'Player'}
          </span>
          <span className="text-xs text-gray-500 truncate w-full" title={slot?.ign || '-'}>
            {slot?.ign || '-'}
          </span>
        </div>
      </div>
    );
  }

  const roleName = getVacantRoleLabel(slot.role);
  return (
    <button
      type="button"
      onClick={() => onEmptyClick?.(slot.role)}
      className="min-w-0 flex items-center gap-2"
    >
      <div className="flex items-center gap-2 min-w-0">
        {/* Icon Box */}
        <div className="h-8 w-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
          {/* Role Icon */}
          <RoleIcon role={slot.role} size={16} />
        </div>
        {/* Stacked Text Column */}
        <div className="flex flex-col items-start leading-tight min-w-0">
          <span className="text-sm text-red-500 font-medium uppercase tracking-wider truncate">{roleName}</span>
          <span className="text-[11px] text-gray-500 truncate">Vacant</span>
        </div>
      </div>
    </button>
  );
}

function ModalRoleSelect({ value, onChange, options, isOpen, onToggle, triggerRef, menuRef }) {
  const [pos, setPos] = useState(null);

  const update = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 8, left: r.left, width: r.width });
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPos(null);
      return;
    }
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [isOpen, update]);

  useEffect(() => {
    if (!isOpen) return;
    const down = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      onToggle(false);
    };
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
  }, [isOpen, onToggle, triggerRef, menuRef]);

  const list = options?.length ? options : [];

  return (
    <>
      <div className="relative z-50 w-full" ref={triggerRef}>
        <button
          type="button"
          onClick={() => onToggle(!isOpen)}
          disabled={list.length === 0}
          className="w-full rounded-xl border border-neutral-600 bg-white px-4 py-3 flex items-center justify-between text-left text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={value ? 'text-black' : 'text-gray-500'}>
            {list.length === 0 ? 'No roles available' : value || 'Select Role'}
          </span>
          <ChevronDown className={`w-4 h-4 text-black/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {isOpen &&
        pos &&
        list.length > 0 &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: 10000,
            }}
            className="bg-white border border-neutral-300 rounded-xl max-h-[220px] overflow-y-auto shadow-2xl custom-scrollbar"
          >
            {list.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  onChange(role);
                  onToggle(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-neutral-100 ${
                  value === role ? 'text-[#FFC107] font-semibold' : 'text-neutral-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}

export default function TournamentJoinDashboard() {
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [modalRole, setModalRole] = useState('');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const modalRoleTriggerRef = useRef(null);
  const modalRoleMenuRef = useRef(null);

  const filteredTeams = useMemo(() => {
    const allFilled = (team) => team.slots.every((s) => Boolean(s.isFilled));
    const hasVacant = (team) => team.slots.some((s) => !s.isFilled);

    if (filter === 'all') {
      if (statusFilter === 'All') return DUMMY_TEAMS;
      return DUMMY_TEAMS.filter((t) => t.status === statusFilter);
    }

    if (filter === 'solo') {
      // Solo players need at least one vacant lane, or they can see their own team.
      return DUMMY_TEAMS.filter((t) => t.userOnTeam || hasVacant(t));
    }

    // Team registration context: only show teams with NO vacant lanes.
    return DUMMY_TEAMS.filter((t) => t.type === 'team' && allFilled(t));
  }, [filter, statusFilter]);

  const roleOptionsForModal = useMemo(() => {
    if (!selectedTeam) return [];
    if (activeModal === 'join') return getAvailableRolesForJoin(selectedTeam);
    if (activeModal === 'edit') return getAvailableRolesForEdit(selectedTeam);
    return [];
  }, [selectedTeam, activeModal]);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTeam(null);
    setModalRole('');
    setRoleMenuOpen(false);
  };

  const openJoinModal = (team, roleHint) => {
    const available = getAvailableRolesForJoin(team);
    setSelectedTeam(team);
    setActiveModal('join');
    setRoleMenuOpen(false);
    const hint = roleHint && available.includes(roleHint) ? roleHint : '';
    setModalRole(hint);
  };

  const openEditModal = (team) => {
    setSelectedTeam(team);
    setActiveModal('edit');
    setRoleMenuOpen(false);
    setModalRole(getCurrentUserRole(team) || '');
  };

  const openLeaveModal = (team) => {
    setSelectedTeam(team);
    setActiveModal('leave');
    setRoleMenuOpen(false);
  };

  const openRandomModal = () => {
    setSelectedTeam(null);
    setActiveModal('random');
    setRoleMenuOpen(false);
  };

  useEffect(() => {
    if (activeModal !== 'join' && activeModal !== 'edit') return;
    if (!selectedTeam || roleOptionsForModal.length === 0) return;
    if (modalRole && !roleOptionsForModal.includes(modalRole)) {
      setModalRole(roleOptionsForModal[0] || '');
    }
  }, [activeModal, selectedTeam, roleOptionsForModal, modalRole]);

  const rowAction = (team) => {
    const openSlots = team.slots.filter((s) => !s.isFilled).length;
    const full = openSlots === 0;

    if (team.userOnTeam) {
      return (
        <>
          <button
            type="button"
            onClick={() => openEditModal(team)}
            className="w-fit px-5 py-1.5 text-sm h-[32px] flex items-center justify-center rounded-full font-medium bg-[#FFC107]/15 text-[#FFC107] border border-[#FFC107]/50 hover:bg-[#FFC107]/25 transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => openLeaveModal(team)}
            className="w-fit px-5 py-1.5 text-sm h-[32px] flex items-center justify-center rounded-full font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            Leave
          </button>
        </>
      );
    }
    if (full) {
      const status = team.registrationStatus ?? 'confirmed';
      if (status === 'pending') {
        return (
          <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
            Pending
          </span>
        );
      }
      return (
        <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/50">
          Confirmed
        </span>
      );
    }
    return (
      <button
        type="button"
        onClick={() => openJoinModal(team)}
        className="w-fit px-5 py-1.5 text-sm h-[32px] flex items-center justify-center rounded-full font-medium bg-green-600 hover:bg-green-500 text-white transition-colors"
      >
        Join Team
      </button>
    );
  };

  return (
    <MainLayout>
      <Head title="Tournament Join" />
      <section
        className="relative min-h-[calc(100vh-120px)] py-8 md:py-12 overflow-visible"
        style={{
          backgroundImage: "url('/images/Campus Tournament/MainBG.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 w-[95%] max-w-[1600px] mx-auto px-4 font-['Montserrat']">
          <div className="bg-[#111111] rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
            <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8 md:mb-10">
              <div className="flex-1 text-center md:text-left md:pr-8">
                <h1 className="text-white font-bold text-lg md:text-2xl tracking-tight uppercase leading-snug">
                  {UNIVERSITY_TITLE}
                </h1>
                <p className="mt-2 text-white/70 text-sm md:text-base">{EVENT_DATE}</p>
              </div>
              <div className="flex justify-center md:justify-end md:absolute md:top-0 md:right-0 w-full md:w-auto">
                <RosterLockNotice />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 lg:gap-6 items-start">
              <aside className="w-full md:w-32 lg:w-36 shrink-0 flex flex-col gap-3">
                <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Join team</p>
                <div className="block md:hidden w-full mb-4">
                  <select
                    className="w-full bg-[#1A1A1A] border border-neutral-700 text-white text-sm rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-[#FFC107]"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="solo">Solo</option>
                    <option value="team">Team</option>
                  </select>
                </div>

                <div className="hidden md:flex md:flex-col w-full md:w-36 shrink-0 gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'solo', label: 'Solo' },
                    { id: 'team', label: 'Team' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilter(item.id)}
                      className={`w-full shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm text-left transition-colors ${
                        filter === item.id
                          ? 'bg-[#FFC107] text-black font-semibold shadow'
                          : 'bg-neutral-800 text-gray-400 hover:text-white/90'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </aside>

              <div className="flex-1 min-w-0 w-full">
                {filter === 'all' && (
                  <div className="flex items-center gap-2 mb-4">
                    {['All', 'Confirmed', 'Pending'].map((pill) => (
                      <button
                        key={pill}
                        type="button"
                        onClick={() => setStatusFilter(pill)}
                        className={`${
                          statusFilter === pill
                            ? 'bg-[#FFC107] text-black font-medium px-4 py-1.5 rounded-full text-sm transition-colors'
                            : 'bg-neutral-800 text-gray-400 hover:text-white hover:bg-neutral-700 px-4 py-1.5 rounded-full text-sm transition-colors'
                        }`}
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                )}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  {filteredTeams.map((team) => (
                    <div
                      key={team.id}
                      className="w-full bg-[#1A1A1A] border border-neutral-800 rounded-xl p-4 mb-3 transition-colors flex flex-col gap-4 lg:grid lg:grid-cols-[160px_repeat(5,minmax(0,1fr))_120px] lg:gap-3 lg:items-center hover:bg-[#222222]"
                    >
                      <div className="w-full lg:w-[160px] text-lg lg:text-sm mb-2 lg:mb-0 shrink-0 font-semibold text-white truncate">
                        {team.teamName}
                      </div>

                      <div className="grid grid-cols-2 gap-3 w-full lg:contents">
                        {team.slots.map((slot, idx) => (
                          <SlotCell
                            key={idx}
                            slot={slot}
                            onEmptyClick={(role) => openJoinModal(team, role)}
                          />
                        ))}
                      </div>

                      <div className="flex flex-row justify-center lg:justify-end items-center gap-2 w-full lg:w-[120px] mt-3 lg:mt-0 pt-3 lg:pt-0 border-t border-neutral-800 lg:border-t-0">
                        {rowAction(team)}
                      </div>
                    </div>
                  ))}
                </div>

                {filter === 'solo' && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={openRandomModal}
                      className="w-full max-w-[250px] mx-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-full transition-colors mt-4"
                    >
                      Join Randomly
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeModal !== null && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm p-4 bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tournament-modal-title"
        >
          <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-6 shadow-2xl relative">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/50 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              ×
            </button>

            {activeModal === 'join' && selectedTeam && (
              <>
                <h2 id="tournament-modal-title" className="text-base text-white leading-relaxed px-1">
                  You are about to join{' '}
                  <span className="text-[#FFC107] font-bold">&apos;{selectedTeam.teamName}&apos;</span>
                </h2>
                <div className="w-full flex flex-col gap-2 text-left">
                  <label className="text-xs text-white/60">Select Role</label>
                  <ModalRoleSelect
                    value={modalRole}
                    onChange={setModalRole}
                    options={roleOptionsForModal}
                    isOpen={roleMenuOpen}
                    onToggle={setRoleMenuOpen}
                    triggerRef={modalRoleTriggerRef}
                    menuRef={modalRoleMenuRef}
                  />
                  <p className="text-[11px] text-red-400/90 leading-snug">
                    Once you take a role, it becomes unavailable for others: Jungler, Roam, Gold Laner, Exp Laner, Mid Laner.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!modalRole || roleOptionsForModal.length === 0}
                  onClick={closeModal}
                  className="bg-[#FFC107] text-black font-bold w-full rounded-full py-2.5 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Join
                </button>
              </>
            )}

            {activeModal === 'edit' && selectedTeam && (
              <>
                <h2 id="tournament-modal-title" className="text-lg font-bold text-white">
                  Edit your role
                </h2>
                <div className="w-full flex flex-col gap-2 text-left">
                  <label className="text-xs text-white/60">Select Role</label>
                  <ModalRoleSelect
                    value={modalRole}
                    onChange={setModalRole}
                    options={roleOptionsForModal}
                    isOpen={roleMenuOpen}
                    onToggle={setRoleMenuOpen}
                    triggerRef={modalRoleTriggerRef}
                    menuRef={modalRoleMenuRef}
                  />
                  <p className="text-[11px] text-red-400/90 leading-snug">
                    Once you take a role, it becomes unavailable for others: Jungler, Roam, Gold Laner, Exp Laner, Mid Laner.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!modalRole || roleOptionsForModal.length === 0}
                  onClick={closeModal}
                  className="bg-[#FFC107] text-black font-bold w-full rounded-full py-2.5 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Submit
                </button>
              </>
            )}

            {activeModal === 'leave' && selectedTeam && (
              <>
                <h2 id="tournament-modal-title" className="text-lg font-bold text-white leading-snug">
                  Are you sure you want to leave this team?
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 text-white font-bold w-full rounded-full py-2.5 hover:bg-red-600 transition-colors"
                >
                  Leave
                </button>
              </>
            )}

            {activeModal === 'random' && (
              <>
                <h2 id="tournament-modal-title" className="text-sm text-gray-400 leading-relaxed">
                  You will be assigned to a random solo team based on your preferred role.
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-green-500 text-white font-bold w-full rounded-full py-2.5 hover:bg-green-600 transition-colors"
                >
                  Accept
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
