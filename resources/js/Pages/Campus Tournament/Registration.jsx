import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Registration({ inviteTeamId }) {
  const [regType, setRegType] = useState('create'); // 'create' | 'join' | 'solo'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Solo registration state
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [rolesError, setRolesError] = useState('');
  const roleTriggerRef = useRef(null);
  const roleMenuRef = useRef(null);
  /** Fixed position for portaled menu (escapes any ancestor overflow / backdrop clipping). */
  const [roleMenuPos, setRoleMenuPos] = useState(null);

  const roleOptions = [
    'Multirole',
    'Jungler',
    'Roam',
    'Gold Laner',
    'Exp Laner',
    'Mid Laner',
  ];

  const toggleRole = (role) => {
    setRolesError('');

    setSelectedRoles((prev) => {
      const isSelected = prev.includes(role);

      // 4. Clicking selected role deselects it
      if (isSelected) {
        return prev.filter((r) => r !== role);
      }

      // 1. Selecting Multirole clears all others
      if (role === 'Multirole') {
        return ['Multirole'];
      }

      // 2. Selecting a lane removes Multirole
      const withoutMultirole = prev.filter((r) => r !== 'Multirole');

      // 3. Max 3 specific lanes
      if (withoutMultirole.length >= 3) {
        setRolesError('You can select up to 3 roles.');
        return withoutMultirole;
      }

      return [...withoutMultirole, role];
    });
  };

  const soloRoleLabel = selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Select Role';

  const updateRoleMenuPosition = useCallback(() => {
    const el = roleTriggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRoleMenuPos({ top: r.bottom + 8, left: r.left, width: r.width });
  }, []);

  useLayoutEffect(() => {
    if (!isRoleOpen || regType !== 'solo') {
      setRoleMenuPos(null);
      return;
    }
    updateRoleMenuPosition();
    window.addEventListener('scroll', updateRoleMenuPosition, true);
    window.addEventListener('resize', updateRoleMenuPosition);
    return () => {
      window.removeEventListener('scroll', updateRoleMenuPosition, true);
      window.removeEventListener('resize', updateRoleMenuPosition);
    };
  }, [isRoleOpen, regType, updateRoleMenuPosition]);

  useEffect(() => {
    if (!isRoleOpen) return;
    const onPointerDown = (e) => {
      if (roleTriggerRef.current?.contains(e.target)) return;
      if (roleMenuRef.current?.contains(e.target)) return;
      setIsRoleOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isRoleOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (regType === 'solo') {
        // Frontend-only flow for now (layout work). Enforce role selection logic + show subtle errors.
        if (!username || !password) {
          setError('Please enter your username and password.');
          return;
        }

        if (selectedRoles.length === 0) {
          setRolesError('Please select at least 1 role.');
          return;
        }

        // Placeholder: in real impl, post to a solo registration endpoint.
        // For layout work, just keep the user on this page.
        setError('Solo registration is a layout-only flow right now (no backend wired).');
        return;
      }

      if (regType === 'join' && !teamCode) {
        setError('Please enter the team code.');
        setIsLoading(false);
        return;
      }

      const endpoint = regType === 'join' ? '/join-by-code' : '/validate-credentials';
      const payload = {
        username: username,
        password: password,
        invite_team_id: inviteTeamId,
      };

      if (regType === 'join') {
        payload.team_code = teamCode;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const userData = await response.json();

        if (userData.user) {
          if (userData.user.state !== 'Verified') {
            setError("Only verified users can participate in campus tournaments. Please complete your verification first.");
            return;
          }

          if (regType === 'join') {
            router.visit('/Tournament/CampusTournamentTeam');
            return;
          }

          const teamCheckResponse = await fetch(`/team-check?user_id=${userData.user.id}`);
          if (teamCheckResponse.ok) {
            const teamData = await teamCheckResponse.json();
            if (teamData.isInTeam) {
              router.visit('/Tournament/CampusTournamentTeam');
              return;
            }
          }

          const tournamentResponse = await fetch('/approved-tournaments');
          const tournaments = await tournamentResponse.json();

          const hasApprovedTournament = tournaments.some(t =>
            t.school_name === userData.user.university
          );

          if (hasApprovedTournament) {
            sessionStorage.setItem('campusTournamentCaptain', JSON.stringify(userData.user));
            router.visit('/Tournament/CampusTournamentReg');
          } else {
            setError("There's no available tournament in your campus");
          }
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        if (response.status === 419) {
          setError('Session expired. Please refresh the page and try again.');
        } else {
          try {
            const errorData = await response.json();
            setError(errorData.message || 'Login failed. Please check your credentials.');
          } catch (e) {
            setError('Login failed. Please check your credentials.');
          }
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Head title="Campus Tournament" />
      <section
        className="relative min-h-[calc(100vh-160px)] py-8 md:py-12 overflow-visible"
        style={{
          backgroundImage: "url('/images/Campus Tournament/MainBG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative max-w-md mx-auto px-4 font-['Montserrat'] overflow-visible">
          <div className="flex flex-col items-center gap-2 md:gap-3 mb-6 md:mb-8">
            <img
              src="/images/About Page/SL Logo.png"
              alt="SL Logo"
              className="w-16 h-16 md:w-20 md:h-20 object-contain select-none pointer-events-none"
            />
            <h1 className="text-white font-bold tracking-tight text-[24px] md:text-[32px] lg:text-[40px] md:whitespace-nowrap">
              CAMPUS TOURNAMENT
            </h1>
            <p className="text-white/80 text-[12px] md:text-[14px] text-center">
              Log in using your MSL credentials to continue.
            </p>
          </div>

          {/* bg + rounded on same box; no overflow clipping. Blur is a behind-layer only. */}
          <div className="relative rounded-2xl border border-white/10 shadow-xl overflow-visible">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl bg-neutral-900/70 backdrop-blur"
              aria-hidden
            />
            <div className="relative z-0 p-5 md:p-6 overflow-visible min-h-0">
            <div className="text-center text-white font-bold tracking-tight text-[20px] md:text-[24px] lg:text-[30px] uppercase rounded-md py-2 mb-3">
              Registration
            </div>

            <div className="flex bg-white/10 p-1 mb-6 rounded-lg gap-1 sm:gap-2 md:gap-3 overflow-visible shrink-0">
              <button
                type="button"
                onClick={() => { setRegType('create'); setError(''); setRolesError(''); setIsRoleOpen(false); }}
                className={`flex-1 py-2 text-[13px] sm:text-sm font-semibold rounded-md transition-colors ${regType === 'create' ? 'bg-[#FFC107] text-black font-bold shadow' : 'text-white/70 hover:text-white bg-[#1A1A1A]'}`}
              >
                Create Team
              </button>
              <button
                type="button"
                onClick={() => { setRegType('join'); setError(''); setRolesError(''); setIsRoleOpen(false); }}
                className={`flex-1 py-2 text-[13px] sm:text-sm font-semibold rounded-md transition-colors ${regType === 'join' ? 'bg-[#FFC107] text-black font-bold shadow' : 'text-white/70 hover:text-white bg-[#1A1A1A]'}`}
              >
                Join Team
              </button>
              <button
                type="button"
                onClick={() => { setRegType('solo'); setError(''); setTeamCode(''); setRolesError(''); }}
                className={`flex-1 py-2 text-[13px] sm:text-sm font-semibold rounded-md transition-colors ${regType === 'solo' ? 'bg-[#FFC107] text-black font-bold shadow' : 'text-white/70 hover:text-white bg-[#1A1A1A]'}`}
              >
                Solo
              </button>
            </div>

            <form className="space-y-4 overflow-visible min-h-0" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1">
                  MSL Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={
                    regType === 'solo'
                      ? "w-full rounded-full bg-transparent border border-neutral-700 text-white placeholder:text-gray-500 px-4 py-3 focus:outline-none focus:border-yellow-400/60"
                      : "w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60"
                  }
                  placeholder="Enter your MSL Username"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={
                    regType === 'solo'
                      ? "w-full rounded-full bg-transparent border border-neutral-700 text-white placeholder:text-gray-500 px-4 py-3 focus:outline-none focus:border-yellow-400/60"
                      : "w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60"
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>

              {regType === 'solo' && (
                <div className="relative overflow-visible z-50">
                  <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1">
                    Role
                  </label>

                  <div className="relative z-50 w-full" ref={roleTriggerRef}>
                    <button
                      type="button"
                      onClick={() => setIsRoleOpen((v) => !v)}
                      className={`w-full rounded-full border px-4 py-3 flex items-center justify-between transition-colors ${
                        rolesError
                          ? 'border-red-400/70'
                          : selectedRoles.length > 0
                            ? 'border-yellow-400/60'
                            : 'border-neutral-700'
                      } bg-transparent text-white`}
                      aria-haspopup="listbox"
                      aria-expanded={isRoleOpen}
                    >
                      <span className={`text-sm ${selectedRoles.length > 0 ? 'text-white' : 'text-gray-500'}`}>
                        {soloRoleLabel}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {isRoleOpen &&
                    roleMenuPos &&
                    typeof document !== 'undefined' &&
                    createPortal(
                      <div
                        ref={roleMenuRef}
                        role="listbox"
                        style={{
                          position: 'fixed',
                          top: roleMenuPos.top,
                          left: roleMenuPos.left,
                          width: roleMenuPos.width,
                          zIndex: 9999,
                        }}
                        className="bg-[#1A1A1A] border border-neutral-700 rounded-xl max-h-[240px] overflow-y-auto overflow-x-visible shadow-2xl custom-scrollbar"
                      >
                        {roleOptions.map((role) => {
                          const active = selectedRoles.includes(role);
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => toggleRole(role)}
                              className={`w-full px-4 py-3 flex items-center gap-3 text-left text-[14px] sm:text-sm transition-colors ${
                                active ? 'text-[#FFC107]' : 'text-white/90'
                              } hover:bg-white/5`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                  active ? 'border-[#FFC107]' : 'border-white/40'
                                }`}
                              >
                                {active ? <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107]" /> : null}
                              </span>
                              <span className="flex-1">{role}</span>
                            </button>
                          );
                        })}
                      </div>,
                      document.body
                    )}

                  {rolesError && (
                    <div className="mt-2 text-[11px] text-red-300/90">
                      {rolesError}
                    </div>
                  )}
                  {!rolesError && (
                    <div className="mt-2 text-[11px] text-white/60">
                      {selectedRoles.includes('Multirole') ? 'Multirole selected.' : 'Select up to 3 roles.'}
                    </div>
                  )}
                </div>
              )}

              {regType === 'join' && (
                <div>
                  <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1">
                    Team Code
                  </label>
                  <input
                    type="text"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                    className="w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60 tracking-widest"
                    placeholder="Enter Team Code"
                    maxLength={6}
                    required
                  />
                </div>
              )}

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-10 py-3 rounded-full bg-[#F2C21A] hover:bg-[#d9ae17] text-black font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isLoading ? 'Processing...' : (regType === 'join' ? 'Join Team' : 'Continue')}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}


