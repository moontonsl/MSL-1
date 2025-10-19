import React from "react";
import { Link } from "@inertiajs/react";

// Updated articles data with author and date
const articles = Array(12)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    title:
      "How MPL Smart Battle Trips Transformed My View of the Gaming Industry - Blog",
    author: "Nithaiah Kenshin Macaraig",
    date: "2025-03-18",
    image: "/images/MCC/News/News - Holder.jpg",
    link: `/news/${index + 1}`,
  }));

export default function Carousel() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-6 md:py-16">
      {/* Title Section */}
      <div className="mb-6 sm:mb-10 md:mb-16 text-center px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 font-montserrat tracking-wide leading-tight">
          EVENT PHOTOS
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 font-montserrat">
          Capturing memorable moments from our latest tournaments and events.
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="w-full max-w-[1544px] px-3 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 md:gap-6">
          {/* Mobile: show only 2 */}
          {articles.slice(0, 2).map((article) => (
            <Link
              key={article.id}
              href={article.link}
              className="sm:hidden w-full h-56 bg-black rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative group"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="text-xs font-bold leading-tight mb-2 font-montserrat line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[10px] text-gray-300 font-montserrat">
                  {article.author} - {article.date}
                </p>
              </div>
            </Link>
          ))}

          {/* Desktop: show 4 */}
          {articles.slice(0, 4).map((article) => (
            <Link
              key={article.id + "-desktop"}
              href={article.link}
              className="hidden sm:block w-full h-48 md:h-64 bg-black rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative group"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                <h3 className="text-xs md:text-sm font-bold leading-tight mb-2 font-montserrat line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-300 font-montserrat">
                  {article.author} - {article.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
