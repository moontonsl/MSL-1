import React from "react";
import { Link } from "@inertiajs/react";

// Updated articles data to match the home page NEWS & FEATURES structure
const articles = [
  {
    id: 1,
    title: "How MPL Smart Battle Trips Transformed My View of the Gaming Industry - Blog",
    author: "Nithaiah Kenshin Macaraig",
    date: "2025-03-18",
    image: "/images/MCC/News/Carousel/image_1.jpg",
    category: "NEWS",
    size: "large",
    link: "/news/1"
  },
  {
    id: 2,
    title: "Stronger Ties: Moonton Philippines, UMAK Seals Partnership",
    author: "Nestor T. Quilop III",
    date: "2024-12-17",
    image: "/images/MCC/News/Carousel/image_3.jpg",
    category: "NEWS",
    size: "medium",
    link: "/news/stronger-ties-moonton-umak"
  },
  {
    id: 3,
    title: "At its First: Moonton, NU Laguna ties Partnership",
    author: "Nestor Q. Quilop III",
    date: "2024-04-15",
    image: "/images/MCC/News/Carousel/image_37.jpg",
    category: "NEWS",
    size: "small",
    link: "/news/3"
  },
  {
    id: 4,
    title: "Unforgettable Moments: Moonton Student Leaders Gather for 2023 Year-End Party",
    author: "Mizhcar V.",
    date: "2023-12-30",
    image: "/images/MCC/News/Carousel/image_5.JPG",
    category: "NEWS",
    size: "small",
    link: "/news/4"
  }
];

export default function Articles() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-6 md:py-16">
      {/* Title Section */}
      <div className="mb-6 md:mb-16 text-center">
        <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold text-white mb-4 font-montserrat">
          NEWS & FEATURES
        </h2>
      </div>

      {/* Articles Masonry Grid */}
      <div className="w-full max-w-[1544px] px-2 xs:px-4 md:px-0">
        <div className="lg:h-[80vh] grid grid-cols-1 lg:grid-cols-4 gap-4">
          {articles.map((article) => {
            const baseStyles =
              article.size === "large"
                ? "lg:col-span-2 lg:row-span-1 2xl:col-span-2 2xl:row-span-2"
                : article.size === "medium"
                  ? "lg:col-span-2 row-span-1"
                  : "lg:col-span-2 2xl:col-span-1";

            return (
              <Link
                key={article.id}
                href={article.link}
                className={`relative bg-black rounded-lg overflow-hidden ${baseStyles} h-64 md:h-80 lg:h-full group cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:shadow-xl`}
              >
                <img 
                  src={article.image} 
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover absolute inset-0 opacity-80 transition-transform duration-300 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-60" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 text-white">
                  <span className="bg-indigo-600 text-xs px-2 py-1 rounded uppercase font-semibold tracking-wide transition-colors duration-300 group-hover:bg-indigo-700 font-montserrat">
                    {article.category}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold mt-2 leading-tight font-montserrat">
                    {article.title}
                  </h3>
                  {article.author && (
                    <p className="text-sm mt-1 font-montserrat">
                      {article.author} – {article.date}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
