import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Slide Data
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

export default function Highlights() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slides: slides.length,
    loop: true,
    dragSpeed: 0.8,
    renderMode: "custom",
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  // Responsive slide style
  const getSlideStyle = (index, current, total) => {
    const rel = ((index - current + total) % total);
    const baseStyle = "absolute overflow-hidden transition-all duration-500 ease-in-out";
    // Desktop
    if (window.innerWidth >= 1024) {
      if (rel === 0) {
        return `${baseStyle} rounded-[60px] w-[1200px] h-[600px] top-0 left-[300px] z-30 opacity-100`;
      } else if (rel === 1) {
        return `${baseStyle} rounded-[60px] w-[960px] h-[480px] top-[60px] left-[774px] z-20 opacity-90`;
      } else if (rel === 2) {
        return `${baseStyle} rounded-[60px] w-[720px] h-96 top-[120px] left-[1110px] z-10 opacity-70`;
      } else if (rel === total - 1) {
        return `${baseStyle} rounded-[60px] w-[960px] h-[480px] top-[60px] left-[96px] z-20 opacity-90`;
      } else if (rel === total - 2) {
        return `${baseStyle} rounded-[60px] w-[720px] h-96 top-[120px] left-0 z-10 opacity-70`;
      } else {
        return `${baseStyle} opacity-0`;
      }
    }
    // Mobile/tablet
    if (rel === 0) {
      return `${baseStyle} rounded-2xl w-[90vw] max-w-[370px] h-[180px] left-1/2 -translate-x-1/2 top-0 z-30 opacity-100`;
    } else if (rel === 1) {
      return `${baseStyle} rounded-2xl w-[70vw] max-w-[280px] h-[140px] left-[70%] top-[24px] z-20 opacity-80`;
    } else if (rel === total - 1) {
      return `${baseStyle} rounded-2xl w-[70vw] max-w-[280px] h-[140px] left-[0%] top-[24px] z-20 opacity-80`;
    } else {
      return `${baseStyle} opacity-0`;
    }
  };

  return (
    <div className="w-full max-w-[1900px] h-auto px-2 md:px-12 mx-auto">
      <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold text-center mb-4 md:mb-10 text-white">MSL HIGHLIGHTS</h2>

      {/* Carousel Container */}
      <div className="relative w-full h-[220px] md:h-[600px] keen-slider" ref={sliderRef}>
        {/* Slide Layer */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={getSlideStyle(index, currentSlide, slides.length)}
            >
              <img 
                src={slide.src} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
              {/* Title Overlay - Only show for active and adjacent slides */}
              {Math.abs(((index - currentSlide + slides.length) % slides.length)) <= 1 && (
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-xs xs:text-sm md:text-xl font-semibold text-white">
                    {slide.title}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls Below Carousel */}
      {loaded && instanceRef.current && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="bg-white/10 hover:bg-white/20 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-colors"
          >
            <ChevronLeft size={20} className="md:size-8" />
          </button>
          <div className="flex gap-2 md:gap-4 px-2 py-1 md:px-4 md:py-2 rounded-full">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`rounded-full transition-all ${
                  currentSlide === idx
                    ? "w-3 h-3 md:w-6 md:h-6 bg-yellow-400"
                    : "w-2 h-2 md:w-4 md:h-4 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => instanceRef.current?.next()}
            className="bg-white/10 hover:bg-white/20 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-colors"
          >
            <ChevronRight size={20} className="md:size-8" />
          </button>
        </div>
      )}
    </div>
  );
}
