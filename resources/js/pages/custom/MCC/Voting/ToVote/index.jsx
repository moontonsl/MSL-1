import React, { useState } from "react";

export default function ToVotePage() {
  // Temporary state management until backend is ready
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [userStatus, setUserStatus] = useState(null); // null = not checked, 'eligible' = can vote, 'voted' = already voted
  const [ign, setIgn] = useState("");

  // Temporary function to simulate backend check
  const checkEligibility = () => {
    // This is temporary logic - replace with actual API call when backend is ready
    if (userId && serverId) {
      // Simulate API call delay
      setTimeout(() => {
        // For testing: if userId ends with '1', simulate already voted user
        if (userId.endsWith('1')) {
          setUserStatus('voted');
          setIgn('TestUser1');
        } else {
          setUserStatus('eligible');
          setIgn('TestUser2');
        }
      }, 500);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        `}
      </style>
      <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-10" style={{ 
        background: "#000",
        backgroundImage: "url('/src/pages/MCC/images/VoteBG.png')", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        fontFamily: "'Space Grotesk', sans-serif"
      }}>
        {/* Main Container - Adjust width for mobile */}
        <div className="w-full max-w-[582px] p-6 md:p-10 bg-neutral-950/30 rounded-2xl outline outline-1 outline-offset-[-0.1px] outline-[#2C2C2C] backdrop-blur-lg flex flex-col items-center mb-6 md:mb-8">
          {/* MCC Logo */}
          <img 
            src="/src/pages/MCC/images/VoteMCC.png" 
            alt="MCC Logo" 
            className="w-20 h-20 mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/MCC/VoteMCC.png";
            }}
          />
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center font-space-grotesk">MCC S2 AWARDS</h1>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center font-space-grotesk">Login your MLBB Account</h2>
          
          {/* Form Container */}
          <div className="w-full max-w-[320px] space-y-4">
            {/* User ID */}
            <div className="w-full">
              <label className="block text-white text-xl mb-2 text-center font-space-grotesk">USER ID</label>
              <input 
                type="text" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onBlur={checkEligibility}
                placeholder="e.g. 31244913 (****)"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 text-base placeholder-gray-600 font-space-grotesk"
              />
            </div>
            
            {/* Server ID */}
            <div className="w-full">
              <label className="block text-white text-xl mb-2 text-center font-space-grotesk">SERVER ID</label>
              <input 
                type="text" 
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
                onBlur={checkEligibility}
                placeholder="e.g. ********* (2032)"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 text-base placeholder-gray-600 font-space-grotesk"
              />
            </div>
            
            {/* Status Message (Account Eligible or Already Voted) */}
            {userStatus && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {userStatus === 'eligible' ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white text-base font-space-grotesk">Account Eligible</span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-white text-base font-space-grotesk">Already Voted</span>
                  </>
                )}
              </div>
            )}
            
            {/* Welcome Text */}
            {userStatus && (
              <div className="text-center mt-4 space-y-1">
                <p className="text-white text-2xl font-space-grotesk">
                  {userStatus === 'eligible' ? 'Welcome ' : 'Hello '}
                  <span className="text-[#F3C718]">&quot;{ign}&quot;</span>
                </p>
                <p className="text-white text-2xl font-space-grotesk">
                  {userStatus === 'eligible' 
                    ? <span>Click <span className="text-[#F3C718]">VOTE</span> to participate</span>
                    : 'You already voted. Thank you for participating!'
                  }
                </p>
              </div>
            )}
            
            {/* Vote Button - Always visible */}
            <div className="flex justify-center mt-6">
              <button 
                disabled={!userStatus || userStatus === 'voted'}
                className={`w-40 h-14 ${
                  userStatus === 'eligible'
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white' 
                    : 'bg-zinc-700 text-gray-400 cursor-not-allowed'
                } text-2xl rounded-2xl transition-colors font-space-grotesk`}
              >
                VOTE
              </button>
            </div>
          </div>
        </div>
        
        {/* Sponsor Logos */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
          <img 
            src="/src/pages/MCC/images/Smart.png" 
            alt="Smart Logo" 
            className="h-10 md:h-16"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/Smart.png";
            }}
          />
          <img 
            src="/src/pages/MCC/images/BPI.png" 
            alt="BPI Logo" 
            className="h-10 md:h-16"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/BPI.png";
            }}
          />
          <img 
            src="/src/pages/MCC/images/Smart.png" 
            alt="Smart Logo" 
            className="h-10 md:h-16"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/Smart.png";
            }}
          />
          <img 
            src="/src/pages/MCC/images/BPI.png" 
            alt="BPI Logo" 
            className="h-10 md:h-16"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/BPI.png";
            }}
          />
        </div>
      </div>
    </>
  );
}
