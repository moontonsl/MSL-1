import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutPrograms.jsx";
import { Helmet } from 'react-helmet';

const OppoAmbassador = () => {
    return (
        <AuthenticatedLayout>
            <Helmet>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>
            <Head title="OPPO Ambassador" />
            
            {/* Main Container */}
            <div 
                className="flex flex-col items-center w-full max-w-[1920px] px-4 md:px-8 lg:px-[150px] mx-auto overflow-x-hidden min-h-screen"
                style={{
                    backgroundImage: 'url(/images/Oppo/oppobgw.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'scroll',
                    zIndex: '1'
                }}
            >
                <main className="relative text-center w-full lg:max-w-[1440px] z-10">

                    {/* Title Section */}
                    <div className="flex flex-col pt-8 md:pt-2 items-start h-auto lg:h-[166px] w-full self-stretch">
                        <div className="flex justify-center items-end w-full py-2 lg:pt-[100px]">
                            <h1 className="text-[#303030] font-montserrat text-[20px] md:text-[32px] lg:text-[40px] font-bold leading-tight text-center px-4">
                                OPPO Brand Ambassador Program
                            </h1>
                        </div>
                        <div className="flex justify-center items-center w-full">
                            <h2 className="text-[#303030] font-montserrat text-[12px] md:text-[18px] lg:text-[24px] font-bold leading-tight px-4">
                                in Collaboration with MSL Philippines
                            </h2>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col items-center justify-center w-full mt-8 md:mt-12">
                        <div className="rounded-lg p-4 md:p-8 lg:p-16 max-w-4xl w-full">
                            <div className="text-center">
                                {/* Program Description */}
                                <p className="text-black font-montserrat text-[14px] md:text-[16px] lg:text-[18px] font-medium leading-relaxed mb-8 md:mb-16 px-4">
                                    The OPPO Student Ambassador Program empowers students who are passionate about tech and content creation to represent OPPO in their campus. Ambassadors get early access to the latest devices, exclusive event invites, campus collaborations, VIP perks, and the chance to grow their creator profile with a global brand.
                                </p>

                                {/* Benefits Section */}
                                    <div className="md:ms-20">
                                    <h3 className="text-black font-montserrat text-[16px] md:text-[24px] lg:text-[28px] font-bold mb-6 text-center md:text-start px-4">
                                        As a Student Brand Ambassador, you'll:
                                    </h3>

                                    {/* Benefits List */}
                                    <div className="space-y-2 mb-8 text-left max-w-2xl mx-auto px-4">
                                        <div className="flex items-start space-x-3">
                                            <span className="text-[#303030] text-xl flex-shrink-0">✨</span>
                                            <p className="text-black font-montserrat text-[14px] md:text-[16px] font-medium">
                                                Create content and attend exclusive branded events
                                            </p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <span className="text-[#303030] text-xl flex-shrink-0">📱</span>
                                            <p className="text-black font-montserrat text-[14px] md:text-[16px] font-medium">
                                                Get early access to our latest devices
                                            </p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <span className="text-[#303030] text-xl flex-shrink-0">📢</span>
                                            <p className="text-black font-montserrat text-[14px] md:text-[16px] font-medium">
                                                Work on exciting campus collabs
                                            </p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <span className="text-[#303030] text-xl flex-shrink-0">🎁</span>
                                            <p className="text-black font-montserrat text-[14px] md:text-[16px] font-medium">
                                                Enjoy VIP perks, freebies, and exclusive merch
                                            </p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <span className="text-[#303030] text-xl flex-shrink-0">⭐</span>
                                            <p className="text-black font-montserrat text-[14px] md:text-[16px] font-medium">
                                                Plus, grow your content and creator profile with a leading global brand
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Call to Action */}
                                <div className="text-center px-4 md:px-20 w-full">
                                    <p className="text-black font-montserrat text-[14px] md:text-[16px] font-medium mb-4 text-center">
                                        Sign Up to learn more.
                                    </p>
                                    <button 
                                        onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScgL64MYHZy1kv2AxR4nvgNworr1uJn9vQMi8AQZ54GA2zAbw/formResponse', '_blank')}
                                        className="bg-green-500 hover:bg-green-600 text-black font-montserrat text-[14px] md:text-[16px] font-semibold px-6 md:px-8 py-3 rounded-lg transition-colors duration-300 w-full md:w-auto"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>

                {/* Footer with Logos */}
                <div className="flex justify-center items-center mb-8 z-10 px-4">
                    <div className="flex items-center space-x-2">
                        <img src="/images/Oppo/oppologo.png" alt="OPPO Logo" className="h-12 md:h-24 lg:h-32 object-contain" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <img src="/images/MCC/MSL LOGO.png" alt="MSL Logo" className="h-12 md:h-16 lg:h-20 object-contain" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default OppoAmbassador;
