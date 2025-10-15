import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout.jsx';

const MCCS2Home = () => {
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(null);

  useLayoutEffect(() => {
    const updateScale = () => {
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const s = Math.min(1, viewportWidth / 1920);
      setScale(s);
      if (containerRef.current) {
        setScaledHeight(containerRef.current.scrollHeight * s);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, []);
  const NU_LOGO = '/images/MCC S2/NU logo.png';
  const topTeams = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: 'NU BULLDOGS' }));
  const standingsRows = Array.from({ length: 8 }, (_, i) => ({
    rank: i + 1,
    team: 'NU BULLDOGS',
    match: '0-0',
    games: '0-0',
    points: '00',
  }));
  const KNOCKOUT_BG = '/images/MCC S2/Knockout BG.png';
  const supportsZoom = typeof document !== 'undefined' && document.documentElement && 'zoom' in document.documentElement.style;

  const TeamPanel = ({ backgroundClass, teamName }) => (
    <div className="flex-1 self-stretch p-2.5 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      <div className={`self-stretch rounded-[10px] outline outline-[0.85px] outline-offset-[-0.85px] flex flex-col justify-start items-start gap-2 overflow-hidden ${backgroundClass}`}>
        <div className="self-stretch p-2.5 flex flex-col justify-start items-start gap-2 overflow-hidden">
          <div className="self-stretch h-28 p-2 inline-flex justify-center items-center gap-2 overflow-hidden">
            <img className="w-24 h-28 object-contain" src={NU_LOGO} alt={teamName} />
          </div>
          <div className="self-stretch p-2 rounded-[10px] inline-flex justify-center items-center gap-2 overflow-hidden">
            <div className="text-center justify-start text-white text-base font-bold font-montserrat leading-tight">{teamName}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const ScorePanel = () => (
    <div className="flex-1 h-48 p-2.5 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
      <div className="self-stretch p-2.5 flex flex-col justify-center items-center gap-2.5 overflow-hidden">
        <div className="text-center justify-start text-white text-4xl font-bold font-montserrat leading-[56px]">0 : 0</div>
      </div>
      <div className="self-stretch p-2.5 bg-yellow-400 rounded-[10px] flex flex-col justify-center items-center gap-2.5 overflow-hidden">
        <div className="text-center justify-start text-white text-xl font-bold font-montserrat leading-7">4:00 PM</div>
      </div>
    </div>
  );

  const MatchCard = () => (
    <div
      className="self-stretch p-2.5 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-yellow-400 inline-flex justify-start items-start gap-2.5 overflow-visible"
      style={{
        backgroundImage: `url('${KNOCKOUT_BG}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <TeamPanel backgroundClass="bg-blue-900" teamName="NU BULLDOGS" />
      <ScorePanel />
      <TeamPanel backgroundClass="bg-red-800" teamName="NU BULLDOGS" />
    </div>
  );

  return (
    <MainLayout>
      <div className="w-full overflow-x-hidden bg-black" style={{ minHeight: scaledHeight ? `${Math.ceil(scaledHeight)}px` : undefined }}>
        <div style={{ width: '100vw', margin: '0 auto', overflow: 'hidden' }}>
          <div style={supportsZoom ? { zoom: scale, width: '1920px', position: 'relative', left: '50%', transform: 'translateX(-50%)', transformOrigin: 'top left' } : { transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top left', position: 'relative', left: '50%', width: '1920px', willChange: 'transform' }}>
            <div
              ref={containerRef}
              className="w-[1920px] bg-Background-Default-Default inline-flex flex-col justify-center items-center overflow-visible font-montserrat relative"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('/images/MCC S2/Main BG.png')",
                backgroundRepeat: 'no-repeat, repeat-y',
                backgroundPosition: 'top center, top center',
                backgroundSize: 'cover, 1920px auto',
              }}
            >

        {/* Main Content skeleton based on provided figma-to-code */}
        <div className="min-h-[6500px] flex flex-col justify-start items-center gap-1 overflow-visible pb-24">
          {/* Hero and intro block */}
          <div className="h-[3250px] xl:h-[2800px] flex flex-col justify-start items-center overflow-hidden">
            <div className="w-[1920px] h-[3250px] xl:h-[2800px] relative">
              {/* Season chip moved under subtitle */}









              {/* Background hero image */}
              <div className="w-[1920px] left-0 top-0 absolute inline-flex flex-col justify-start items-center gap-2.5">
                <img className="self-stretch h-[1011px]" src="/images/MCC S2/Top.png" alt="Hero" />
              </div>



              {/* Four buttons - Desktop row (original) */}
              <div className="w-[1920px] left-0 top-[1720px] absolute hidden xl:flex justify-center items-center gap-10 z-20">
                <div className="w-[420px] h-[180px] flex items-center justify-center">
                  <img
                    className="w-full h-full object-contain select-none"
                    src="/images/MCC S2/Registration Button.png"
                    alt="Registration"
                  />
                </div>
                <div className="w-[420px] h-[180px] flex items-center justify-center">
                  <img
                    className="w-full h-full object-contain select-none"
                    src="/images/MCC S2/Rules Button.png"
                    alt="Rules"
                  />
                </div>
                <div className="w-[420px] h-[200px] flex items-center justify-center">
                  <a href="/MCC/calendar" aria-label="Calendar" className="block w-full h-full">
                    <img
                      className="w-full h-full object-contain select-none cursor-pointer"
                      src="/images/MCC S2/Calendar Button.png"
                      alt="Calendar"
                    />
                  </a>
                </div>
                <div className="w-[420px] h-[180px] flex items-center justify-center">
                  <img
                    className="w-full h-full object-contain select-none"
                    src="/images/MCC S2/Favourites Button.png"
                    alt="Favourites"
                  />
                </div>
              </div>

              {/* Four buttons - Mobile grid (large 2x2) */}
              <div className="w-[1920px] left-0 top-[1720px] absolute grid grid-cols-2 gap-4 place-items-center xl:hidden z-20">
                {/* Row 1: Rules | Calendar */}
                <div className="w-[820px] h-[320px] flex items-center justify-center transform translate-x-10">
                  <img className="w-full h-full object-contain select-none" src="/images/MCC S2/Rules Button.png" alt="Rules" />
                </div>
                <div className="w-[820px] h-[320px] flex items-center justify-center transform -translate-x-10">
                  <a href="/MCC/calendar" aria-label="Calendar" className="block w-full h-full">
                    <img className="w-full h-full object-contain select-none cursor-pointer" src="/images/MCC S2/Calendar Button.png" alt="Calendar" />
                  </a>
                </div>
                {/* Row 2: Registration | Favourites */}
                <div className="w-[820px] h-[320px] flex items-center justify-center transform translate-x-10">
                  <img className="w-full h-full object-contain select-none" src="/images/MCC S2/Registration Button.png" alt="Registration" />
                </div>
                <div className="w-[820px] h-[320px] flex items-center justify-center transform -translate-x-10">
                  <img className="w-full h-full object-contain select-none" src="/images/MCC S2/Favourites Button.png" alt="Favourites" />
                </div>
              </div>

              {/* MCC logo (separate so title position remains unchanged) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[1120px] z-20 inline-flex items-center justify-center">
                <img className="w-[260px] h-auto" src="/images/MCC S2/MCCLOGO.png" alt="MCC Logo" />
              </div>
              {/* Centered title block (original position) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[1400px] z-20 inline-flex flex-col items-center justify-center">
                <img
                  className="w-[1180px] h-auto"
                  src="/images/MCC S2/Pamantasang lakas MSL COLLEGIATE CUP S2.png"
                  alt="Pamantasang Lakas Title"
                />
                <div className="mt-2 text-white text-5xl font-bold font-montserrat tracking-wider">MSL COLLEGIATE CUP</div>
                <div className="mt-3 relative">
                  <button
                    type="button"
                    onClick={() => setIsSeasonOpen((v) => !v)}
                    className="w-[360px] h-[64px] px-8 bg-black rounded-[16px] outline outline-2 outline-offset-[-2px] outline-yellow-400 flex items-center justify-center gap-4 shadow-[0_0_8px_-3px_rgba(243,199,24,0.6)]"
                  >
                    <div className="text-yellow-400 text-3xl font-bold font-montserrat tracking-wider">SEASON 2</div>
                    <svg className={`w-6 h-6 text-yellow-400 transition-transform ${isSeasonOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {isSeasonOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[280px] bg-black/90 rounded-[12px] outline outline-1 outline-yellow-400 shadow-[0_0_10px_rgba(243,199,24,0.35)] z-30">
                      <button
                        type="button"
                        onClick={() => setIsSeasonOpen(false)}
                        className="w-full px-4 py-3 text-yellow-300 text-xl font-bold font-montserrat tracking-wide hover:bg-yellow-400/10 rounded-[12px]"
                      >
                        SEASON 1
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Left and Right hero images */}
              <img
                className="absolute left-0 top-[780px] w-[650px] h-auto z-10 select-none pointer-events-none"
                src="/images/MCC S2/Lou yi.png"
                alt="Lou Yi"
              />
              <img
                className="absolute right-0 top-[780px] w-[740px] h-auto z-10 select-none pointer-events-none"
                src="/images/MCC S2/Zhu Xin.png"
                alt="Zhu Xin"
              />

              {/* About section (mobile pushed lower for buttons grid) */}
              <div className="w-[1920px] min-h-[720px] p-2.5 left-0 absolute top-[2480px] xl:top-[2080px] inline-flex justify-center items-center overflow-visible">
                <div className="flex-1 self-stretch p-2.5 inline-flex flex-col justify-start items-start gap-2.5 overflow-visible">
                  <div className="self-stretch p-2.5 flex flex-col justify-start items-center gap-2.5 overflow-visible">
                    <div className="text-center justify-start text-white text-4xl font-bold font-['Montserrat'] leading-[56px]">MLBB COLLEGIATE CUP</div>
                  </div>
                  <div className="self-stretch p-2.5 flex flex-col justify-start items-center gap-2.5 overflow-visible">
                    <div className="w-[1364px] justify-start text-white text-3xl font-medium font-['Montserrat']">MSL Collegiate Cup (MCC) is the trademark collegiate tournament of Moonton Student Leaders Philippines (MSL Philippines). Established in 2021 through its predecessor —  the School Rivals — and recently rebranded as MCC in 2023, it stands tall and proud as the premier and one of the biggest nationwide collegiate tournaments that shares the opportunity for a higher scale of competitive gaming.<br/><br/>Set up with impeccable standards and state-of-the-art tournament system,  MCC shines through as it has direct developer support from Moonton. With its pro-level production, it is a league beaming alongside the esteemed MLBB Professional League (MPL) and MLBB Developmental League (MDL). With its reach expanding from Luzon, NCR, Visayas, and Mindanao regions, MCC is committed to giving collegiate teams across the country a greater avenue to hone and showcase their talents and potentials as student gamers. It also promotes camaraderie and enthusiasm among the players that transcends beyond the competitive gaming horizon. In pursuit of inclusivity especially at the grassroots level, MCC continues to strive for greater, stronger, and better gaming opportunities for every collegiate team to join and enjoy.<br/></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TOP 8 TEAMS - enlarge on mobile to fill width while keeping style */}
          <div className="w-[1720px] xl:w-[1292px] p-2.5 inline-flex flex-col justify-start items-center gap-2.5 overflow-hidden">
            {/* Header */}
            <div className="w-[1500px] xl:w-[1082px] p-2.5 bg-black rounded-[10px] outline outline-2 outline-offset-[-2px] outline-yellow-400 inline-flex justify-center items-center gap-2.5 overflow-hidden">
              <div className="w-72 text-center justify-start text-white text-4xl font-bold font-montserrat leading-[56px]">TOP 8 TEAMS</div>
            </div>

            {/* Mobile grid: larger columns to fill width */}
            <div
              className="w-[1500px] grid gap-4 justify-between overflow-hidden xl:hidden"
              style={{ gridTemplateColumns: 'repeat(4, 360px)' }}
            >
              {topTeams.map((team) => (
                <div key={team.id} className="p-2 inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
                  <div className="w-full h-96 bg-black rounded-[10px] outline outline-[0.85px] outline-offset-[-0.85px] outline-yellow-400 flex flex-col justify-start items-start gap-2 overflow-hidden">
                    <div className="self-stretch flex-1 p-2.5 flex flex-col justify-start items-start gap-2 overflow-hidden">
                      <div className="self-stretch h-64 p-2 inline-flex justify-center items-center gap-2 overflow-hidden">
                        <img className="w-44 h-56" src={NU_LOGO} alt={team.name} />
                      </div>
                      <div className="self-stretch flex-1 py-3 px-4 bg-yellow-400 rounded-[10px] inline-flex justify-center items-center overflow-hidden">
                        <div className="text-center justify-start text-black text-[26px] xl:text-2xl font-bold font-montserrat leading-9">{team.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop grid unchanged (exact original styling) */}
            <div className="w-[1082px] hidden xl:grid grid-cols-4 gap-4 overflow-hidden">
              {topTeams.map((team) => (
                <div key={team.id} className="p-2 inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
                  <div className="self-stretch h-72 bg-black rounded-[10px] outline outline-[0.85px] outline-offset-[-0.85px] outline-yellow-400 flex flex-col justify-start items-start gap-2 overflow-hidden">
                    <div className="self-stretch flex-1 p-2.5 flex flex-col justify-start items-start gap-2 overflow-hidden">
                      <div className="self-stretch h-52 p-2 inline-flex justify-center items-center gap-2 overflow-hidden">
                        <img className="w-32 h-40" src={NU_LOGO} alt={team.name} />
                      </div>
                      <div className="self-stretch flex-1 p-2 bg-yellow-400 rounded-[10px] inline-flex justify-center items-center gap-2 overflow-hidden">
                        <div className="text-center justify-start text-black text-2xl font-bold font-montserrat leading-9">{team.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STANDINGS - Enlarged on mobile to better fill width */}
          <div className="w-[1720px] xl:w-[1292px] mt-12 p-2.5 inline-flex flex-col justify-start items-center gap-5 overflow-hidden">
          <div className="w-[1500px] xl:w-[1082px] h-[80px] min-h-[80px] max-h-[80px] p-2.5 bg-black rounded-[10px] outline outline-2 outline-offset-[-2px] outline-yellow-400 inline-flex justify-center items-center gap-2.5 overflow-hidden">
              <div className="w-72 text-center justify-start text-white text-4xl font-bold font-montserrat leading-[56px] whitespace-nowrap">STANDINGS</div>
            </div>
            <div className="h-[815px] p-2.5 bg-neutral-950 rounded-lg flex flex-col justify-start items-start gap-2">
              {/* Table header */}
              <div className="w-[1500px] xl:w-[1014.06px] h-20 bg-yellow-400 rounded-xl inline-flex justify-start items-start overflow-hidden">
                <div className="flex-1 self-stretch p-2 flex justify-start items-start overflow-hidden">
                  <div className="w-48 xl:w-40 self-stretch p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                    <div className="text-center justify-start text-black text-2xl font-bold font-montserrat leading-loose">RANK</div>
                  </div>
                  <div className="w-64 xl:w-44 self-stretch p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                    <div className="text-center justify-start text-black text-2xl font-bold font-montserrat leading-loose">TEAM</div>
                  </div>
                  <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                    <div className="text-center justify-start text-black text-2xl font-bold font-montserrat leading-loose">MATCH W-L</div>
                  </div>
                  <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                    <div className="text-center justify-start text-black text-2xl font-bold font-montserrat leading-loose">GAMES W-L</div>
                  </div>
                  <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                    <div className="text-center justify-start text-black text-2xl font-bold font-montserrat leading-loose">POINTS</div>
                  </div>
                </div>
              </div>
              {/* Data rows */}
              {standingsRows.map((row, idx) => (
                <div key={idx} className={`w-[1500px] xl:w-[1014.06px] h-20 ${idx % 2 === 0 ? 'bg-black' : 'bg-neutral-900'} inline-flex justify-start items-start overflow-hidden`}>
                  <div className="flex-1 self-stretch p-2 flex justify-start items-start overflow-hidden">
                    <div className="w-48 xl:w-40 self-stretch p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                      <div className="text-center justify-start text-neutral-100 text-2xl font-bold font-montserrat leading-loose">{row.rank}</div>
                    </div>
                    <div className="w-64 xl:w-44 self-stretch p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden relative">
                      <img
                        src={NU_LOGO}
                        alt="Team logo"
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-25 blur-[0.2px] pointer-events-none select-none"
                      />
                      <div className="relative z-10 text-center justify-start text-neutral-100 text-xl font-bold font-montserrat leading-relaxed">{row.team}</div>
                    </div>
                    <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                      <div className="text-center justify-start text-neutral-100 text-2xl font-bold font-montserrat leading-loose">{row.match}</div>
                    </div>
                    <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                      <div className="text-center justify-start text-neutral-100 text-2xl font-bold font-montserrat leading-loose">{row.games}</div>
                    </div>
                    <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                      <div className="text-center justify-start text-neutral-100 text-2xl font-bold font-montserrat leading-loose">{row.points}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KNOCKOUT STAGE DAY 1 */}
          <div className="w-[1462px] p-2.5 inline-flex flex-col justify-start items-center gap-12 overflow-visible">
            <div className="w-[1030px] h-[80px] min-h-[80px] max-h-[80px] p-2.5 bg-black rounded-[10px] outline outline-2 outline-offset-[-2px] outline-yellow-400 inline-flex justify-center items-center gap-2.5 overflow-hidden">
              <div className="text-center justify-start text-white text-4xl font-bold font-montserrat leading-[56px] whitespace-nowrap">KNOCKOUT STAGE DAY 1 | DATE</div>
            </div>
            {/* Desktop layout mirrors mobile: 2 | 2 | 1 (centered) */}
            <div className="self-stretch rounded-lg hidden xl:flex flex-col gap-2.5">
              <div className="w-[1130px] mx-auto flex gap-2.5 justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
              <div className="w-[1130px] mx-auto flex gap-2.5 justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
              <div className="w-[1130px] mx-auto flex justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
            </div>
            {/* Mobile layout: 2 | 2 | 1 (centered) */}
            <div className="self-stretch flex xl:hidden flex-col gap-2.5">
              <div className="w-[1130px] mx-auto flex gap-2.5 justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
              <div className="w-[1130px] mx-auto flex gap-2.5 justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
              <div className="w-[1130px] mx-auto flex justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
            </div>
          </div>

          {/* KNOCKOUT STAGE DAY 2 */}
          <div className="w-[1462px] p-2.5 inline-flex flex-col justify-start items-center gap-12 overflow-visible">
            <div className="w-[1030px] h-[80px] min-h-[80px] max-h-[80px] p-2.5 bg-black rounded-[10px] outline outline-2 outline-offset-[-2px] outline-yellow-400 inline-flex justify-center items-center gap-2.5 overflow-hidden">
              <div className="text-center justify-start text-white text-4xl font-bold font-montserrat leading-[56px] whitespace-nowrap">KNOCKOUT STAGE DAY 2 | DATE</div>
            </div>
            {/* Desktop layout mirrors mobile: 2 | 2 | 1 (centered) */}
            <div className="self-stretch rounded-lg hidden xl:flex flex-col gap-2.5">
              <div className="w-[1130px] mx-auto flex gap-2.5 justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
              <div className="w-[1130px] mx-auto flex gap-2.5 justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
              <div className="w-[1130px] mx-auto flex justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
            </div>
            {/* Mobile layout: 2 | 2 | 1 (centered) */}
            <div className="self-stretch flex xl:hidden flex-col gap-2.5">
              <div className="w-[1130px] mx-auto flex gap-2.5 justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
              <div className="w-[1130px] mx-auto flex gap-2.5 justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
              <div className="w-[1130px] mx-auto flex justify-center">
                <div className="w-[560px] overflow-visible"><MatchCard /></div>
              </div>
            </div>
          </div>

          {/* PLAYOFFS BRACKET */}
          <div className="w-[1462px] p-2.5 flex flex-col justify-start items-center gap-12 overflow-hidden">
            <img className="w-[1319px] h-[755px] object-contain" src="/images/MCC S2/PLayoffs bracket.png" alt="Playoffs Bracket" />
          </div>

          {/* Bottom thumbnails */}
          <div className="p-2.5 inline-flex justify-center items-start gap-5 overflow-hidden">
            {[0,1,2].map((i) => (
              <div key={i} className="p-2.5 flex justify-start items-start gap-2.5 overflow-hidden">
                <img className="w-96 h-52 object-cover" src="/images/MCC S2/BOTTOM.png" alt={`Bottom ${i+1}`} />
              </div>
            ))}
          </div>

          {/* TODO: Bracket and Thumbnails */}
            </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MCCS2Home;