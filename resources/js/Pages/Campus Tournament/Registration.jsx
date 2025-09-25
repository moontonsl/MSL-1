import React from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";

export default function Registration() {
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
            <form className="space-y-4">
              <div>
                <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1">
                  MSL Username
                </label>
                <input
                  type="text"
                  className="w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60"
                  placeholder="Enter your MSL Username"
                />
              </div>

              <div>
                <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60"
                  placeholder="Enter your password"
                />
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm border border-white/30"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}


