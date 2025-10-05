import React from "react";

export default function MechanicsModal({ onClose, onDone }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="
          bg-white text-black
          p-6 sm:p-10
          rounded-2xl shadow-xl text-left
          w-full
          max-w-full sm:max-w-3xl
          border border-gray-300
          overflow-y-scroll max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          MECHANICS
        </h2>

        <div className="text-center">
          <ol className="list-decimal list-outside pl-5 sm:pl-8 w-full space-y-4 sm:space-y-5 text-sm sm:text-lg leading-relaxed inline-block text-left">
            
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Open to **all ages**, individual or **squad (maximum of 3 members)**.
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Watch the tutorial video for the **B.A.N.G. dance steps** on the official Facebook and TikTok accounts of MSL Philippines and MLBB Community Heroes.
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Do an **MLBB Hero skin or Girl Group-inspired glam** (make-up, hair, or outfit).
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Create your own dance version (**15 seconds to 1 minute**).
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Participants must use **only the song ‘B.A.N.G.’** — the official 9th Anniversary music of MLBB. Music edits or remixes are **not allowed**.
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              **Video editing** and the application of visual effects **are allowed**.
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Videos must **not include any offensive gestures or visuals**.
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Post your video publicly on **Facebook or TikTok** using the hashtags:{" "}
              <span className="font-semibold text-yellow-600">
                #MLBBGoGirlGlamUp #MLBB9thToMeetYou #MLBB9TH #HIBIBI #MSLPhilippines #CommunityHeroes #MobileLegendsBangBang
              </span>
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              **Tag the official pages of Mobile Legends: Bang Bang** in every posting.
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Submit your entry <strong>at this form</strong>. Fill in your information required:{" "}
              <strong>Name, UID, Server, IGN, School Name/Community, Entry link.</strong>
            </li>
          </ol>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              onDone();
              onClose();
            }}
            className="px-8 sm:px-10 py-3 rounded-lg border-none bg-yellow-400 text-black font-bold cursor-pointer text-lg sm:text-xl w-72 sm:w-80"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}