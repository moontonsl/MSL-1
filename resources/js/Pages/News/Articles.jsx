import React from "react";
import { Link } from "@inertiajs/react";

// Updated articles data with author and date
const articles = Array(12).fill(null).map((_, index) => ({
  id: index + 1,
  title: "How MPL Smart Battle Trips Transformed My View of the Gaming Industry - Blog",
  author: "Nithaiah Kenshin Macaraig",
  date: "2025-03-18",
  image: "/images/MCC/News/News - Holder.jpg",
  link: `/news/${index + 1}`
}));

export default function Articles() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-6 md:py-16">
      {/* Title Section */}
      <div className="mb-6 md:mb-16 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 font-montserrat">
          NEWS AND ARTICLES
        </h2>
      </div>

      {/* Articles Grid */}
      <div className="w-full max-w-[1544px] grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 px-2 xs:px-4 md:px-0">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={article.link}
            className="w-full h-40 md:h-64 bg-black rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative group"
          >
            {/* Background Image */}
              <img
                src={article.image}
                alt={article.title}
              className="w-full h-full object-cover absolute inset-0"
              />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Text Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">

              {/* Title */}
              <h3 className="text-xs md:text-sm lg:text-base font-bold leading-tight mb-2 font-montserrat line-clamp-2">
                {article.title}
              </h3>
              
              {/* Author and Date */}
              <p className="text-[10px] md:text-xs lg:text-sm text-gray-300 font-montserrat">
                {article.author} - {article.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
