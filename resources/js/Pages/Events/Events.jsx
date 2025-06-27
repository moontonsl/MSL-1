import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEvents.jsx";
import styles from './events.module.scss';

function Events() {
    // Dummy array for cards to demonstrate the layout.
    const eventCards = [
        {
            title: "MPL S15 University Watch Fest",
            description: "The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.",
            image: "/frame292.png",
            isRecent: true,
        },
        {
            title: "MPL S15 University Watch Fest",
            description: "The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.",
            image: "/frame292.png",
            isRecent: true,
        },
        {
            title: "MPL S15 University Watch Fest",
            description: "The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.",
            image: "/frame292.png",
            isRecent: true,
        },
        {
            title: "MPL S15 University Watch Fest",
            description: "The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.",
            image: "/frame292.png",
            isRecent: true,
        },
        {
            title: "MPL S15 University Watch Fest",
            description: "The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.",
            image: "/frame292.png",
            isRecent: true,
        },
        {
            title: "MPL S15 University Watch Fest",
            description: "The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.",
            image: "/frame292.png",
            isRecent: true,
        },
        {
            title: "MPL S15 University Watch Fest",
            description: "The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.",
            image: "/frame292.png",
            isRecent: true,
        },
        {
            title: "MPL S15 University Watch Fest",
            description: "The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.",
            image: "/frame292.png",
            isRecent: true,
        },
        {
            title: "MPL S15 University Watch Fest",
            description: "The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.",
            image: "/frame292.png",
            isRecent: true,
        },
        // Added one more card for testing odd/even scenarios
        {
            title: "MPL S15 University Watch Fest",
            description: "The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.",
            image: "/frame292.png",
            isRecent: true,
        },
    ];

    return (
        <>
            <Head title="Events" />
            <AuthenticatedLayout>
                <main className="relative text-center mb-12 pt-4">
                    {/* MSL Highlight Event Section */}
                    <section className="w-full flex flex-col items-center text-center mb-12">
                        <h2 className="text-white font-['Montserrat'] text-[28px] md:text-[40px] font-bold leading-[140%] mt-0 text-center mb-2 tracking-[-0.015em]">
                            MSL HIGHLIGHT EVENT
                        </h2>
                        <p className="text-white font-['Poppins'] text-xs md:text-sm italic font-medium leading-[140%] mt-0">
                            Join us for an exciting journey of unforgettable moments!
                        </p>
                    </section>

                    {/* MSL Collegiate Cup (MCC) Section */}
                    <section
                        className="mx-auto flex flex-col lg:flex-row justify-end items-start gap-5 flex-shrink-0 rounded-[30px] mt-[-30px] bg-[rgba(36,36,36,0.8)] shadow-[inset_-30px_-30px_80px_#141414,inset_30px_20px_100px_#0A0A0A,-30px_-30px_80px_rgba(255,255,255,0.14),30px_30px_80px_rgba(243,199,24,0.14)]"
                        style={{ maxWidth: '1418px', width: '100%', minHeight: '460px', padding: '20px 30px' }}
                    >
                        {/* Second Div (Image) - Appears first on mobile (default order-1), last on desktop (lg:order-last) */}
                        <div className="flex justify-center items-center flex-shrink-0 mt-4 lg:mt-0 w-full lg:w-auto order-1 lg:order-last">
                            <div className="flex w-full md:w-[344.467px] p-2 md:p-[14.697px] flex-col justify-center items-center gap-2 md:gap-[7.349px]">
                                <div className="flex p-1 md:p-[0px_22.046px] flex-col justify-center items-start gap-1 md:gap-[9.186px] self-stretch">
                                    <img src="/mcclogo.png" alt="MCC Logo" className="w-full h-[200px] md:h-[350px] object-contain rounded-xl" />
                                </div>
                            </div>
                        </div>

                        {/* First Div (Text Content) - Appears second on mobile (default order-2), first on desktop (lg:order-first) */}
                        <div className="flex flex-col justify-center items-start flex-1 p-0 h-auto lg:h-[395px] order-2 lg:order-first">
                            <div className="flex p-1 md:p-2 items-start gap-1 md:gap-2">
                                <h3 className="text-white text-left font-['Montserrat'] text-[22px] md:text-[40px] font-bold leading-[140%] w-full lg:w-[622px]">
                                    MSL Collegiate Cup (MCC)
                                </h3>
                            </div>
                            <div className="flex p-1 md:p-2 items-start gap-1 md:gap-2 self-stretch">
                                <h4 className="text-white text-left font-['Space_Grotesk'] text-[16px] md:text-[20px] font-bold leading-[140%]">
                                    What is MCC?
                                </h4>
                            </div>
                            <div className="flex p-1 md:p-2 items-start gap-1 md:gap-2 self-stretch">
                                <p className="text-white text-left font-['Space_Grotesk'] text-[14px] md:text-[18px] font-normal leading-[140%] w-full lg:w-[911px]">
                                    MSL Collegiate Cup (MCC) is a platform for collegiate players to showcase their skills in the national
                                    stage. MCC is a potential franchise that both promote the participation of the MSL Communities and
                                    accredited organization across the country.
                                </p>
                            </div>
                            <div className="flex p-1 md:p-2 items-start gap-1 md:gap-2 self-stretch">
                                <h4 className="text-white text-left font-['Space_Grotesk'] text-[16px] md:text-[20px] font-bold leading-[140%]">
                                    Who can join MCC?
                                </h4>
                            </div>
                            <div className="flex p-1 md:p-2 items-start gap-1 md:gap-2 self-stretch">
                                <p className="text-white text-left font-['Space_Grotesk'] text-[14px] md:text-[18px] font-normal leading-[140%] w-full lg:w-[911px]">
                                    Aspiring Student-Gamers from MSL Communities and MSL Network Organizations are allowed to join.
                                </p>
                            </div>
                            <div className="flex w-full lg:w-[944px] flex-col items-start mt-4">
                                <div className="flex p-1 md:p-2 flex-col justify-center items-center gap-1 md:gap-2">
                                    <div className="flex w-[150px] h-[45px] md:w-[190.451px] md:h-[57.713px] p-1 md:p-[5.771px] justify-center items-center gap-1 md:gap-[5.771px] rounded-[57.712px] border border-white bg-[rgba(255,255,255,0.05)] cursor-pointer">
                                        <span className="text-white font-['Space_Grotesk'] text-base md:text-[18.468px] font-bold leading-[140%]">
                                            Learn more
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Other MSL Events Section */}
                    <section className="mx-auto flex flex-col items-center flex-shrink-0 py-8" style={{ maxWidth: '1418px' }}>
                        {/* Title */}
                        <div className="flex w-full px-4 lg:px-0 items-center gap-2 md:gap-9">
                            <h2 className="text-white text-left font-['Montserrat'] text-[32px] md:text-[57.6px] font-bold leading-[140%] w-full">
                                OTHER MSL EVENTS
                            </h2>
                        </div>

                        {/* Cards Grid: 2 columns on mobile, 3 columns on desktop with centering for odd last card */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 lg:gap-y-5 justify-items-center w-full px-2 md:px-0 pt-8">
                            {eventCards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`
                                        flex flex-col justify-center items-center rounded-xl bg-white shadow-[0px_0px_10.379px_-2.805px_#F2C21A] overflow-hidden w-full max-w-[463.68px]
                                        h-[300px] md:h-[462.825px] /* Added these classes for responsive height control */
                                        ${
                                            // Conditional centering for the last odd card on mobile only
                                            (eventCards.length % 2 === 1 && index === eventCards.length - 1)
                                            ? 'col-span-1 mx-auto' 
                                            : ''
                                        }
                                    `}
                                >
                                    <div
                                        className="flex flex-col items-center flex-1 self-stretch bg-black bg-no-repeat bg-center bg-cover relative w-full h-[30%] md:h-[calc(462.825px-190.74px)] md:px-0 md:py-0"
                                        style={{ backgroundImage: `url(${card.image})` }}
                                    >
                                        <div className="absolute top-4 md:top-8 left-0 flex h-6 md:h-[42.075px] px-1 md:px-[9.35px] justify-center items-center gap-0.5 md:gap-[9.35px] rounded-r-lg md:rounded-r-[16.83px] bg-red-600">
                                            <span className="text-white font-['Space_Grotesk'] text-xs md:text-lg font-bold">Recent</span>
                                        </div>
                                    </div>
                                    <div className="flex h-[70%] md:h-[190.74px] flex-col items-center bg-[#0A0A0A] p-2 w-full">
                                        <div className="p-1 md:p-[9.35px]">
                                            <p className="text-[14px] md:text-[26.18px] font-bold text-center leading-tight">
                                                {card.title}
                                            </p>
                                        </div>
                                        <div className="p-1 md:p-[9.35px]">
                                            <p className="text-white font-['Space_Grotesk'] text-sm md:text-[21.505px] font-normal text-center">
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </AuthenticatedLayout>
        </>
    );
}

export default Events;