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

  // Get className for each slide based on its relative position
  const getSlideStyle = (index, current, total) => {
    const rel = ((index - current + total) % total);
    const baseStyle = "absolute rounded-[60px] overflow-hidden transition-all duration-500 ease-in-out";

    if (rel === 0) {
      return `${baseStyle} w-[1200px] h-[600px] top-0 left-[300px] z-30 opacity-100`;
    } else if (rel === 1) {
      return `${baseStyle} w-[960px] h-[480px] top-[60px] left-[774px] z-20 opacity-90`;
    } else if (rel === 2) {
      return `${baseStyle} w-[720px] h-96 top-[120px] left-[1110px] z-10 opacity-70`;
    } else if (rel === total - 1) {
      return `${baseStyle} w-[960px] h-[480px] top-[60px] left-[96px] z-20 opacity-90`;
    } else if (rel === total - 2) {
      return `${baseStyle} w-[720px] h-96 top-[120px] left-0 z-10 opacity-70`;
    } else {
      return `${baseStyle} opacity-0`; // Hide other slides
    }
  };

  return (
    <div className="w-full max-w-[1900px] h-[731px] px-12 mx-auto">
      <h2 className="text-5xl font-bold text-center mb-10 text-white">MSL HIGHLIGHTS</h2>

      {/* Carousel Container */}
      <div ref={sliderRef} className="relative w-full h-[600px] keen-slider">
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
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-xl font-semibold text-white">
                    {slide.title}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {loaded && instanceRef.current && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* Dots Navigation */}
        {loaded && instanceRef.current && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 px-4 py-2 rounded-full">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`rounded-full transition-all ${
                  currentSlide === idx
                    ? "w-6 h-6 bg-yellow-400"
                    : "w-4 h-4 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
