import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Header, Footer } from "@/Components";
import NewsArticleSidebar from "@/Components/NewsArticleSidebar";

export default function NewsArticle({ article }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  // Force shimmer to show for at least 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      // Keep shimmer visible for at least 1 second
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <a 
            href="/news" 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Back to News
          </a>
        </div>
      </div>
    );
  }

  // Get absolute URLs for Open Graph
  const appUrl = window.location.origin;
  const articleUrl = article?.absoluteUrl || `${appUrl}/news/${article?.canonical || ''}`;
  const imageUrl = article?.absoluteImageUrl || (article?.image ? `${appUrl}${article.image}` : null);
  const description = article?.subtitle || article?.content?.substring(0, 200) || "News article";

  // Debug: Log the values that will be used (only once when article loads)
  React.useEffect(() => {
    if (article?.title) {
      console.log('=== Facebook Open Graph Debug ===');
      console.log('Title:', article?.title);
      console.log('Image URL:', imageUrl);
      console.log('Article URL:', articleUrl);
      console.log('Description:', description);
      console.log('===============================');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.title]); // Only log when title changes (article loads)

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>{article?.title ?? "News"}</title>
        <meta name="description" content={description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={article?.title ?? "News"} />
        <meta property="og:description" content={description} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:site_name" content="MSL" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={articleUrl} />
        <meta name="twitter:title" content={article?.title ?? "News"} />
        <meta name="twitter:description" content={description} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      </Head>

      <div className="relative z-10">
        <Header />
      </div>

      {/* Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 bg-white text-black p-4 rounded-lg shadow-2xl max-w-md">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded mb-2 hover:bg-blue-700"
          >
            {showDebug ? 'Hide' : 'Show'} Facebook Preview Debug
          </button>
          {showDebug && (
            <div className="space-y-2 text-sm">
              <div className="border-b pb-2">
                <strong className="text-blue-600">og:title</strong>
                <div className="text-gray-700 break-words">{article?.title || 'N/A'}</div>
              </div>
              <div className="border-b pb-2">
                <strong className="text-blue-600">og:image</strong>
                <div className="text-gray-700 break-all text-xs">{imageUrl || 'N/A'}</div>
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="mt-2 max-w-full h-auto border rounded" />
                )}
              </div>
              <div className="border-b pb-2">
                <strong className="text-blue-600">og:url</strong>
                <div className="text-gray-700 break-all text-xs">{articleUrl || 'N/A'}</div>
              </div>
              <div className="border-b pb-2">
                <strong className="text-blue-600">og:description</strong>
                <div className="text-gray-700 break-words text-xs">{description || 'N/A'}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <main className="flex-grow">
        <div 
          className="min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/MCC/IndivNews/NewsBG.png')"
          }}
        >
          <div className="min-h-screen bg-black bg-opacity-80">
            <div className="container mx-auto px-2 py-4">
              <div className="flex flex-col lg:flex-row gap-4 max-w-full mx-auto">
                {/* Main Content */}
                <div className="flex-1 lg:w-2/3 px-2">
                  <div className="flex flex-col gap-8">
                    {/* Main Image */}
                    {article.image && (
                      <div className="w-full relative">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-auto rounded-lg object-cover max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-none"
                        />
                      </div>
                    )}

                    {/* Fallback shimmer when no image */}
                    {!article.image && (
                      <div className="w-full relative">
                        <div className="w-full h-64 bg-gray-700 rounded-lg overflow-hidden">
                          {/* Debug info */}
                          <div className="absolute top-2 left-2 text-white text-xs z-20 bg-black bg-opacity-50 px-2 py-1 rounded">
                            No image - Shimmer effect still visible
                          </div>
                          
                          {/* Use the same working shimmer as sidebar */}
                          <div 
                            className="absolute inset-0 w-full h-full shimmer-sweep"
                            style={{
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                              backgroundSize: '200% 100%'
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Article Content */}
                    <div className="flex flex-col gap-6">
                      {/* Title */}
                      <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight font-montserrat">
                        {article.title}
                      </h1>
                      
                      {/* Subtitle */}
                      {article.subtitle && (
                        <p className="text-sm md:text-base lg:text-xl text-gray-300 leading-relaxed font-montserrat">
                          {article.subtitle}
                        </p>
                      )}
                      
                      {/* Author and Date */}
                      <p className="text-xs md:text-sm lg:text-base text-gray-400 italic font-montserrat">
                        By {article.author} • {article.date}
                      </p>
                      
                      {/* Article Body */}
                      {article.content && (
                        <div className="whitespace-pre-line text-xs md:text-sm lg:text-lg text-gray-200 leading-relaxed space-y-4 font-montserrat">
                        {article.content}
                      </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="lg:w-1/3 px-1">
                  <NewsArticleSidebar currentSlug={article.canonical} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
