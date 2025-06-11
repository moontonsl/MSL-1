import React, { useState, useEffect } from "react";
import { Heading } from "@/Components";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

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
  }
];

export default function Highlights() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: {
      perView: 1.5,
      spacing: 16,
    },
    created() {
      setLoaded(true);
    },
    loop: true,
    mode: "snap",
    rtl: false,
  });

  return (
    <div className="w-full max-w-[1366px] mx-auto p-4 text-white">
      <div className="text-center mb-8">
        <Heading size="heading3xl" className="text-4xl font-bold">
          MSL HIGHLIGHTS
        </Heading>
      </div>

      {/* Keen Slider Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        {loaded && instanceRef.current && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Slider */}
        <div ref={sliderRef} className="keen-slider">
          {slides.map((slide, idx) => (
            <div key={idx} className="keen-slider__slide">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {currentSlide === idx && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-xl font-semibold text-white">
                      {slide.title}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        {loaded && instanceRef.current && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(slides.length)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === idx ? "bg-[#F3C718]" : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
