import React, { useMemo, useState } from 'react';
import RosterLockNotice from '@/Components/RosterLockNotice.jsx';
import { User } from 'lucide-react';

const ROLE_IMAGE_MAP = {
  Jungler: 'zxq_icon_jgl.png',
  Roam: 'zxq_icon_roam.png',
  'Gold Laner': 'zxq_icon_gold.png',
  'Exp Laner': 'zxq_icon_exp.png',
  'Mid Laner': 'zxq_icon_mid.png',
};

const SOLO_ROLES = ['Jungler', 'Roam', 'Gold Laner', 'Exp Laner', 'Mid Laner'];

function getVacantRoleLabel(role) {
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
      className="w-4 h-4 md:w-5 md:h-5 object-contain"
      aria-hidden
    />
  );
}

function SlotCell({ slot }) {
  if (slot.isFilled) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative h-8 w-8 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-gray-400 shrink-0" aria-hidden />
          <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#111111] ${slot.accepted ? 'bg-green-500' : 'bg-red-500'}`} />
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
    <div className="min-w-0 flex items-center gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-8 w-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
          <RoleIcon role={slot.role} />
        </div>
        <div className="flex flex-col items-start leading-tight min-w-0">
          <span className="text-[11px] md:text-xs text-red-500 font-medium uppercase tracking-wider truncate">
            {roleName}
          </span>
          <span className="text-[10px] text-gray-500 truncate">Vacant</span>
        </div>
      </div>
    </div>
  );
}

export default function RosterManager({ tournament }) {
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('All');

  const processedTeams = useMemo(() => {
    const rawTeams = Array.isArray(tournament?.teams) ? tournament.teams : [];
    
    return rawTeams.map(team => {
      let slots = [];
      if (team.type === 'solo') {
        // Map the 5 roles for solo teams
        slots = SOLO_ROLES.map(role => {
          const player = (team.players || []).find(p => p.lane_role === role);
          return {
            role,
            isFilled: !!player,
            playerName: player ? player.name : null,
            ign: player ? player.ign : null,
            accepted: player ? player.accepted : false
          };
        });
      } else {
        // Regular 5-man team
        slots = (team.players || []).slice(0, 5).map(player => ({
          role: player.lane_role || 'Member',
          isFilled: true,
          playerName: player.name,
          ign: player.ign,
          accepted: player.accepted
        }));
        // Fill remaining slots if < 5
        while (slots.length < 5) {
          slots.push({ isFilled: false, role: 'Member' });
        }
      }

      // Automated Status Logic: 
      // Registered/Confirmed only if 5 players are present AND all are accepted.
      const filledCount = slots.filter(s => s.isFilled).length;
      const allAccepted = slots.filter(s => s.isFilled).every(s => s.accepted);
      const isFullyRegistered = filledCount === 5 && allAccepted;

      return {
        ...team,
        slots,
        isFullyRegistered
      };
    });
  }, [tournament?.teams]);

  const teamCounts = useMemo(() => {
    const total = processedTeams.length;
    const solo = processedTeams.filter((t) => t.type === 'solo').length;
    const team = processedTeams.filter((t) => t.type !== 'solo').length;
    return { total, solo, team };
  }, [processedTeams]);

  const filteredTeams = useMemo(() => {
    const byType =
      filter === 'all' ? processedTeams : processedTeams.filter((t) => (filter === 'solo' ? t.type === 'solo' : t.type !== 'solo'));
    
    if (statusFilter === 'All') return byType;
    
    return byType.filter((t) => {
      const status = t.isFullyRegistered ? 'confirmed' : 'pending';
      return status === statusFilter.toLowerCase();
    });
  }, [filter, statusFilter, processedTeams]);

  return (
    <div className="px-4">
      <div className="mb-6">
        <RosterLockNotice title={tournament?.end_date ? `Roster Lock: ${new Date(tournament.end_date).toLocaleDateString()}` : 'Roster Lock'} />
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl border border-neutral-800 p-4 md:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="grid grid-cols-3 gap-2 w-full max-w-[520px]">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`w-full px-4 py-2 rounded-xl text-sm font-bold border transition ${
                filter === 'all'
                  ? 'bg-[#FFC107] text-black border-yellow-500/30'
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              All ({teamCounts.total})
            </button>
            <button
              type="button"
              onClick={() => setFilter('solo')}
              className={`w-full px-4 py-2 rounded-xl text-sm font-bold border transition ${
                filter === 'solo'
                  ? 'bg-[#FFC107] text-black border-yellow-500/30'
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              Solo ({teamCounts.solo})
            </button>
            <button
              type="button"
              onClick={() => setFilter('team')}
              className={`w-full px-4 py-2 rounded-xl text-sm font-bold border transition ${
                filter === 'team'
                  ? 'bg-[#FFC107] text-black border-yellow-500/30'
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              Team ({teamCounts.team})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Status Filter</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111111] border border-neutral-800 text-white px-3 py-2 rounded-xl text-sm font-semibold"
            >
              <option>All</option>
              <option>Confirmed</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-[#111111] p-2 md:p-4 min-h-[340px]">
          {filteredTeams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-white/40 mb-2">No teams found.</p>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div
                key={team.id}
                className="w-full bg-[#222222] border border-neutral-800 rounded-xl p-4 mb-4 flex flex-col gap-4 lg:grid lg:grid-cols-[220px_repeat(5,minmax(0,1fr))_160px] lg:gap-4 lg:items-center hover:bg-[#242424] transition-colors"
              >
                <div className="shrink-0 flex flex-col lg:items-start">
                  <span className="text-white font-bold truncate text-sm md:text-base mb-1" title={team.name}>
                    {team.name}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded w-fit ${
                      team.isFullyRegistered
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {team.isFullyRegistered ? 'CONFIRMED' : 'PENDING'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:contents gap-4">
                  {team.slots.map((slot, idx) => (
                    <SlotCell key={idx} slot={slot} />
                  ))}
                </div>

                <div className="flex justify-center lg:justify-end shrink-0 pt-3 lg:pt-0 border-t border-white/5 lg:border-t-0">
                   <div className={`text-xs font-montserrat px-3 py-1.5 rounded-lg border ${team.isFullyRegistered ? 'border-green-500/30 text-green-400' : 'border-white/10 text-white/40'}`}>
                      {team.isFullyRegistered ? 'Ready for Match' : 'Incomplete Roster'}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
