import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutPrograms.jsx";
import { Helmet } from 'react-helmet';

const Programs = () => {
    return (
        <AuthenticatedLayout>
            <Helmet>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>
            <Head title="MSL Programs" />
            
            {/* Main Container */}
            <div className="flex flex-col items-center w-full max-w-[1920px] md:px-8 lg:px-[150px] mx-auto overflow-x-hidden">
                <main className="relative text-center w-full lg:max-w-[1440px] mb-12">

                    {/* Title Section */}
                    <div className="flex flex-col pt-2 items-start h-auto lg:h-[166px] w-full self-stretch">
                        <div className="flex justify-center items-end w-full py-2 lg:py-[15px]">
                            <h1 className="text-yellow-500 font-montserrat text-[24px] md:text-[32px] lg:text-[40px] font-bold leading-tight">
                                MSL PROGRAMS
                            </h1>
                        </div>
                        <div className="flex justify-center items-center w-full">
                            <h2 className="text-white font-montserrat text-[12px] md:text-[18px] lg:text-[30px] font-medium leading-tight">
                                We don't just play games, we deliver academic excellence
                            </h2>
                        </div>
                    </div>

                    {/* Programs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-10 w-full mt-6">
                        {[
                            {
                                img: '/images/Programs/msln.png',
                                title: 'MSL NETWORK',
                                desc: 'To qualify for the MSL Network, an organization must meet several criteria. It must be focused on gaming or esports, officially recognized by its school, and have a clear structure with defined roles such as CEO, President, Committee Heads, Managers, and Players. These requirements ensure that only legitimate and well-organized groups are admitted to the MSL Network.'
                            },
                            {
                                img: '/images/Programs/bas.png',
                                title: 'BUFFS AND SUPPORT',
                                desc: 'The Buffs and Support Program of the Partnerships Department has been one of the most substantial initiatives of MSL Philippines.'
                            }
                        ].map((program, idx) => (
                            <div 
                                key={idx} 
                                className="flex flex-col bg-transparent p-3 md:p-4 lg:p-6 gap-3 md:gap-4 lg:gap-6 flex-1"
                            >
                                <div 
                                    className="h-[180px] md:h-[260px] lg:h-[425px] w-full bg-lightgray bg-center bg-cover bg-no-repeat rounded-lg"
                                    style={{ backgroundImage: `url(${program.img})` }}
                                />
                                <div className="flex flex-col justify-between flex-1 p-2 md:p-3 lg:p-4 gap-3">
                                    <h3 className="text-yellow-500 text-center font-montserrat text-[18px] md:text-[22px] lg:text-[30px] font-bold leading-tight">
                                        {program.title}
                                    </h3>
                                    <p className="text-white font-montserrat text-[12px] md:text-[14px] lg:text-[16px] font-medium leading-relaxed line-clamp-4">
                                        {program.desc}
                                    </p>
                                    <div className="flex justify-end">
                                        <button
                                            className="
                                                flex px-3 md:px-4 lg:px-6 py-2 md:py-2 lg:py-3
                                                rounded-xl lg:rounded-[30px]
                                                bg-[#303030] hover:bg-yellow-500
                                                transition-colors duration-300
                                            "
                                        >
                                            <span className="text-white hover:text-black font-inter text-[12px] md:text-[14px] lg:text-[16px] font-semibold">
                                                Read More
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Lower Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-10 w-full mt-10">
                        {[
                            {
                                img: '/images/Programs/msla.png',
                                title: 'MSL APPLICATION',
                                desc: 'Join us at MSL Philippines and become part of our growing community where your passion for gaming and commitment to academics are both valued and supported. We are open to all MLBB School Communities across the Philippines.'
                            },
                            {
                                img: '/images/Programs/eosr.png',
                                title: 'END OF SEMESTER REWARDS',
                                desc: 'EOSR is crafted for our MLBB student communities, deeply rooted in our objective of achieving balanced gaming and academics. Its fundamental goal is to recognize your commitment, effort, and successes along your academic journey. MSL Philippines values your grades through in-game diamonds and can earn up to 3,500 by doing your best in academics!'
                            }
                        ].map((program, idx) => (
                            <div 
                                key={idx} 
                                className="flex flex-col bg-transparent p-3 md:p-4 lg:p-6 gap-3 md:gap-4 lg:gap-6 flex-1"
                            >
                                <div 
                                    className="h-[180px] md:h-[260px] lg:h-[425px] w-full bg-lightgray bg-center bg-cover bg-no-repeat rounded-lg"
                                    style={{ backgroundImage: `url(${program.img})` }}
                                />
                                <div className="flex flex-col justify-between flex-1 p-2 md:p-3 lg:p-4 gap-3">
                                    <h3 className="text-yellow-500 text-center font-montserrat text-[18px] md:text-[22px] lg:text-[30px] font-bold leading-tight">
                                        {program.title}
                                    </h3>
                                    <p className="text-white font-montserrat text-[12px] md:text-[14px] lg:text-[16px] font-medium leading-relaxed line-clamp-4">
                                        {program.desc}
                                    </p>
                                    <div className="flex justify-end">
                                        <button
                                            className="
                                                flex px-3 md:px-4 lg:px-6 py-2 md:py-2 lg:py-3
                                                rounded-xl lg:rounded-[30px]
                                                bg-[#303030] hover:bg-yellow-500
                                                transition-colors duration-300
                                            "
                                        >
                                            <span className="text-white hover:text-black font-inter text-[12px] md:text-[14px] lg:text-[16px] font-semibold">
                                                Read More
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </main>
            </div>
        </AuthenticatedLayout>
    );
};

export default Programs;