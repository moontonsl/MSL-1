import React from "react";
import { Link } from "@inertiajs/react";
import { Header, Footer } from "@/Components";

export default function ResourcesPage() {
    const bgStyle = {
        backgroundImage: "url('/images/MCC/Resources/MainBG.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundColor: "#000000"
    };

    const resourceItems = [
        { image: "/images/MCC/Resources/CAMPUS3.png", alt: "Campus", path: "/resources/campus", isExternal: false },
        { image: "/images/MCC/Resources/ABOUT3.png", alt: "About Us", path: "/about", isExternal: false },
        { image: "/images/MCC/Resources/MSLDIRECTORY3.png", alt: "MSL Directory", path: "/resources/directory", isExternal: false },
        { image: "/images/MCC/Resources/ASSETS3.png", alt: "Assets", path: "/resources/assets", isExternal: false }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative z-10">
                <Header />
            </div>

            <main className="relative z-0">
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]" style={bgStyle}>
                    {/* Title */}
                    <div className="flex flex-col items-center mb-8 md:mb-12">
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wider">RESOURCES</h1>
                    </div>

                    {/* Resource buttons grid */}
                    <div className="w-full max-w-[1400px] mx-auto px-2 md:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-12">
                            {resourceItems.map((item, idx) => (
                                item.isExternal ? (
                                    <a
                                        key={idx}
                                        href={item.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transform transition-all duration-300 hover:scale-105 flex items-center justify-center p-1 md:p-0"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.alt}
                                            className="w-full max-w-[180px] md:max-w-none h-auto object-contain rounded-lg shadow-lg hover:shadow-2xl"
                                        />
                                    </a>
                                ) : (
                                    <Link
                                        key={idx}
                                        href={item.path}
                                        className="transform transition-all duration-300 hover:scale-105 flex items-center justify-center p-1 md:p-0"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.alt}
                                            className="w-full max-w-[180px] md:max-w-none h-auto object-contain rounded-lg shadow-lg hover:shadow-2xl"
                                        />
                                    </Link>
                                )
                            ))}
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
