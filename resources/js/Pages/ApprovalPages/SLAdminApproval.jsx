import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutPrograms.jsx";
import { Eye, Check, XCircle, FilePlus  } from "lucide-react";
import AccountModificationModal from "./AccountModificationModal.jsx";

export default function SLAdminApproval() {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const mobileWindowSize = 4;

  useEffect(() => {
    const dummyData = Array.from({ length: 55 }, (_, i) => ({
      id: i + 1,
      username: `msl username${i + 1}`,
      request: "Name Correction",
      wrong: `Wrong Name ${i + 1}`,
      correct: `Correct Name ${i + 1}`,
      status: i % 2 === 0 ? "Pending" : "Modified",
    }));
    setRequests(dummyData);
  }, []);

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = requests.slice(startIndex, startIndex + itemsPerPage);
  const [activeRequest, setActiveRequest] = useState(null);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const computeMobilePages = () => {
    if (totalPages <= mobileWindowSize)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const maxStart = totalPages - mobileWindowSize + 1;
    const start = Math.min(Math.max(1, currentPage), maxStart);
    const pages = [];
    for (let p = start; p < start + mobileWindowSize; p++) pages.push(p);
    return pages;
  };

  const mobilePages = computeMobilePages();

  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <Head title="SL Admin Approval" />
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center p-4 font-['Montserrat']">
          <div className="w-full max-w-xs sm:max-w-5xl lg:max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/20 shadow-2xl">

              {/* Header with Title and Create Button */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="font-bold text-white text-center text-[20px] sm:text-[28px] lg:text-[40px]">
                  SL Admin Approval
                </h1>
                <button onClick={() => setShowModal(true)}
                  className="mt-3 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-semibold">
                  <FilePlus className="w-4 h-4" /> Create Modification
                </button>
              </div>

              {/* Table View (Desktop) */}
              <div className="hidden sm:block">
                <table className="w-full min-w-full border-collapse">
                  <thead>
                    <tr className="font-bold text-gray-200 text-[20px] sm:text-[24px] lg:text-[30px]">
                      <th className="px-4 py-3 text-left border-b border-white/20">Username</th>
                      <th className="px-4 py-3 text-left border-b border-white/20">Request</th>
                      <th className="px-4 py-3 text-left border-b border-white/20">Wrong</th>
                      <th className="px-4 py-3 text-left border-b border-white/20">Correct</th>
                      <th className="px-4 py-3 text-center border-b border-white/20">Proof</th>
                      <th className="px-4 py-3 text-center border-b border-white/20">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((req, index) => (
                      <tr
                        key={req.id}
                        className={`font-medium text-gray-200 text-[14px] sm:text-[16px] ${
                          index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                        } hover:bg-white/10 transition`}
                      >
                        <td className="px-4 py-3">{req.username}</td>
                        <td className="px-4 py-3">{req.request}</td>
                        <td className="px-4 py-3 text-red-400">{req.wrong}</td>
                        <td className="px-4 py-3 text-green-400">{req.correct}</td>
                        <td className="px-4 py-3 text-center">
                          <button className="flex items-center mx-auto px-3 py-1 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition">
                            <Eye className="w-4 h-4 mr-1" /> View
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-lg text-white font-semibold ${
                              req.status === "Pending"
                                ? "bg-yellow-500/80"
                                : "bg-green-500/80"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Retain Old Mobile Version */}
              <div className="sm:hidden space-y-2">
                {currentItems.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white/5 rounded-lg p-2 text-gray-200 shadow text-xs w-[90%] mx-auto"
                  >
                    <div className="grid grid-cols-[70%_30%] items-center">
                      <p className="font-semibold text-center">{req.username}</p>
                      <div className="flex justify-center">
                        <button
                          onClick={() => setActiveRequest(req)}
                          className="inline-flex items-center justify-center gap-1 px-2 py-1 bg-blue-500/80 text-white rounded-md hover:bg-blue-600 transition text-xs w-20"
                        >
                          <Check className="w-3 h-3" /> Check
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Modal */}
              {activeRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                  <div className="relative bg-white/90 rounded-xl p-4 w-full max-w-sm text-black">
                    <button
                      onClick={() => setActiveRequest(null)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 rounded-full shadow hover:bg-red-600 transition transform hover:scale-105"
                      aria-label="Close modal"
                    >
                      <XCircle className="w-5 h-5 text-white" />
                    </button>
                    <h2 className="text-lg font-bold mb-3 text-center">Request Details</h2>
                    <p><span className="font-bold">Username:</span> {activeRequest.username}</p>
                    <p><span className="font-bold">Request:</span> {activeRequest.request}</p>
                    <p className="text-red-500"><span className="font-bold">Wrong:</span> {activeRequest.wrong}</p>
                    <p className="text-green-600"><span className="font-bold">Correct:</span> {activeRequest.correct}</p>
                    <p className="text-yellow-600"><span className="font-bold">Status:</span> {activeRequest.status}</p>
                    <button className="w-full mt-4 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      <Eye className="w-4 h-4" /> View Proof
                    </button>
                  </div>
                </div>
              )}

              {/* Pagination */}
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-500/70 text-white rounded-lg disabled:opacity-40"
                >
                  Prev
                </button>

                <div className="hidden sm:flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700/70 text-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div className="flex sm:hidden space-x-2">
                  {mobilePages.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700/70 text-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-500/70 text-white rounded-lg disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>

      <AccountModificationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
      />
    </>
  );
}
