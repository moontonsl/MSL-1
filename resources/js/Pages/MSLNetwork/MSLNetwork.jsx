import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutBuffsAndSupport.jsx";
import { Helmet } from "react-helmet";
import frameImg from "./Assets/Frame437.png";
import frameImgFooter from "./Assets/Frame437Footer.png";
import { CalendarX, Users, HandCoins, Goal, Handshake, Sparkles } from "lucide-react";

const MSLNetwork = () => {
  return (
    <>
      <Head title="MSL Network" />
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <AuthenticatedLayout>
      {/* --- MSL Network Header --- */}
      <div className="w-full bg-gradient-to-r from-[#F2C21A] to-[#CA8B04] text-black font-['Montserrat']">
        <div className="grid md:grid-cols-2 gap-0 items-stretch min-h-[250px] md:min-h-[320px] lg:min-h-[380px] relative">
          
          {/* LEFT SIDE (Content) */}
          <div className="flex flex-col justify-center items-center text-center px-6 py-8 md:px-8 md:py-12 relative z-10">
            
            {/* TITLE */}
            <h1 className="font-bold mb-2 
              text-[24px] sm:text-[32px] lg:text-[40px] leading-tight">
              MSL Network
            </h1>
            
            {/* HEADER */}
            <h2 className="font-bold mb-4 
              text-[20px] sm:text-[24px] lg:text-[30px] leading-tight">
              Fueling Your Next Win
            </h2>
            
            {/* BODY */}
            <p className="font-medium mb-6 
              text-[12px] sm:text-[16px] lg:text-[16px] max-w-xl">
              The MSL Network is a nationwide community of collegiate esports
              organizations powered by MSL Philippines. Fueling your next win
              through events, collaboration, and exclusive opportunities.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-row gap-3 justify-center">
              <a
                href="#"
                className="px-4 py-2 md:px-6 md:py-3 bg-black text-[#F3C718] font-bold rounded-xl text-[12px] sm:text-[14px] lg:text-[16px]"
              >
                APPLY TO JOIN
              </a>
              <a
                href="#"
                className="px-4 py-2 md:px-6 md:py-3 border border-black text-black font-bold rounded-xl text-[12px] sm:text-[14px] lg:text-[16px]"
              >
                JOIN DISCORD SERVER →
              </a>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE (hidden on mobile) */}
          <div className="hidden md:block w-full h-full">
            <img
              src={frameImg}
              alt="MSL Network Visual"
              className="w-full h-full object-cover"
            />
          </div>

          {/* MOBILE BACKGROUND IMAGE + OVERLAY */}
          <div className="absolute inset-0 md:hidden">
            <img
              src={frameImg}
              alt="MSL Network Visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F2C21A]/90 to-[#CA8B04]/90"></div>
          </div>
        </div>
      </div>
      {/* --- MSL Network Header --- */}

      {/* Be part of the MSL Network */}
      <div className="max-w-6xl mx-auto px-3 py-3 md:py-6 font-['Montserrat']">
        <section className="bg-black/60 rounded-[16px] p-3 sm:p-6 hover:bg-black/70 transition-colors">
          
          {/* HEADER */}
          <h2 className="font-bold mb-2 text-[16px] sm:text-[24px] lg:text-[30px] text-center leading-snug max-w-xs mx-auto sm:max-w-none">
            Why Your Organization Should Be 
            <br className="sm:block hidden" />
            Part of The MSL Network
          </h2>
          <p className="font-medium mb-4 text-[11px] sm:text-[16px] text-center leading-snug max-w-full mx-auto whitespace-normal lg:whitespace-nowrap">
            Joining us unlocks growth, recognition, and exclusive opportunities for your campus org.
          </p>

          {/* GRID CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            
            {/* Event Activations */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <CalendarX className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Event Activations
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Take part in campus and nationwide tournaments that bring student communities to life.
                </p>
              </div>
            </div>

            {/* Creative Growth Space */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <Goal className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Creative Growth Space
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Access tools, assets, and mentorship to level up your org’s content and branding.
                </p>
              </div>
            </div>

            {/* Sponsorship and Rewards */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <HandCoins className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Sponsorship and Rewards
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Unlock funding, perks, and support through our Buffs & Support program.
                </p>
              </div>
            </div>

            {/* Exclusive Opportunities */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <Handshake className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Exclusive Opportunities
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Be first in line for MLBB campaigns, brand partnerships, and national esports initiatives.
                </p>
              </div>
            </div>

            {/* Visibility and Exposure */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <Users className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Visibility and Exposure
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Get featured on MSL platforms and connect with audiences across the country.
                </p>
              </div>
            </div>

            {/* Path to Pro */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Path to Pro
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Build experience, connections, and credibility that open doors to the esports industry.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Be part of the MSL Network */}


      {/* --- Apply part of The MSL Network --- */}
      <div className="bg-gradient-to-r from-[#F2C21A] to-[#CA8B04] text-black font-['Montserrat']">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center text-center md:text-left py-4 md:py-10">
          
          {/* LEFT SIDE - TEXT */}
          <div className="flex flex-col justify-center items-center md:items-start space-y-1 md:space-y-3">
            <h1 className="font-bold text-[20px] sm:text-[28px] lg:text-[36px] leading-tight">
              Apply part of The MSL Network?
            </h1>
            <p className="font-medium text-[12px] sm:text-[16px] lg:text-[16px] max-w-sm sm:max-w-lg">
              Learn how to access Buffs & Support, our exclusive sponsorship
              program for partnered orgs.
            </p>
          </div>

          {/* RIGHT SIDE - BUTTONS */}
          <div className="w-full flex justify-center items-center mt-0">
            <div className="flex flex-row flex-nowrap gap-2 sm:gap-3">
              <a
                href="#"
                className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-black text-[#F3C718] font-bold rounded-xl text-sm sm:text-base"
              >
                APPLY TO JOIN
              </a>
              <a
                href="#"
                className="px-3 py-1.5 sm:px-5 sm:py-2.5 border border-black text-black font-bold rounded-xl text-sm sm:text-base"
              >
                LEARN MORE →
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* --- Apply part of The MSL Network --- */}

      {/* --- Partnership Tiers --- */}
      <div className="max-w-sm sm:max-w-7xl mx-auto px-3 sm:px-6 py-0 space-y-6 font-['Montserrat'] mt-5">
        <section className="flex flex-col items-center rounded-[20px] p-2 sm:p-4 w-full">
          
          {/* HEADER */}
          <h2 className="font-bold mb-2 sm:mb-3 text-[14px] sm:text-[24px] lg:text-[30px] text-center leading-snug">
            Partnership Tiers
          </h2>
          <p className="font-medium mb-4 sm:mb-6 text-[10px] sm:text-[16px] lg:text-[16px] text-center w-full leading-snug">
            Every organization has a place in The MSL Network — tiers recognize your progress, impact, and consistency.
          </p>

          {/* --- PERKS --- */}
          <h3 className="font-bold text-[16px] sm:text-[22px] lg:text-[28px] text-[#F2C21A] mb-3 self-start">
            Perks
          </h3>

          <div className="flex flex-row w-full gap-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
            {/* LEFT COLUMN */}
            <div className="flex flex-col w-[10%] sm:w-[30%] min-w-[80px] sm:min-w-[120px] gap-0 sm:gap-4 bg-black/60 rounded-lg">
            {[
              "Tiers",
              "Diamond Allocation (per sem)",
              <>Monetary<br />Sponsorship</>,
              <>Sponsorships &<br />Rewards</>,
              <>Event Activations<br/>(Game Campaigns)</>,
              <>Creative Growth<br/>Space</>,
              <>Exclusive<br/>Opportunities</>
            ].map((perk, idx) => (
              <p
                key={idx}
                className={`font-bold text-[8px] sm:text-[16px] lg:text-[20px] 
                            leading-snug text-center flex items-center justify-center px-1 sm:px-2
                            h-[30px] sm:h-[60px] ${idx === 0 ? "text-yellow-400" : "text-white"}`}
                style={{ minHeight: "40px" }}
              >
                {perk}
              </p>
            ))}
          </div>

            {/* TIERS */}
            {[
              { name: "C", values: ["50,000", "-", "Diamonds + TL", "Low Priority", "-", "Low Priority"] },
              { name: "B", values: ["70,000", "-", "Diamonds + TL + Merch", "Moderate Priority", "Basic Access", "Moderate Priority"] },
              { name: "A", values: ["100,000", "YES", "Diamonds + TL + Merch", "High Priority", "Full Access", "High Priority"] },
              { name: "Super School", values: ["150,000", "YES", "All + First Priority", "First Priority", "Full Access", "First Priority"] }
            ].map((tier, idx) => (
              <div
                key={idx}
                className="flex flex-col w-[1%] sm:w-[20%] min-w-[80px] sm:min-w-[100px] 
                          gap-0 sm:gap-4 p-1 sm:p-4 bg-gray-400/20 rounded-lg"
              >
                <h4
                  className="text-[#F3C718] font-bold text-[8px] sm:text-[20px] 
                            leading-snug text-center flex items-center justify-center
                            h-[20px] sm:h-[50px]"
                  style={{ minHeight: "30px" }}
                >
                  {tier.name}
                </h4>
                {tier.values.map((val, i) => (
                  <p
                    key={i}
                    className="text-white font-bold text-[8px] sm:text-[16px] lg:text-[20px] 
                              leading-snug text-center flex items-center justify-center
                              h-[30px] sm:h-[60px]"
                    style={{ minHeight: "40px" }}
                  >
                    {val}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* --- REQUIREMENTS --- */}
          <h3 className="font-bold text-[16px] sm:text-[22px] lg:text-[28px] text-[#F2C21A] mt-6 mb-3 self-start">
            Requirements
          </h3>
          <div className="flex flex-row w-full gap-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
            <div className="flex flex-col w-[10%] sm:w-[30%] min-w-[80px] sm:min-w-[120px] gap-0 sm:gap-4 bg-black/60 rounded-lg">
              {[
                "Tiers",
                <>OSA-Accredited<br/>Organization</>,
                <>Endorsement of Org<br/>Adviser/Moderator</>,
                <>Accomplished<br/>Application Form</>,
                <>Signed MOU with<br/>MSL Philippines</>
              ].map((perk, idx) => (
                <p
                  key={idx}
                  className={`font-bold text-[7px] sm:text-[16px] lg:text-[20px] text-center flex items-center justify-center ${
                    idx === 0 ? "text-[#F2C21A]" : "text-white"
                  } h-[30px] sm:h-[70px]`}
                  style={{ minHeight: "40px" }}
                >
                  {perk}
                </p>
              ))}
            </div>
            {[
              { name: "C", values: ["-", "-", "YES", "YES"] },
              { name: "B", values: ["-", "-", "YES", "YES"] },
              { name: "A", values: ["YES", "YES", "YES", "YES"] },
              { name: "Super School", values: ["YES", "YES", "YES", <>Moonton<br/>School Admin</>] }
            ].map((tier, idx) => (
              <div key={idx} className="flex flex-col w-[1%] sm:w-[20%] min-w-[80px] sm:min-w-[100px] gap-0 sm:gap-4 p-1 sm:p-4 bg-gray-400/20 rounded-lg">
                <h4
                  className="text-[#F3C718] font-bold text-[8px] sm:text-[20px] leading-snug text-center flex items-center justify-center h-[20px] sm:h-[55px]"
                  style={{ minHeight: "30px" }}
                >
                  {tier.name}
                </h4>
                {tier.values.map((val, i) => (
                  <p
                    key={i}
                    className="text-white font-bold text-[8px] sm:text-[16px] lg:text-[20px] text-center flex items-center justify-center h-[30px] sm:h-[70px]"
                    style={{ minHeight: "40px" }}
                  >
                    {val}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* --- COMMUNITY REQUIREMENTS --- */}
          <h3 className="font-bold text-[16px] sm:text-[22px] lg:text-[28px] text-[#F2C21A] mt-6 mb-2 self-start">
            Community Requirements
          </h3>
          <p className="font-medium mb-4 text-[12px] sm:text-[16px] lg:text-[16px] w-full self-start">
            Community Requirements are waived for Super School partners
          </p>
          <div className="flex flex-row w-full gap-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
            <div className="flex flex-col w-[10%] sm:w-[30%] min-w-[80px] sm:min-w-[120px] gap-0 sm:gap-4 bg-black/60 rounded-lg">
              {[
                "Tiers",
                <>Turnouts in 2<br/>Consecutive MSL<br/>Tournaments</>,
                <>Members in MSL<br/>Community</>,
                <>Community<br/>Participation in<br/>Events</>
              ].map((perk, idx) => (
                <p
                  key={idx}
                  className={`font-bold text-[7px] sm:text-[16px] lg:text-[17px] text-center flex items-center justify-center ${
                    idx === 0 ? "text-[#F2C21A]" : "text-white"
                  } h-[30px] sm:h-[70px]`}
                  style={{ minHeight: "40px" }}
                >
                  {perk}
                </p>
              ))}
            </div>
            {[
              { name: "C", values: ["8 - 15 Teams", "< 100", "≤ 5%"] },
              { name: "B", values: ["16 - 31 Teams", "100 - 250", "5% - 15%"] },
              { name: "A", values: ["≥ 24 Teams", "≥ 24 Teams", "> 15%"] },
              { name: "Super School", values: ["N/A", "N/A", "N/A"] }
            ].map((tier, idx) => (
              <div key={idx} className="flex flex-col w-[1%] sm:w-[20%] min-w-[80px] sm:min-w-[100px] gap-0 sm:gap-4 p-1 sm:p-4 bg-gray-400/20 rounded-lg">
                <h4
                  className="text-[#F3C718] font-bold text-[8px] sm:text-[20px] leading-snug text-center flex items-center justify-center h-[20px] sm:h-[55px]"
                  style={{ minHeight: "30px" }}
                >
                  {tier.name}
                </h4>
                {tier.values.map((val, i) => (
                  <p
                    key={i}
                    className="text-white font-bold text-[8px] sm:text-[16px] lg:text-[20px] text-center flex items-center justify-center h-[30px] sm:h-[70px]"
                    style={{ minHeight: "40px" }}
                  >
                    {val}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* --- Partnership Tiers --- */}

      {/* --- MSL Network Footer --- */}
      <div className="w-full bg-gradient-to-r from-[#F2C21A] to-[#CA8B04] text-black font-['Montserrat'] mt-8">
        
        {/* MOBILE (same style as header) */}
        <div className="relative md:hidden min-h-[250px] flex flex-col justify-center items-center text-center px-6 py-8">
          
          {/* Background image */}
          <img
            src={frameImgFooter}
            alt="MSL Network Visual"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F2C21A]/90 to-[#CA8B04]/90"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center w-full max-w-md">
            
            {/* TITLE */}
            <h1 className="font-bold mb-2 text-[20px] sm:text-[24px] leading-tight whitespace-nowrap">
              Join the MSL Network Today
            </h1>

            {/* BODY */}
            <p className="font-medium mb-6 text-[12px] max-w-sm">
              Becoming a member is quick and easy — just send us an email to get started.
            </p>

            {/* DROPDOWN + BUTTON */}
            <div className="flex flex-col gap-3 w-full px-4">
              <select
                className="px-4 py-2 bg-black text-[#F3C718] font-bold rounded-xl text-[12px] text-center"
                defaultValue=""
                onChange={(e) => {
                  const email = e.target.value;
                  const link = document.getElementById("compose-email-mobile");

                  if (email) {
                    link.href = `mailto:${email}`;
                    link.classList.remove("pointer-events-none", "opacity-50");
                  } else {
                    link.href = "#";
                    link.classList.add("pointer-events-none", "opacity-50");
                  }
                }}
              >
                <option value="" disabled>
                  SELECT YOUR REGION
                </option>
                <option value="msl.partnerships.ncluz@gmail.com">
                  North/Central Luzon
                </option>
                <option value="msl.partnerships.ncr@gmail.com">
                  NCR
                </option>
                <option value="msl.partnerships.sluz@gmail.com">
                  South Luzon
                </option>
                <option value="msl.partnerships.vis@gmail.com">
                  Visayas
                </option>
                <option value="msl.partnerships.min@gmail.com">
                  Mindanao
                </option>
              </select>

              <a
                id="compose-email-mobile"
                href="#"
                className="px-4 py-2 bg-black text-[#F3C718] font-bold rounded-xl text-[12px] text-center pointer-events-none opacity-50 transition"
              >
                COMPOSE EMAIL
              </a>
            </div>
          </div>
        </div>


        {/* DESKTOP (unchanged) */}
        <div className="hidden md:grid md:grid-cols-2 gap-0 items-stretch min-h-[350px]">
          {/* LEFT SIDE IMAGE */}
          <div className="w-full h-full">
            <img
              src={frameImgFooter}
              alt="MSL Network Visual"
              className="w-full h-full object-cover"
            />
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="flex flex-col justify-center px-8 py-12">
            <h1 className="font-bold mb-4 text-[20px] sm:text-[28px] lg:text-[36px] leading-tight">
              Join the MSL Network Today
            </h1>
            <p className="font-medium mb-6 text-[12px] sm:text-[16px] lg:text-[16px]">
              Becoming a member is quick and easy — just send us an email to get started.
            </p>
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {/* Dropdown */}
              <select
                className="px-6 py-3 bg-black text-[#F3C718] font-bold rounded-xl"
                defaultValue=""
                onChange={(e) => {
                  const email = e.target.value;
                  const link = document.getElementById("compose-email-desktop");

                  if (email) {
                    link.href = `mailto:${email}`;
                    link.classList.remove("pointer-events-none", "opacity-50");
                  } else {
                    link.href = "#";
                    link.classList.add("pointer-events-none", "opacity-50");
                  }
                }}
              >
                <option value="" disabled className="text-center">
                  SELECT YOUR REGION
                </option>
                <option value="msl.partnerships.ncluz@gmail.com">
                  North/Central Luzon — msl.partnerships.ncluz@gmail.com
                </option>
                <option value="msl.partnerships.ncr@gmail.com">
                  National Capital Region — msl.partnerships.ncr@gmail.com
                </option>
                <option value="msl.partnerships.sluz@gmail.com">
                  South Luzon — msl.partnerships.sluz@gmail.com
                </option>
                <option value="msl.partnerships.vis@gmail.com">
                  Visayas — msl.partnerships.vis@gmail.com
                </option>
                <option value="msl.partnerships.min@gmail.com">
                  Mindanao — msl.partnerships.min@gmail.com
                </option>
              </select>

              <a
                id="compose-email-desktop"
                href="#"
                className="px-6 py-3 bg-black text-[#F3C718] font-bold rounded-xl text-center pointer-events-none opacity-50 transition"
              >
                COMPOSE EMAIL
              </a>
            </div>
          </div>
        </div>
      </div>

      
      </AuthenticatedLayout>
    </>
  );
};

export default MSLNetwork;
