import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Slide Data
const slides = [
  {
    title: "How MPL Smart Battle Trips Transformed My View of the Gaming Industry - Blog",
    src: "https://placehold.co/1200x600?text=Slide+1",
  },
  {
    title: "MSL Community Spotlight",
    src: "https://placehold.co/960x480?text=Slide+2",
  },
  {
    title: "MSL Highlights Event",
    src: "https://placehold.co/960x480?text=Slide+3",
  },
  {
    title: "MSL Tournament Coverage",
    src: "https://placehold.co/720x384?text=Slide+4",
  },
  {
    title: "MSL Championship Series",
    src: "https://placehold.co/720x384?text=Slide+5",
  },
];

// Get className for each slide based on its relative position
const getSlideStyle = (index, current, total) => {
  const rel = ((index - current + total) % total);

  if (rel === 0) {
    return "w-[1200px] h-[600px] top-0 left-[300px] z-30";
  } else if (rel === 1) {
    return "w-[960px] h-[480px] top-[60px] left-[774px] z-20";
  } else if (rel === 2) {
    return "w-[720px] h-96 top-[120px] left-[1110px] z-10 opacity-70";
  } else if (rel === total - 1) {
    return "w-[960px] h-[480px] top-[60px] left-[96px] z-20";
  } else if (rel === total - 2) {
    return "w-[720px] h-96 top-[120px] left-0 z-10 opacity-70";
  } else {
    return "hidden"; // hide any out-of-view slides
  }
};

export default function Highlights() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <div className="relative w-full max-w-[1900px] h-[731px] px-12 mx-auto overflow-hidden text-white">
      {/* Title */}
      <h2 className="text-5xl font-bold text-center mb-10">MSL HIGHLIGHTS</h2>

      {/* Carousel Container */}
      <div className="relative w-full h-[600px]">
        {/* Slide Layer (absolute layout inside relative box) */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute rounded-[60px] overflow-hidden transition-all duration-500 ease-in-out ${getSlideStyle(index, currentSlide, slides.length)}`}
            >
              <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Gradient Overlay (optional) */}
        <div className="pointer-events-none absolute inset-0 flex justify-between z-40">
          <div className="w-1/4 h-full bg-gradient-to-r from-black to-transparent" />
          <div className="w-1/4 h-full bg-gradient-to-l from-black to-transparent" />
        </div>

        {/* Navigation Arrows */}
        {loaded && instanceRef.current && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}
      </div>

      {/* Dots Navigation */}
      {loaded && instanceRef.current && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-black/40 px-4 py-2 rounded-full">
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
  );
}
