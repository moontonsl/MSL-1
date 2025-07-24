import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// News slide data
const slides = [
  {
    title: "How MPL Smart Battle Trips Transformed My View of the Gaming Industry - Blog",
    author: "Nithaiah Kenshin Macaraig",
    date: "2025-03-18",
    src: "/images/MCC/News/Carousel/image_1.jpg",
  },
  {
    title: "At its First: Moonton, NU Laguna ties Partnership",
    author: "Nestor T. Quilop III",
    date: "2024-12-17",
    src: "/images/MCC/News/Carousel/image_3.jpg",
  },
  {
    title: "Unforgettable Moments: Moonton Student Leaders Gather for 2023 Year-End Party",
    author: "Mizhcar V.",
    date: "2023-12-30",
    src: "/images/MCC/News/Carousel/image_5.JPG",
  },
  {
    title: "MCC Watch Fest 2024",
    author: "Mizhcar V.",
    date: "2023-12-30",
    src: "/images/MCC/News/Carousel/image_7.png",
  },
  {
    title: "MSL Championship Series",
    author: "MSL Team",
    date: "2024-01-15",
    src: "/images/MCC/News/Carousel/image_37.jpg",
  },
];

const positions = ["center", "left1", "left", "right", "right1"];
const imageVariants = {
  center: { x: "0%", scale: 1, zIndex: 5, opacity: 1 },
  left1: { x: "-50%", scale: 0.7, zIndex: 3, opacity: 1 },
  left: { x: "-90%", scale: 0.5, zIndex: 2, opacity: 0 },
  right: { x: "90%", scale: 0.5, zIndex: 1, opacity: 0 },
  right1: { x: "50%", scale: 0.7, zIndex: 3, opacity: 1 },
};

export default function Highlights() {
  const [positionIndexes, setPositionIndexes] = useState([0, 1, 2, 3, 4]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

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

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        handleNext();
      }, 3000); // Move every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused, currentSlide]);

  const onTouchStart = (e) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext(); // Swipe left = next slide
    } else if (isRightSwipe) {
      handleBack(); // Swipe right = previous slide
    }
  };

  return (
    <div className="w-full max-w-[1900px] h-auto px-2 md:px-12 mx-auto">
      <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold text-center mb-4 md:mb-10 text-white font-montserrat">MSL HIGHLIGHTS</h2>
      <div 
        className="relative flex items-center justify-center h-[200px] md:h-[400px] w-full overflow-hidden" 
        style={{ minHeight: 200 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className="absolute rounded-2xl md:rounded-[40px] overflow-hidden shadow-lg"
            initial="center"
            animate={positions[positionIndexes[index]]}
            variants={imageVariants}
            transition={{ duration: 0.5 }}
            style={{
              width: "80vw",
              maxWidth: 320,
              height: 160,
              top: 0,
              // Scaled down for desktop
              ...(window.innerWidth >= 768 ? { width: 800, maxWidth: 800, height: 400 } : {})
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
              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xs xs:text-sm md:text-xl font-semibold text-white mb-1 md:mb-2 font-montserrat">
                  {slide.title}
                </h3>
                <p className="text-[10px] xs:text-xs md:text-sm text-white/90 font-montserrat">
                  {slide.author} - {slide.date}
                </p>
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
      {/* Navigation Controls Below Carousel */}
      <div className="flex items-center justify-center gap-4 mt-1 md:mt-4">
        <button
          onClick={handleBack}
          className="bg-white/10 hover:bg-white/20 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-colors"
        >
          <ChevronLeft size={20} className="md:size-8" />
        </button>
        <div className="flex gap-1 md:gap-4 px-2 py-1 md:px-4 md:py-2 rounded-full">
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
