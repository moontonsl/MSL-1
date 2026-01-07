import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";

export default function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate credentials without actually logging in
      const response = await fetch('/validate-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const userData = await response.json();

        if (userData.user) {
          // Check if user is verified
          if (userData.user.state !== 'Verified') {
            setError("Only verified users can participate in campus tournaments. Please complete your verification first.");
            return;
          }

          // Check if user is already in a team (PRIORITY CHECK)
          const teamCheckResponse = await fetch(`/team-check?user_id=${userData.user.id}`);
          if (teamCheckResponse.ok) {
            const teamData = await teamCheckResponse.json();
            if (teamData.isInTeam) {
              // User is already in a team, redirect to team view
              router.visit(`/Tournament/CampusTournamentTeam?user_id=${userData.user.id}`);
              return;
            }
          }

          // If not in a team, THEN check for available tournaments
          const tournamentResponse = await fetch('/approved-tournaments');
          const tournaments = await tournamentResponse.json();

          const hasApprovedTournament = tournaments.some(t =>
            t.school_name === userData.user.university
          );

          if (hasApprovedTournament) {
            // Store captain data in session storage and redirect
            sessionStorage.setItem('campusTournamentCaptain', JSON.stringify(userData.user));
            router.visit('/Tournament/CampusTournamentReg');
          } else {
            // No tournament available
            setError("There's no available tournament in your campus");
          }
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        // Login failed - wrong credentials
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
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

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}


