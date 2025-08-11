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
            
            {/* Main Container - Mobile First */}
            <div className="flex flex-col items-center w-[355px] lg:w-[1920px] lg:px-[150px]">
                <main className="relative text-center w-full lg:max-w-[1440px] mb-12">

                    {/* Title Section */}
                    <div className="flex flex-col pt-2 items-start h-[60px] lg:h-[166px] w-full self-stretch">
                        <div className="flex h-[29.524px] lg:h-[81px] py-[5.467px] lg:py-[15px] justify-center items-end self-stretch">
                            <h1 className="text-white font-montserrat text-[24px] lg:text-[40px] font-bold leading-[8.748px] lg:leading-[60%]">
                                MSL PROGRAMS
                            </h1>
                        </div>
                        <div className="flex h-[16.767px] lg:h-[46px] justify-center items-center self-stretch">
                            <h2 className="text-white font-montserrat text-[12px] lg:text-[30px] font-medium leading-[8.748px] lg:leading-[80%]">
                                We don't just play games, we deliver academic excellence
                            </h2>
                        </div>
                    </div>

                    {/* Programs Grid */}
                    <div className="flex flex-col lg:flex-row gap-[3.645px] lg:gap-[10px] w-full">
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
                                className="flex flex-col p-[3.645px] lg:p-[10px] gap-[3.645px] lg:gap-[10px] flex-1 min-w-0"
                            >
                                <div 
                                    className="h-[155.067px] lg:h-[425px] aspect-[126/71] flex-shrink-0 bg-lightgray bg-center bg-cover bg-no-repeat"
                                    style={{ backgroundImage: `url(${program.img})` }}
                                />
                                <div className="flex flex-col justify-between flex-1 p-[3.645px] lg:p-[10px] gap-[10px]">
                                    <h3 className="text-white text-center font-montserrat text-[20px] lg:text-[30px] font-bold leading-[140%]">
                                        {program.title}
                                    </h3>
                                    <p className="text-white font-montserrat text-[12px] lg:text-[16px] font-medium leading-[18px] lg:leading-[24px] line-clamp-4">
                                        {program.desc}
                                    </p>
                                    <div className="flex justify-end">
                                        <button
                                        className="
                                            flex px-[10px] lg:px-[20px] py-[5px] lg:py-[12px]
                                            rounded-[10.935px] lg:rounded-[30px]
                                            bg-[#303030] hover:bg-yellow-500
                                            transition-colors duration-300
                                        "
                                        >
                                        <span
                                            className="
                                            text-white hover:text-black
                                            font-inter text-[10px] lg:text-[16px]
                                            font-semibold leading-[14px] lg:leading-[24px]
                                            "
                                        >
                                            Read More
                                        </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Lower Section */}
                    <div className="flex flex-col lg:flex-row gap-[3.645px] lg:gap-[10px] w-full">
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
                                className="flex flex-col p-[3.645px] lg:p-[10px] gap-[3.645px] lg:gap-[10px] flex-1 min-w-0"
                            >
                                <div 
                                    className="h-[155.067px] lg:h-[425px] aspect-[126/71] flex-shrink-0 bg-lightgray bg-center bg-cover bg-no-repeat"
                                    style={{ backgroundImage: `url(${program.img})` }}
                                />
                                <div className="flex flex-col justify-between flex-1 p-[3.645px] lg:p-[10px] gap-[10px]">
                                    <h3 className="text-white text-center font-montserrat text-[20px] lg:text-[30px] font-bold leading-[140%]">
                                        {program.title}
                                    </h3>
                                    <p className="text-white font-montserrat text-[12px] lg:text-[16px] font-medium leading-[18px] lg:leading-[24px] line-clamp-4">
                                        {program.desc}
                                    </p>
                                    <div className="flex justify-end">
                                        <button
                                            className="
                                            flex px-[10px] lg:px-[20px] py-[5px] lg:py-[12px]
                                            rounded-[10.935px] lg:rounded-[30px]
                                            bg-[#303030] hover:bg-yellow-500
                                            transition-colors duration-300
                                            "
                                        >
                                            <span className="text-white hover:text-black font-inter text-[10px] lg:text-[16px] font-semibold leading-[14px] lg:leading-[24px]">
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
