import React, { useRef } from 'react';
import { Header, Footer } from "@/Components";
import { Toaster } from 'react-hot-toast';
import MLLoginVoting from './MLLoginVoting';

export default function VotingSignIn() {
    const mlLoginRef = useRef(null);

    const handleLoginClick = () => {
        if (mlLoginRef.current) {
            mlLoginRef.current.triggerLogin();
        }
    };

    return (
        <>
            <div 
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    zIndex: 9999,
                    pointerEvents: 'none'
                }}
            >
                <Toaster 
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#333',
                            color: '#fff',
                            border: '1px solid #F3C718',
                            padding: '16px',
                            borderRadius: '8px',
                            marginTop: '80px',
                            pointerEvents: 'auto'
                        },
                    }}
                />
            </div>

            <div className="min-h-screen bg-black text-white">
                <div className="relative z-10">
                    <Header />
                </div>

                <main 
                    className="relative z-0 min-h-screen py-8 md:py-16"
                    style={{
                        backgroundImage: "url('/images/MCC/VoteBG.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed"
                    }}
                >
                    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-6xl font-bold font-space mb-4">
                                VOTING SIGN IN
                            </h1>
                            <p className="text-lg md:text-xl font-poppins">
                                Sign in with your Mobile Legends account to vote
                            </p>
                        </div>

                        <button
                            onClick={handleLoginClick}
                            className="bg-[#F3C718] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#F3C718]/90 transition-all duration-300 transform hover:scale-105"
                        >
                            Sign in with Mobile Legends
                        </button>

                        <MLLoginVoting ref={mlLoginRef} />
                    </div>
                </main>

                <div className="relative z-10">
                    <Footer />
                </div>
            </div>
        </>
    );
}
