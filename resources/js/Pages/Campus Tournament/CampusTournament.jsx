import React, { useState } from 'react';
import MainLayout from "@/Layouts/MainLayout.jsx";

const CampusTournament = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tournaments, setTournaments] = useState([]);

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
      },
    ]);
    handleClose();
  };

  const handleDelete = (id) => {
    setTournaments((existing) => existing.filter((t) => t.id !== id));
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
                  className="w-full max-w-5xl border-2 border-white rounded-2xl text-white mx-0 md:mx-2"
                >
                  <div className="w-full h-16 md:h-20 flex items-center justify-between bg-black rounded-2xl px-4">
                    <div className="flex-1 text-center">
                      <div className="font-montserrat text-lg md:text-2xl tracking-wide">TOURNAMENT</div>
                      <div className="font-montserrat text-xs md:text-sm text-white/70">
                        {formatDate(item.startDate)} - {formatDate(item.endDate)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="ml-4 bg-[#F2C21A] text-black font-montserrat text-xs md:text-sm font-semibold rounded-lg px-3 py-1.5 shadow-[0_0_8px_-3px_rgba(242,194,26,1)]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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


