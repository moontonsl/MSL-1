import React from "react";
import { Link } from "@inertiajs/react";

// Placeholder articles data - will be replaced with real data later
const articles = Array(12).fill(null).map((_, index) => ({
  id: index + 1,
  title: "Lorem Ipsum",
  description: "The MPL PH Watch Fest is an event where students comes together to experience the thrilling action of MLBB Tournaments.",
  image: "/images/MCC/News/News - Holder.jpg",
  link: `/news/${index + 1}`
}));

export default function Articles() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-6 md:py-16">
      {/* Title Section */}
      <div className="mb-6 md:mb-16 text-center">
        <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold font-['Space_Grotesk'] text-white mb-4">
          NEWS AND ARTICLES
        </h2>
        <div className="w-16 md:w-24 h-1 bg-[#F3C718] mx-auto"></div>
      </div>

      {/* Articles Grid */}
      <div className="w-full max-w-[1544px] grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 px-2 xs:px-4 md:px-0">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={article.link}
            className="w-full bg-white rounded-2xl shadow-[0px_0px_8.7px_-2.3px_rgba(242,194,26,1.00)] flex flex-col justify-center items-center overflow-hidden hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="w-full aspect-[1.81/1] relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full bg-neutral-950 flex flex-col justify-start items-start p-3 md:p-4">
              <h3 className="text-center w-full text-white text-base xs:text-lg md:text-xl font-bold font-['Space_Grotesk'] leading-loose mb-1 md:mb-2">
                {article.title}
              </h3>
              <p className="text-center w-full text-white text-xs xs:text-sm md:text-lg font-normal font-['Space_Grotesk'] leading-relaxed">
                {article.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
