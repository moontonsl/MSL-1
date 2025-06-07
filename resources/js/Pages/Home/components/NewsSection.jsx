const NewsSection = () => {
    const articles = [
        {
            category: "Gaming",
            title: "Starfield's Latest DLC Promises Revolutionary Space Exploration",
            author: "Alex Chen",
            date: "April 26, 2025",
            image: "https://picsum.photos/1920/1080?random=1",
            size: "large",
        },
        {
            category: "Esports",
            title: "Team Liquid Dominates International Championship Finals",
            image: "https://picsum.photos/1920/1080?random=2",
            size: "medium",
        },
        {
            category: "Reviews",
            title: "Next-Gen Console War: PS6 vs Xbox Series Z Analysis",
            image: "https://picsum.photos/1920/1080?random=3",
            size: "small",
        },
        {
            category: "Tech",
            title: "Revolutionary Gaming AI Sets New Benchmarks in NPCs",
            image: "https://picsum.photos/1920/1080?random=4",
            size: "small",
        },
    ];

    return (
        <section className={`pt-16 md:pt-24`}>
            <div className={`px-4 container mx-auto`}>
                <header className="text-center mb-6 md:mb-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                        NEWS & FEATURES
                    </h2>
                </header>


                <div className="lg:h-[80vh] grid grid-cols-1 lg:grid-cols-4 gap-4">

                    {articles.map((article) => {
                        const baseStyles =
                            article.size === "large"
                                ? "lg:col-span-2 lg:row-span-1 2xl:col-span-2 2xl:row-span-2"
                                : article.size === "medium"
                                    ? "lg:col-span-2 row-span-1"
                                    : "lg:col-span-2 2xl:col-span-1";

                        return (
                            <article key={article.title}
                                     className={`relative bg-black rounded-lg overflow-hidden ${baseStyles} h-64 md:h-80 lg:h-full group cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:shadow-xl`}>
                                <img src={article.image} alt={article.title}
                                     loading="lazy"
                                     className="w-full h-full object-cover absolute inset-0 opacity-80 transition-transform duration-300 transform group-hover:scale-105"/>
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-60"/>
                                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                                <span
                                    className="bg-indigo-600 text-xs px-2 py-1 rounded uppercase font-semibold tracking-wide transition-colors duration-300 group-hover:bg-indigo-700">{article.category}</span>
                                    <h3 className="text-lg md:text-xl font-bold mt-2 leading-tight">{article.title}</h3>
                                    {article.author && (
                                        <p className="text-sm mt-1">{article.author} – {article.date}</p>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default NewsSection;
