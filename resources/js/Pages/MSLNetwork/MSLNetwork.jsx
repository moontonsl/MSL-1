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
        <div className="bg-gradient-to-r from-[#F2C21A] to-[#CA8B04] text-black font-['Montserrat']">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center md:h-[350px]">
            {/* LEFT SIDE - TEXT & BUTTONS */}
            <div className="flex flex-col justify-center">
              <h1 className="font-bold mb-2 text-[24px] sm:text-[32px] lg:text-[40px] leading-tight">
                MSL Network
              </h1>
              <h1 className="font-bold mb-4 text-[20px] sm:text-[28px] lg:text-[36px] leading-tight">
                Fueling Your Next Win
              </h1>

              <p className="font-medium mb-6 text-[12px] sm:text-[16px] lg:text-[16px]">
                The MSL Network is a nationwide community of collegiate esports
                organizations powered by MSL Philippines. Fueling your next win
                through events, collaboration, and exclusive opportunities.
              </p>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="px-6 py-3 bg-black text-[#F3C718] font-bold rounded-xl"
                >
                  APPLY TO JOIN
                </a>
                <a
                  href="#"
                  className="px-6 py-3 border border-black text-black font-bold rounded-xl"
                >
                  JOIN DISCORD SERVER →
                </a>
              </div>
            </div>

            {/* RIGHT SIDE CONTAINER */}
            <div className="w-full h-full flex justify-center items-center">
              {/* IMAGE TAKES WHOLE RIGHT SIDE */}
              <div className="w-full h-full">
                <img
                  src={frameImg}
                  alt="MSL Network Visual"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Be part of the MSL Network */}
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-16 font-['Montserrat']">
          <section className="bg-black/60 rounded-[20px] p-6 hover:bg-black/70 transition-colors min-h-[150px]">
            {/* HEADER */}
            <h2 className="font-bold mb-4 items-center gap-2 text-[20px] sm:text-[24px] lg:text-[30px] text-center justify-center">
              Why Your Organization Should Be <br /> Part of The MSL Network
            </h2>
            <h2 className="font-medium mb-6 text-[12px] sm:text-[16px] lg:text-[16px] text-center justify-center w-full">
              Joining us unlocks growth, recognition, and exclusive opportunities for your campus org.
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Event Activations */}
              <div className="flex items-start gap-4 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors min-h-[150px] group">
                <CalendarX className="w-10 h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[26px] mb-2">
                    Event Activations
                  </h3>
                  <p className="font-medium text-gray-400 text-[12px] sm:text-[16px]">
                    Take part in campus and nationwide tournaments
                    that bring student communities to life.
                  </p>
                </div>
              </div>

              {/* Creative Growth Space */}
              <div className="flex items-start gap-4 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors min-h-[150px] group">
                <Goal className="w-10 h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[26px] mb-2">
                    Creative Growth Space
                  </h3>
                  <p className="font-medium text-gray-400 text-[12px] sm:text-[16px]">
                    Access tools, assets, and mentorship to level up
                    your org’s content and branding.
                  </p>
                </div>
              </div>

              {/* Sponsorship and Rewards */}
              <div className="flex items-start gap-4 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors min-h-[150px] group">
                <HandCoins className="w-10 h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[26px] mb-2">
                    Sponsorship and Rewards
                  </h3>
                  <p className="font-medium text-gray-400 text-[12px] sm:text-[16px]">
                    Unlock funding, perks, and support through our
                    Buffs & Support program.
                  </p>
                </div>
              </div>

              {/* Exclusive Opportunities */}
              <div className="flex items-start gap-4 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors min-h-[150px] group">
                <Handshake className="w-10 h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[26px] mb-2">
                    Exclusive Opportunities
                  </h3>
                  <p className="font-medium text-gray-400 text-[12px] sm:text-[16px]">
                    Be first in line for MLBB campaigns, brand
                    partnerships, and national esports initiatives.
                  </p>
                </div>
              </div>

              {/* Visibility and Exposure */}
              <div className="flex items-start gap-4 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors min-h-[150px] group">
                <Users className="w-10 h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[26px] mb-2">
                    Visibility and Exposure
                  </h3>
                  <p className="font-medium text-gray-400 text-[12px] sm:text-[16px]">
                    Get featured on MSL platforms and connect with
                    audiences across the country.
                  </p>
                </div>
              </div>

              {/* Path to Pro */}
              <div className="flex items-start gap-4 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors min-h-[150px] group">
                <Sparkles className="w-10 h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[26px] mb-2">
                    Path to Pro
                  </h3>
                  <p className="font-medium text-gray-400 text-[12px] sm:text-[16px]">
                    Build experience, connections, and credibility
                    that open doors to the esports industry.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- Apply part of The MSL Network --- */}
        <div className="bg-gradient-to-r from-[#F2C21A] to-[#CA8B04] text-black font-['Montserrat']">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center md:h-[200px] mt-0">
            {/* LEFT SIDE - TEXT & BUTTONS */}
            <div className="flex flex-col justify-center">
              <h1 className="font-bold mb-2 text-[20px] sm:text-[28px] lg:text-[36px] leading-tight whitespace-nowrap">
                Apply part of The MSL Network?
              </h1>
              <p className="font-medium mb-6 text-[12px] sm:text-[16px] lg:text-[16px]">
                Learn how to access Buffs & Support, our exclusive sponsorship
                program for partnered orgs.
              </p>
            </div>

            {/* RIGHT SIDE CONTAINER */}
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex gap-4">
                <a
                  href="#"
                  className="px-6 py-3 bg-black text-[#F3C718] font-bold rounded-xl"
                >
                  APPLY TO JOIN
                </a>
                <a
                  href="#"
                  className="px-6 py-3 border border-black text-black font-bold rounded-xl"
                >
                  LEARN MORE →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* --- Partnership Tiers --- */}
        <div className="max-w-7xl mx-auto px-6 py-0 space-y-4 font-['Montserrat'] mt-0">
            <section className="flex flex-col items-center rounded-[20px] p-4 w-full">
                
                {/* HEADER */}
                <h2 className="font-bold mb-4 text-[20px] sm:text-[24px] lg:text-[30px] text-center">
                Partnership Tiers
                </h2>
                <p className="font-medium mb-6 text-[12px] sm:text-[16px] lg:text-[16px] flex justify-center text-center whitespace-nowrap w-full">
                Every org has a place in The MSL Network — tiers recognize your progress, impact, and consistency.
                </p>

                {/* Perks Title */}
                <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[28px] text-[#F2C21A] mb-6 self-start">
                Perks
                </h3>

                {/* Table */}
                <div className="flex w-full gap-4">
                {/* Left Perks Column */}
                <div className="flex flex-col w-[30%] gap-5 bg-black/60">
                    {[
                    "Tiers",
                    "Diamond Allocation (Per Sem)",
                    <>Monetary<br/>Sponsorship</>,
                    <>Sponsorship &<br/>Rewards</>,
                    <>Event Activities<br/>(Game Campaign)</>,
                    <>Creative Growth<br/>Space</>,
                    <>Exclusive<br/>Opportunities</>
                    ].map((perk, idx) => (
                        <p
                            key={idx}
                            className={`font-bold text-[18px] sm:text-[20px] lg:text-[22px] leading-[100%] text-center flex items-center justify-center ${
                            idx === 0 ? "text-[#F2C21A]" : "text-white"
                            }`}
                            style={{ height: "60px" }}
                        >
                            {perk}
                        </p>
                    ))}
                </div>

                {/* Tier Cards */}
                {[
                    { name: "C", values: ["50,000", "-", "Diamond + TL", "Low Priority", "-", "Low Priority"] },
                    { name: "B", values: ["70,000", "-", "Diamond + TL + Merch", "Moderate Priority", "Basic Access", "Moderate Priority"] },
                    { name: "A", values: ["100,000", "YES", "Diamond + TL + Merch", "High Priority", "Full Access", "High Priority"] },
                    { name: "Super School", values: ["150,000", "YES", "All + First Priority", "First Priority", "Full Access", "First Priority"] }
                ].map((tier, idx) => (
                    <div key={idx} className="flex flex-col w-[20%] gap-5 p-4 bg-gray-400/20">
                    {/* Tier Name */}
                    <h4
                        className="text-[#F3C718] font-bold text-[24px] leading-[140%] text-center flex items-center justify-center"
                        style={{ height: "45px" }}
                    >
                        {tier.name}
                    </h4>

                    {/* Tier Values */}
                    {tier.values.map((val, i) => (
                        <p
                        key={i}
                        className="text-white font-bold text-[20px] sm:text-[22px] lg:text-[24px] leading-[100%] text-center flex items-center justify-center"
                        style={{ height: "60px" }}
                        >
                        {val}
                        </p>
                    ))}
                    </div>
                ))}
                </div>
            </section>
            
            {/* Requirements Title */}
            <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[28px] text-[#F2C21A] mb-4 self-start">
            Requirements
            </h3>

            {/* Table */}
            <div className="flex w-full gap-4">
            {/* Left Perks Column */}
            <div className="flex flex-col w-[30%] gap-5 bg-black/60">
                {[
                "Tiers",
                <>OSA Accredited<br/>Organization</>,
                <>Endorsemment of Org<br/>Adviser/Moderator</>,
                <>Accomplished<br/>Application Form</>,
                <>Signed MOU with<br/>MSL Philippines</>
                ].map((perk, idx) => (
                <p
                    key={idx}
                    className={`font-bold text-[18px] sm:text-[20px] lg:text-[22px] leading-[100%] text-center flex items-center justify-center ${
                    idx === 0 ? "text-[#F2C21A]" : "text-white"
                    }`}
                    style={{ height: "60px" }}
                >
                    {perk}
                </p>
                ))}
            </div>

            {/* Tier Cards */}
            {[
                { name: "C", values: ["-", "-", "YES", "YES"] },
                { name: "B", values: ["-", "-", "YES", "YES"] },
                { name: "A", values: ["YES", "YES", "YES", "YES"] },
                { name: "Super School", values: ["YES", "YES", "YES", <>Moonton<br/>School Admin</>] }
            ].map((tier, idx) => (
                <div key={idx} className="flex flex-col w-[20%] gap-5 p-4 bg-gray-400/20">
                {/* Tier Name */}
                <h4
                    className="text-[#F3C718] font-bold text-[24px] leading-[140%] text-center flex items-center justify-center"
                    style={{ height: "45px" }}
                >
                    {tier.name}
                </h4>

                {/* Tier Values */}
                {tier.values.map((val, i) => (
                    <p
                    key={i}
                    className="text-white font-bold text-[20px] sm:text-[22px] lg:text-[24px] leading-[100%] text-center flex items-center justify-center"
                    style={{ height: "60px" }}
                    >
                    {val}
                    </p>
                ))}
                </div>
            ))}
            </div>

            {/* Community Requirements Title */}
            <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[28px] text-[#F2C21A] mb-3 self-start">
                Community Requirements
            </h3>

            <p className="font-medium mb-4 text-[12px] sm:text-[16px] lg:text-[16px] w-full text-left">
                Community Requirements are waived for Super School partners
            </p>

            {/* Table */}
            <div className="flex w-full gap-4">
            {/* Left Perks Column */}
            <div className="flex flex-col w-[30%] gap-5 bg-black/60">
                {[
                "Tiers",
                <>Turnouts in 2<br/>Consecutive MSL<br/>Tournaments</>,
                <>Members in MSL<br/>Community</>,
                <>Community<br/>Participation in<br/>Events</>
                ].map((perk, idx) => (
                <p
                    key={idx}
                    className={`font-bold text-[18px] sm:text-[20px] lg:text-[22px] leading-[100%] text-center flex items-center justify-center ${
                    idx === 0 ? "text-[#F2C21A]" : "text-white"
                    }`}
                    style={{ height: "60px" }}
                >
                    {perk}
                </p>
                ))}
            </div>

            {/* Tier Cards */}
            {[
                { name: "C", values: ["8 - 15 Teams", "< 100", "≤ 5%"] },
                { name: "B", values: ["16 - 31 Teams", "100 - 250", "5% - 15%"] },
                { name: "A", values: ["≥ 24 Teams", "≥ 24 Teams", "> 15%"] },
                { name: "Super School", values: ["N/A", "N/A", "N/A"] }
            ].map((tier, idx) => (
                <div key={idx} className="flex flex-col w-[20%] gap-5 p-4 bg-gray-400/20">
                {/* Tier Name */}
                <h4
                    className="text-[#F3C718] font-bold text-[24px] leading-[140%] text-center flex items-center justify-center"
                    style={{ height: "45px" }}
                >
                    {tier.name}
                </h4>

                {/* Tier Values */}
                {tier.values.map((val, i) => (
                    <p
                    key={i}
                    className="text-white font-bold text-[20px] sm:text-[22px] lg:text-[24px] leading-[100%] text-center flex items-center justify-center"
                    style={{ height: "60px" }}
                    >
                    {val}
                    </p>
                ))}
                </div>
            ))}
            </div>
        </div>

        {/* --- MSL Network Footer --- */}
        <div className="bg-gradient-to-r from-[#F2C21A] to-[#CA8B04] text-black font-['Montserrat'] mt-8">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center md:h-[350px]">

            {/* LEFT SIDE - TEXT & BUTTONS */}
            <div className="w-full h-full flex justify-center items-center">
                {/* IMAGE TAKES WHOLE RIGHT SIDE */}
                <div className="w-full h-full">
                <img
                    src={frameImgFooter}
                    alt="MSL Network Visual"
                    className="w-full h-full object-cover"
                />
                </div>
            </div>
            {/* RIGHT SIDE CONTAINER */}
            <div className="flex flex-col justify-center">
                <h1 className="font-bold mb-4 text-[20px] sm:text-[28px] lg:text-[36px] leading-tight">
                Join the MSL Network Today
                </h1>

                <p className="font-medium mb-6 text-[12px] sm:text-[16px] lg:text-[16px]">
                Becoming a member is quick and easy — just send us an email to
                get started.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                {/* Dropdown */}
                <select
                    className="px-6 py-3 bg-black text-[#F3C718] font-bold rounded-xl"
                    defaultValue=""
                    onChange={(e) => {
                    const email = e.target.value;
                    const link = document.getElementById("compose-email");

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

                {/* Button */}
                <a
                    id="compose-email"
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
