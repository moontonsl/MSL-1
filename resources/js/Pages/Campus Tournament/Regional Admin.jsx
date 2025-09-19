import React, { useMemo, useState } from 'react';
import MainLayout from "@/Layouts/MainLayout.jsx";

// Temporary mock requests until backend is wired
const generateMockRequests = () => ([
  { id: 1, schoolName: 'West Visayas State University - Main', startDate: '2025-09-18', endDate: '2025-09-25', slName: 'Dave Lima' },
  { id: 2, schoolName: 'City College of San Jose del Monte', startDate: '2025-10-02', endDate: '2025-10-09', slName: 'Zheena Duero' },
  { id: 3, schoolName: 'Iloilo Science and Technology University', startDate: '2025-10-16', endDate: '2025-10-23', slName: 'Caezar Flores' },
]);

const RegionalAdmin = () => {
  const [requests, setRequests] = useState(generateMockRequests());
  const [decisionById, setDecisionById] = useState({}); // { [id]: 'approved' | 'rejected' }
  const [viewing, setViewing] = useState(null); // request being viewed in modal

  const hasPending = useMemo(() => requests.some(r => !decisionById[r.id]), [requests, decisionById]);

  const formatDate = (value) => {
    try {
      if (!value) return '';
      const date = new Date(`${value}T00:00:00`);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return value;
    }
  };

  const handleApprove = (id) => {
    setDecisionById(prev => ({ ...prev, [id]: 'approved' }));
    // TODO: POST to backend then remove/move; for now, keep visible with status
  };

  const handleReject = (id) => {
    setDecisionById(prev => ({ ...prev, [id]: 'rejected' }));
    // TODO: POST to backend with reason
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
            <div className="mt-1 md:mt-2 text-white/90 font-montserrat text-sm md:text-base">
              Tournament Requests
            </div>

            {/* Requests Table */}
            <div className="mt-6 md:mt-10">
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
                  {requests.length === 0 && (
                    <div className="px-6 py-8 text-center text-white/60 font-montserrat">No requests.</div>
                  )}

                  {requests.map((req) => {
                    const decision = decisionById[req.id];
                    return (
                      <div key={req.id}>
                        {/* Desktop row */}
                        <div className="hidden md:grid [grid-template-columns:minmax(220px,2.2fr)_repeat(3,minmax(140px,1fr))_minmax(200px,1.3fr)] items-center gap-3 px-5 md:px-8 py-3 hover:bg-white/5 transition-colors">
                          <div className="font-montserrat text-white/90 md:truncate">{req.schoolName}</div>
                          <div className="text-center font-montserrat text-white/80">{formatDate(req.startDate)}</div>
                          <div className="text-center font-montserrat text-white/80">{formatDate(req.endDate)}</div>
                          <div className="text-center font-montserrat text-white/80">{req.slName}</div>
                          <div className="flex justify-end items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(req.id)}
                              className={`bg-[#F2C21A] text-black font-montserrat text-[11px] md:text-xs font-semibold rounded-lg px-3 py-1.5 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] ${decision === 'approved' ? '' : 'hover:brightness-110'}`}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(req.id)}
                              className={`bg-red-500 hover:bg-red-600 text-white font-montserrat text-[11px] md:text-xs font-semibold rounded-lg px-3 py-1.5 shadow-md ${decision === 'rejected' ? '' : ''}`}
                            >
                              Reject
                            </button>
                          </div>
                        </div>

                        {/* Mobile row: show School, Action buttons, and View */}
                        <div className="md:hidden grid [grid-template-columns:minmax(180px,1fr)_minmax(140px,auto)_auto] items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                          <div className="font-montserrat text-white/90">{req.schoolName}</div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(req.id)}
                              className={`bg-[#F2C21A] text-black font-montserrat text-[11px] font-semibold rounded-lg px-3 py-1.5 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] ${decision === 'approved' ? '' : 'hover:brightness-110'}`}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(req.id)}
                              className={`bg-red-500 hover:bg-red-600 text-white font-montserrat text-[11px] font-semibold rounded-lg px-3 py-1.5 shadow-md ${decision === 'rejected' ? '' : ''}`}
                            >
                              Reject
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

            {/* Empty/pending indicator */}
            {!hasPending && (
              <div className="mt-6 text-sm text-white/70 font-montserrat">No pending requests.</div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegionalAdmin;


