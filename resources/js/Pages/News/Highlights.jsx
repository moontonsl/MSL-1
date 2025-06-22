import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// News slide data
const slides = [
  {
    title: "How MPL Smart Battle Trips Transformed My View of the Gaming Industry - Blog",
    src: "/images/MCC/News/Carousel/image_1.jpg",
  },
  {
    title: "MSL Community Spotlight",
    src: "/images/MCC/News/Carousel/image_3.jpg",
  },
  {
    title: "MSL Highlights Event",
    src: "/images/MCC/News/Carousel/image_5.JPG",
  },
  {
    title: "MSL Tournament Coverage",
    src: "/images/MCC/News/Carousel/image_7.png",
  },
  {
    title: "MSL Championship Series",
    src: "/images/MCC/News/Carousel/image_37.jpg",
  },
];

const positions = ["center", "left1", "left", "right", "right1"];
const imageVariants = {
  center: { x: "0%", scale: 1, zIndex: 5 },
  left1: { x: "-50%", scale: 0.7, zIndex: 3 },
  left: { x: "-90%", scale: 0.5, zIndex: 2 },
  right: { x: "90%", scale: 0.5, zIndex: 1 },
  right1: { x: "50%", scale: 0.7, zIndex: 3 },
};

export default function Highlights() {
  const [positionIndexes, setPositionIndexes] = useState([0, 1, 2, 3, 4]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setPositionIndexes((prevIndexes) => {
      const updatedIndexes = prevIndexes.map((prevIndex) => (prevIndex + 1) % 5);
      return updatedIndexes;
    });
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleBack = () => {
    setPositionIndexes((prevIndexes) => {
      const updatedIndexes = prevIndexes.map((prevIndex) => (prevIndex + 4) % 5);
      return updatedIndexes;
    });
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full max-w-[1900px] h-auto px-2 md:px-12 mx-auto">
      <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold text-center mb-4 md:mb-10 text-white">MSL HIGHLIGHTS</h2>
      <div className="relative flex items-center justify-center h-[220px] md:h-[600px] w-full overflow-hidden" style={{ minHeight: 220 }}>
          {slides.map((slide, index) => (
          <motion.div
              key={index}
            className="absolute rounded-2xl md:rounded-[60px] overflow-hidden shadow-lg"
            initial="center"
            animate={positions[positionIndexes[index]]}
            variants={imageVariants}
            transition={{ duration: 0.5 }}
            style={{
              width: "90vw",
              maxWidth: 370,
              height: 180,
              top: 0,
              // Enlarge for desktop
              ...(window.innerWidth >= 768 ? { width: 1200, maxWidth: 1200, height: 600 } : {})
            }}
            >
              <img 
                src={slide.src} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              style={{ height: "100%" }}
              />
            {/* Overlay for center and adjacent slides */}
            {positionIndexes[index] === 0 || positionIndexes[index] === 1 || positionIndexes[index] === 4 ? (
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-xs xs:text-sm md:text-xl font-semibold text-white">
                    {slide.title}
                  </h3>
                </div>
            ) : null}
          </motion.div>
          ))}
      </div>
      {/* Navigation Controls Below Carousel */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
          onClick={handleBack}
            className="bg-white/10 hover:bg-white/20 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-colors"
          >
            <ChevronLeft size={20} className="md:size-8" />
          </button>
          <div className="flex gap-2 md:gap-4 px-2 py-1 md:px-4 md:py-2 rounded-full">
            {slides.map((_, idx) => (
              <button
                key={idx}
              onClick={() => {
                // Move to the clicked slide
                const diff = (idx - currentSlide + slides.length) % slides.length;
                for (let i = 0; i < diff; i++) handleNext();
              }}
                className={`rounded-full transition-all ${
                  currentSlide === idx
                    ? "w-3 h-3 md:w-6 md:h-6 bg-yellow-400"
                    : "w-2 h-2 md:w-4 md:h-4 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <button
          onClick={handleNext}
            className="bg-white/10 hover:bg-white/20 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-colors"
          >
            <ChevronRight size={20} className="md:size-8" />
          </button>
        </div>
    </div>
  );
}
