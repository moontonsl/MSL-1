import React from "react";
import { Link } from "@inertiajs/react";
import { getRelatedArticles } from "../Data/newsData";

export default function NewsArticleSidebar({ currentSlug, limit = 3 }) {
    // Get related articles excluding the current article
    const relatedArticles = getRelatedArticles(currentSlug, limit);
    
    return (
        <div className="self-stretch p-1 inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
            {/* Desktop Layout - Vertical Stack */}
            <div className="hidden lg:flex flex-col gap-1 w-full">
                {relatedArticles.map((article) => (
                    <div key={article.id} className="self-stretch p-1 inline-flex justify-start items-start gap-2 overflow-hidden cursor-pointer hover:bg-gray-900 hover:bg-opacity-50 transition-all duration-300 rounded-lg">
                        <div className="rounded-[30px] flex justify-center items-center gap-2 overflow-hidden flex-shrink-0">
                            <img 
                                className="w-80 h-64 object-cover rounded-[30px]" 
                                src={article.image}
                                alt={article.title}
                            />
                        </div>
                        <div className="flex-1 p-1 inline-flex flex-col justify-between items-start gap-2 overflow-hidden">
                            <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-1 overflow-hidden">
                                <div className="self-stretch text-white text-lg font-bold font-['Montserrat'] leading-tight hover:text-blue-400 transition-colors">
                                    {article.title}
                                </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-end items-start gap-1 overflow-hidden mt-auto">
                                <div className="text-white text-base font-light font-['Montserrat'] leading-snug">
                                    {article.date}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Layout - Horizontal Scroll (2 visible, 1 scrollable) */}
            <div className="lg:hidden w-full overflow-x-auto">
                <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
                    {relatedArticles.map((article) => (
                        <div key={article.id} className="flex-shrink-0 w-44 p-2 bg-gray-900 bg-opacity-50 rounded-lg cursor-pointer hover:bg-opacity-70 transition-all duration-300">
                            <div className="w-full mb-2">
                                <img 
                                    className="w-full h-24 object-cover rounded-lg" 
                                    src={article.image}
                                    alt={article.title}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-white text-xs font-bold font-['Montserrat'] leading-tight hover:text-blue-400 transition-colors line-clamp-3">
                                    {article.title}
                                </div>
                                <div className="text-white text-xs font-light font-['Montserrat'] leading-snug opacity-80">
                                    {article.date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* View More Button */}
            <div className="self-stretch flex justify-center mt-2 lg:mt-4">
                <Link href="/news">
                    <div className="w-64 h-14 p-1.5 bg-white/5 rounded-[57.71px] outline outline-[1.73px] outline-offset-[-1.73px] outline-white inline-flex justify-center items-center gap-1.5 overflow-hidden hover:bg-white/10 transition-all duration-300">
                        <div className="justify-start text-white text-lg font-bold font-['Space_Grotesk'] leading-relaxed">
                            View More Articles
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
} 