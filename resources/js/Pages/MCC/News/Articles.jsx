import React from "react";
import { Link } from "@inertiajs/react";

// Placeholder articles data
const articles = [
  {
    id: 1,
    title: "The MPL PH Watch Fest",
    description: "The MPL PH Watch Fest is an event where students comes together to experience the thrilling action of MLBB tournaments.",
    image: "/images/MCC/News/watchfest.jpg",
    link: "/news/1"
  },
  // Duplicate the same article 14 more times for the grid
  ...Array(14).fill(null).map((_, index) => ({
    id: index + 2,
    title: "The MPL PH Watch Fest",
    description: "The MPL PH Watch Fest is an event where students comes together to experience the thrilling action of MLBB tournaments.",
    image: "/images/MCC/News/watchfest.jpg",
    link: `/news/${index + 2}`
  }))
];

export default function Articles() {
  return (
    <div className="w-full max-w-[1366px] mx-auto p-4">
      <h2 className="text-3xl font-bold text-white mb-8">News and Articles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={article.link}
            className="bg-[#1A1A1A] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
          >
            <div className="aspect-video">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-white text-xl font-semibold mb-2">
                {article.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {article.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
