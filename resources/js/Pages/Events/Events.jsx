import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEvents.jsx";
import styles from './events.module.scss';

function Events({ events = [] }) {

    return (
        <>
            <Head title="Events" />
            <AuthenticatedLayout>
                <main className="relative text-center mb-12 pt-4 px-4 sm:px-4 md:px-6 lg:px-0 lg:mx-auto max-w-[1440px]">
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
                    className="mx-auto flex flex-col lg:flex-row justify-end items-start gap-5 flex-shrink-0 rounded-[30px] mt-[-30px]
                    bg-[rgba(36,36,36,0.8)] shadow-[inset_-30px_-30px_80px_#141414,inset_30px_20px_100px_#0A0A0A,-30px_-30px_80px_rgba(255,255,255,0.14),30px_30px_80px_rgba(243,199,24,0.14)]
                    w-[calc(100%-20px)] mx-auto lg:w-full lg:max-w-[1418px] lg:mx-auto"
                    style={{ maxWidth: '1418px', width: '100%', minHeight: '200px', padding: '20px 30px' }}
                    >
                    {/* TEXT + IMAGE ROW ONLY ON MOBILE */}
                    <div className="flex flex-row lg:hidden items-center justify-between w-full mb-0 pb-0 gap-2 leading-none px-1">
                    {/* Title Left - Larger Text */}
                    <h3 className="text-white text-left font-['Montserrat'] text-[20px] font-bold leading-[130%] mb-0 pb-0">
                        MSL Collegiate Cup (MCC)
                    </h3>

                    {/* Image Right - Shifted Slightly Left */}
                    <img
                        src="/mcclogo.png"
                        alt="MCC Logo"
                        className="w-[80px] h-[80px] object-contain rounded-xl mb-0 pb-0 translate-x-[-10px]"
                    />
                    </div>

                    {/* DESKTOP LAYOUT: TITLE + IMAGE (unchanged) */}
                    <div className="hidden lg:flex justify-between items-start w-full lg:p-5">
                        {/* Text Content (left on desktop) */}
                        <div className="flex flex-col justify-start items-start flex-1 p-0 h-auto lg:h-auto mt-0 order-2 lg:order-first">
                        <h3 className="text-white text-left font-['Montserrat'] text-[30px] font-bold leading-[140%] w-full lg:w-[622px]">
                            MSL Collegiate Cup (MCC)
                        </h3>

                        <div className="p-0 w-full">
                            <h4 className="text-white text-left font-['Space Grotesk'] text-[20px] font-bold leading-[140%]">What is MCC?</h4>
                            <p className="text-white text-left font-['Space Grotesk'] text-[18px] font-normal leading-[140%] lg:max-w-[1000px]">
                            MSL Collegiate Cup (MCC) is a platform for collegiate players to showcase their skills in the national stage.
                            MCC is a potential franchise that both promotes the participation of MSL Communities and accredited organizations.
                            </p>
                        </div>

                        <div className="p-0 pt-2 w-full">
                            <h4 className="text-white text-left font-['Space Grotesk'] text-[20px] font-bold leading-[140%]">Who can join MCC?</h4>
                            <p className="text-white text-left font-['Space Grotesk'] text-[18px] font-normal leading-[140%] lg:max-w-[900px]">
                            Aspiring Student-Gamers from MSL Communities and MSL Network Organizations are allowed to join.
                            </p>
                        </div>

                        <div className="mt-4">
                            <Link href="/mcc">
                                <div className="flex w-[190px] h-[58px] justify-center items-center gap-[5.7px] rounded-full border border-white bg-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300">
                                <span className="text-white font-['Space Grotesk'] text-[18.5px] font-bold leading-[140%]">Learn more</span>
                                </div>
                            </Link>
                        </div>
                        </div>

                        {/* Image (right on desktop) */}
                        <div className="flex justify-center items-center flex-shrink-0 mt-0 lg:mt-0 w-full lg:w-auto order-1 lg:order-last">
                        <div className="flex w-full md:w-[344.467px] p-[14.697px] flex-col justify-center items-center">
                            <div className="flex p-[0px_22.046px] flex-col justify-center items-start gap-[9.186px] self-stretch">
                            <img src="/mcclogo.png" alt="MCC Logo" className="w-full h-[250px] object-contain rounded-xl" />
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* MOBILE BODY TEXT BELOW IMAGE + TITLE */}
                    <div className="flex flex-col lg:hidden mt-[-10px] pt-0">

                        <div className="p-1 w-full">
                        <h4 className="text-white text-left font-['Space Grotesk'] text-[13px] font-bold leading-[140%]">What is MCC?</h4>
                        <p className="text-white text-left font-['Space Grotesk'] text-[11px] font-normal leading-[140%]">
                            MSL Collegiate Cup (MCC) is a platform for collegiate players to showcase their skills in the national stage.
                            MCC is a potential franchise that promotes participation of the MSL Communities and accredited organizations.
                        </p>
                        </div>
                        <div className="p-1 w-full">
                        <h4 className="text-white text-left font-['Space Grotesk'] text-[13px] font-bold leading-[140%]">Who can join MCC?</h4>
                        <p className="text-white text-left font-['Space Grotesk'] text-[11px] font-normal leading-[140%]">
                            Aspiring Student-Gamers from MSL Communities and MSL Network Organizations are allowed to join.
                        </p>
                        </div>
                        <div className="p-1 mt-2">
                        <Link href="/mcc">
                            <div className="flex w-[150px] h-[45px] justify-center items-center gap-1 rounded-full border border-white bg-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300">
                                <span className="text-white font-['Space Grotesk'] text-base font-bold leading-[140%]">Learn more</span>
                            </div>
                        </Link>
                        </div>
                    </div>
                    </section>




                    {/* Other MSL Events Section */}
                    <section className="mx-auto flex flex-col items-center flex-shrink-0 py-4" style={{ maxWidth: '1418px' }}>
                        {/* Title */}
                        <div className="flex w-full px-4 lg:px-0 items-center gap-2 md:gap-9">
                            <h2 className="text-white text-left font-['Montserrat'] text-[20px] md:text-[30px] font-bold leading-[140%] w-full">
                                OTHER MSL EVENTS
                            </h2>
                        </div>

                        {/* Cards Grid: 2 columns on mobile, 3 columns on desktop with centering for odd last card */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 lg:gap-y-5 justify-items-center w-full px-2 md:px-0 pt-4">
                            {events.map((event, index) => (
                                <Link href={`/Events/${event.id}`} key={event.id}>
                                <div
                                    className={`
                                        flex flex-col justify-center items-center bg-[rgba(36,36,36,0.8)] shadow-[inset_-30px_-30px_80px_#141414,inset_30px_20px_100px_#0A0A0A,-30px_-30px_80px_rgba(255,255,255,0.14),30px_30px_80px_rgba(243,199,24,0.14)] overflow-hidden w-full max-w-[463.68px]
                                        h-[180px] md:h-[462.825px] cursor-pointer hover:shadow-[inset_-30px_-30px_80px_#141414,inset_30px_20px_100px_#0A0A0A,-30px_-30px_80px_rgba(255,255,255,0.2),30px_30px_80px_rgba(243,199,24,0.2)] transition-all duration-300
                                        ${
                                            // Conditional centering for the last odd card on mobile only
                                            (events.length % 2 === 1 && index === events.length - 1)
                                            ? 'col-span-1 mx-auto' 
                                            : ''
                                        }
                                    `}
                                >
                                    <div
                                            className="
                                                flex flex-col items-center flex-1 self-stretch
                                                bg-no-repeat bg-center relative
                                                h-[80px] md:h-[280px]
                                                px-0 pt-1 md:pt-0
                                                bg-contain md:bg-cover
                                                p-[10px] md:p-0
                                            "
                                            style={{
                                                backgroundImage: `url(/images/MCC/Events/${event.event_logo})`,
                                                backgroundSize: '85%', // smaller on mobile
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center'
                                                }}
                                            >


                                        <div className="absolute top-3 md:top-8 left-0 flex h-5 md:h-[42.075px] px-0.5 md:px-[9.35px] justify-center items-center gap-0.5 md:gap-[9.35px] rounded-r-md md:rounded-r-[16.83px] bg-red-600">
                                            <span className="text-white font-['Space Grotesk'] text-[10px] md:text-lg font-bold">{event.event_state}</span>
                                        </div>
                                        </div>

                                        <div className="flex h-[100px] md:h-[182px] flex-col items-center w-full">
                                        <div className="pt-0">
                                            <p className="text-white text-[8px] md:text-[26.18px] font-['Space Grotesk'] font-bold text-center leading-tight">
                                            {event.event_title}
                                            </p>
                                        </div>
                                        <div className="pt-2 px-2">
                                            <p className="text-white font-['Space Grotesk'] text-[8.5px] md:text-[20.505px] font-normal text-center leading-tight md:leading-snug">
                                                {event.event_subtitle}
                                            </p>
                                            </div>
                                        </div>
                                </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </main>
            </AuthenticatedLayout>
        </>
    );
}

export default Events;