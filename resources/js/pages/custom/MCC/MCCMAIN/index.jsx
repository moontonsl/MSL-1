// Single-file MCC main page
import React from "react";
import { Img } from "../../../components";
import { Link } from "react-router-dom";

export default function MCCMAINPage() {
  const bgStyle = {
    backgroundImage: "url('/src/pages/MCC/images/MCC2_BG.png')",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundColor: "#000000"
  };

  const navItems = [
    { image: "/src/pages/MCC/images/Overview.png", alt: "Tournament Structure", path: "/tournament-structure" },
    { image: "/src/pages/MCC/images/Rulebook.png", alt: "Rulebook", path: "/rulebook" },
    { image: "/src/pages/MCC/images/Roadmap.png", alt: "Calendar", path: "/mcc/calendar" },
    { image: "/src/pages/MCC/images/Reg.png", alt: "Registration", path: "/registration" }
  ];

  const mainItems = navItems.slice(0, 2); // first two
  const calendarItem = navItems[2];

  return (
    <div className="w-full bg-black-900">
      <div className="flex flex-col items-center py-5 min-h-screen" style={bgStyle}>
        {/* Logo */}
        <div className="flex flex-col items-center mt-2 mb-4 md:mt-4 md:mb-6">
          <Img src="/src/pages/MCC/images/MCC_HLOGO.png" alt="MCC Logo" className="h-[200px] md:h-[383px] object-contain" />
        </div>

        {/* Desktop / tablet nav (row) */}
        <div className="grid grid-cols-2 sm:flex sm:justify-center sm:flex-wrap overflow-hidden">
          {navItems.map((item, idx) => (
            <Link key={idx} to={item.path} className="transition-transform hover:scale-105">
              <Img src={item.image} alt={item.alt} className="sm:w-[300px] sm:h-[300px] object-contain" />
            </Link>
          ))}
        </div>


         {/*Mobile nav */}
        {/*<div className="md:hidden w-full">*/}
        {/*  <div className="grid grid-cols-2">*/}
        {/*    {mainItems.map((item, idx) => (*/}
        {/*      <Link key={idx} to={item.path} className="transition-transform hover:scale-110 flex justify-center">*/}
        {/*        <Img src={item.image} alt={item.alt} className="w-[200px] h-[200px] object-contain scale-125" />*/}
        {/*      </Link>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*  <div className="flex justify-center mt-2">*/}
        {/*    <Link to={calendarItem.path} className="transition-transform hover:scale-110 flex justify-center">*/}
        {/*      <Img src={calendarItem.image} alt={calendarItem.alt} className="w-[200px] h-[200px] object-contain scale-125" />*/}
        {/*    </Link>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Bottom logos */}
        <div className="flex justify-center items-center gap-6 md:gap-12 mt-6 md:mt-10 mb-2">
          <Img src="/src/pages/MCC/images/MSL LOGO.png" alt="MSL Logo" className="h-[40px] md:h-[60px] object-contain" />
          <Img src="/src/pages/MCC/images/MLBB NEW LOGO.png" alt="MLBB Logo" className="h-[40px] md:h-[60px] object-contain" />
        </div>
      </div>
    </div>
  );
}
