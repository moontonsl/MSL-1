import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsWatchFest.jsx";

export default function FF25LandingPage() {
  return (
    <AuthenticatedLayout>
      <Head title="FF25 – Festival of Freedom" />
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-10 sm:pt-20 font-['Montserrat']">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="font-bold mb-1 text-[22px] sm:text-[30px] lg:text-[36px] text-[#F2C21A] leading-tight">
            FF25 Landing Page
          </h2>
          <h3 className="text-white text-[16px] sm:text-[22px] lg:text-[26px] font-extrabold leading-relaxed">
            Welcome to the Festival of Freedom 2025
          </h3>
        </div>

        {/* Landing Content */}
        <div className="bg-black/80 text-white rounded-2xl p-6 sm:p-10 w-full max-w-3xl shadow-lg mx-auto text-center">
          <h3 className="text-[#F2C21A] text-lg sm:text-xl font-bold">
            Experience the Ultimate Freedom Festival
          </h3>

          <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed">
            Gear up for exciting events, exclusive activities, and unforgettable experiences
            this FF25 season. Stay tuned for announcements and prepare for something BIG!
          </p>

          {/* Learn More */}
          <button className="mt-6 font-bold py-3 px-6 rounded-xl bg-[#F2C21A] hover:bg-[#ddb518] text-black transition-colors text-sm sm:text-base">
            Learn More
          </button>

          {/* Register Here Button */}
          <Link
            href="/FF25Attendance"
            className="mt-4 block font-bold py-3 px-6 rounded-xl bg-[#F2C21A] hover:bg-[#ddb518] text-black transition-colors text-sm sm:text-base"
          >
            Register Here
          </Link>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
