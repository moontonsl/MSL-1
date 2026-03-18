import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";

export default function Registration({ inviteTeamId }) {
  const [activeTab, setActiveTab] = useState('create');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'join' && !teamCode) {
        setError('Please enter the team code.');
        setIsLoading(false);
        return;
      }

      const endpoint = activeTab === 'join' ? '/join-by-code' : '/validate-credentials';
      const payload = {
        username: username,
        password: password,
        invite_team_id: inviteTeamId,
      };

      if (activeTab === 'join') {
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

          if (activeTab === 'join') {
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
        className="relative min-h-[calc(100vh-160px)] py-8 md:py-12"
        style={{
          backgroundImage: "url('/images/Campus Tournament/MainBG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative max-w-md mx-auto px-4 font-['Montserrat']">
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

          <div className="bg-neutral-900/70 rounded-xl border border-white/10 shadow-xl backdrop-blur p-5 md:p-6">
            <div className="text-center text-white font-bold tracking-tight text-[20px] md:text-[24px] lg:text-[30px] uppercase rounded-md py-2 mb-3">
              Registration
            </div>

            <div className="flex bg-white/10 p-1 mb-6 rounded-lg">
              <button
                type="button"
                onClick={() => { setActiveTab('create'); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'create' ? 'bg-[#F2C21A] text-black shadow' : 'text-white/70 hover:text-white'}`}
              >
                Create Team
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('join'); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'join' ? 'bg-[#F2C21A] text-black shadow' : 'text-white/70 hover:text-white'}`}
              >
                Join Team
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
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
                  className="w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60"
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
                  className="w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {activeTab === 'join' && (
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
                  className="w-full md:w-auto px-10 py-2.5 rounded-full bg-[#F2C21A] hover:bg-[#d9ae17] text-black font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Processing...' : (activeTab === 'create' ? 'Continue' : 'Join Team')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}


