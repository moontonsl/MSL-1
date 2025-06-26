import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEvents.jsx";
import styles from './events.module.scss';


function Events() {
    return (
        <>
        <Head title="Events" />
        <AuthenticatedLayout>
            <main className="relative text-center mb-12 pt-4">
                {/* MSL Highlight Event Section */}
                <section className="w-full flex flex-col items-center text-center mb-12">
                    <h2 className={styles.title}>
                        MSL HIGHLIGHT EVENT
                    </h2>
                    <p style={{ color: '#FFF', fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontStyle: 'italic', fontWeight: 500, lineHeight: '140%', marginTop: '0px' }} >
                    Join us for an exciting journey of unforgettable moments!
                    </p>
                </section>

                {/* MSL Collegiate Cup (MCC) Section */}
                <section className="mx-auto flex justify-end items-start gap-5 flex-shrink-0 rounded-[30px] mt-[-30px] bg-[rgba(36,36,36,0.8)] shadow-[inset_-30px_-30px_80px_#141414,inset_30px_20px_100px_#0A0A0A,-30px_-30px_80px_rgba(255,255,255,0.14),30px_30px_80px_rgba(243,199,24,0.14)]" style={{  maxWidth: '1418px', width: '100%',  minHeight: '460px', padding: '30px 50px' }} >                
                    {/* First Div */}
                    <div style={{ display: 'flex', height: '395px', padding: '0px 0px', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', flex: '1 0 0' }} >
                        {/* Content for first div */}
                        <div style={{ display: 'flex', padding: '9px', alignItems: 'flex-start', gap: '9px' }} >
                            <h3 style={{ color: '#FFF', textAlign: 'left', fontFamily: 'Montserrat, sans-serif', fontSize: '40px', fontStyle: 'normal', fontWeight: 700, lineHeight: '140%', width: '622px' }} >
                                MSL Collegiate Cup (MCC)
                            </h3>
                        </div>
                        <div style={{ display: 'flex', padding: "9px", alignItems: 'flex-start', gap: "9px", alignSelf: "stretch" }} >
                            <h4 style={{ color: '#FFF', textAlign: 'left', fontFamily: '"Space Grotesk", sans-serif', fontSize: '20px', fontStyle: 'normal', fontWeight: 700, lineHeight: '140%', }} >
                                What is MCC?
                            </h4>
                        </div>
                        <div style={{ display: 'flex', padding: "9px", alignItems: 'flex-start', gap: "9px", alignSelf: "stretch" }} >
                            <p style={{ color: '#FFF', textAlign: 'left', fontFamily: '"Space Grotesk", sans-serif', fontSize: '18px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%', width: '911px', }} >
                                MSL Collegiate Cup (MCC) is a platform for collegiate players to showcase their skills in the national
                                stage. MCC is a potential franchise that both promote the participation of the MSL Communities and
                                accredited organization across the country.
                            </p>
                        </div>
                        <div style={{ display: 'flex', padding: "9px", alignItems: 'flex-start', gap: "9px", alignSelf: "stretch" }} >
                            <h4 style={{ color: '#FFF', textAlign: 'left', fontFamily: '"Space Grotesk", sans-serif', fontSize: '20px', fontStyle: 'normal', fontWeight: 700, lineHeight: '140%', }} >
                                Who can join MCC?
                            </h4>
                        </div>
                        <div style={{ display: 'flex', padding: "9px", alignItems: 'flex-start', gap: "9px", alignSelf: "stretch" }} >
                            <p style={{ color: '#FFF', textAlign: 'left', fontFamily: '"Space Grotesk", sans-serif', fontSize: '18px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%', width: '911px', }} >
                                Aspiring Student-Gamers from MSL Communities and MSL Network Organizations are allowed to join.
                            </p>
                        </div>
                        <div style={{ display: 'flex', width: '944px', flexDirection: 'column', alignItems: 'flex-start' }} >
                            <div style={{ display: 'flex', padding: '9px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '9px' }} >
                                {/* Inner button-like div */}
                                <div style={{ display: 'flex', width: '190.451px', height: '57.713px', padding: '5.771px', justifyContent: 'center', alignItems: 'center', gap: '5.771px', borderRadius: '57.712px', border: '1.731px solid #FFF', background: 'rgba(255, 255, 255, 0.05)', color: '#FFF', fontFamily: 'Poppins, sans-serif', fontSize: '16px' }} >
                                    <span style={{ color: '#FFF', fontFamily: '"Space Grotesk", sans-serif', fontSize: '18.468px', fontStyle: 'normal', fontWeight: 700, lineHeight: '140%' , cursor: "pointer"}} >
                                        Learn more
                                    </span>
                                </div>
                            </div>
                        </div>
                            
                    </div>

                    {/* Second Div */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '0 0 auto' }}>
                        <div style={{ display: 'flex', width: '344.467px', padding: '14.697px 0px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '7.349px' }}>
                        <div style={{ display: 'flex', padding: '0px 22.046px', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: '9.186px', alignSelf: 'stretch' }}>
                            <img src="/mcclogo.png" alt="MCC Logo" style={{ width: '100%', height: '350px', objectFit: 'contain' , borderRadius: '12px' }} />
                        </div>
                        </div>
                    </div>
                </section>

                {/* New Section */}
                <section className="mx-auto flex flex-col items-center flex-shrink-0" style={{ maxWidth: '1618px', width: '100%', height: '1831px', padding: '0px 0px', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }} >
                {/* Title */}
                <div style={{ display: 'flex', width: '1453.4px', padding: '9px', alignItems: 'center', gap: '9px' }}>
                    <h2 style={{ color: '#FFF', textAlign: 'left', fontFamily: 'Montserrat, sans-serif', fontSize: '57.6px', fontStyle: 'normal', fontWeight: 700, lineHeight: '140%', width: '100%' }}>
                    OTHER MSL EVENTS
                    </h2>
                </div>

                {/* Cards Row */}
                <div style={{ display: 'flex', gap: '18.7px', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', width: '100%', paddingTop: '30px' }}>
                    {/* CARD 1 */}
                    <div style={{ display: 'flex', width: '463.68px', height: '462.825px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '18.7px', background: '#FFF', boxShadow: '0px 0px 10.379px -2.805px #F2C21A', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', padding: '36.465px 390.831px 193.545px 0px', alignItems: 'center', flex: '1 0 0', alignSelf: 'stretch', background: '#000 url("/frame292.png") center center / contain no-repeat', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50px', left: 0, display: 'flex', height: '42.075px', padding: '9.35px', justifyContent: 'center', alignItems: 'center', gap: '9.35px', borderRadius: '0px 16.83px 16.83px 0px', background: '#F00' }}>
                            <span style={{ color: '#FFF', fontFamily: '"Space Grotesk", sans-serif', fontSize: '18.7px', fontWeight: 700 }}>Recent</span>
                        </div>
                        </div>
                        <div style={{ display: 'flex', height: '190.74px', flexDirection: 'column', alignItems: 'center', background: '#0A0A0A' }}>
                        <div style={{ padding: '9.35px' }}>
                            <p style={{ color: '#FFF', fontFamily: '"Space Grotesk", sans-serif', fontSize: '26.18px', fontWeight: 700, textAlign: 'center' }}>MPL S15 University Watch Fest</p>
                        </div>
                        <div style={{ padding: '9.35px' }}>
                            <p style={{ color: '#FFF', fontFamily: '"Space Grotesk", sans-serif', fontSize: '21.505px', fontWeight: 400, textAlign: 'center' }}>
                            The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.
                            </p>
                        </div>
                        </div>
                    </div>

                    {/* CARD 2 — same */}
                    <div style={{ display: 'flex', width: '463.68px', height: '462.825px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '18.7px', background: '#FFF', boxShadow: '0px 0px 10.379px -2.805px #F2C21A', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', padding: '36.465px 390.831px 193.545px 0px', alignItems: 'center', flex: '1 0 0', alignSelf: 'stretch', background: '#000 url("/frame292.png") center center / contain no-repeat', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50px', left: 0, display: 'flex', height: '42.075px', padding: '9.35px', justifyContent: 'center', alignItems: 'center', gap: '9.35px', borderRadius: '0px 16.83px 16.83px 0px', background: '#F00' }}>
                            <span style={{ color: '#FFF', fontFamily: '"Space Grotesk", sans-serif', fontSize: '18.7px', fontWeight: 700 }}>Recent</span>
                        </div>
                        </div>
                        <div style={{ display: 'flex', height: '190.74px', flexDirection: 'column', alignItems: 'center', background: '#0A0A0A' }}>
                        <div style={{ padding: '9.35px' }}>
                            <p style={{ color: '#FFF', fontFamily: '"Space Grotesk", sans-serif', fontSize: '26.18px', fontWeight: 700, textAlign: 'center' }}>MPL S15 University Watch Fest</p>
                        </div>
                        <div style={{ padding: '9.35px' }}>
                            <p style={{ color: '#FFF', fontFamily: '"Space Grotesk", sans-serif', fontSize: '21.505px', fontWeight: 400, textAlign: 'center' }}>
                            The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.
                            </p>
                        </div>
                        </div>
                    </div>

                    {/* CARD 3 — same */}
                    <div style={{ display: 'flex', width: '463.68px', height: '462.825px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '18.7px', background: '#FFF', boxShadow: '0px 0px 10.379px -2.805px #F2C21A', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', padding: '36.465px 390.831px 193.545px 0px', alignItems: 'center', flex: '1 0 0', alignSelf: 'stretch', background: '#000 url("/frame292.png") center center / contain no-repeat', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50px', left: 0, display: 'flex', height: '42.075px', padding: '9.35px', justifyContent: 'center', alignItems: 'center', gap: '9.35px', borderRadius: '0px 16.83px 16.83px 0px', background: '#F00' }}>
                            <span style={{ color: '#FFF', fontFamily: '"Space Grotesk", sans-serif', fontSize: '18.7px', fontWeight: 700 }}>Recent</span>
                        </div>
                        </div>
                        <div style={{ display: 'flex', height: '190.74px', flexDirection: 'column', alignItems: 'center', background: '#0A0A0A' }}>
                        <div style={{ padding: '9.35px' }}>
                            <p style={{ color: '#FFF', fontFamily: '"Space Grotesk", sans-serif', fontSize: '26.18px', fontWeight: 700, textAlign: 'center' }}>MPL S15 University Watch Fest</p>
                        </div>
                        <div style={{ padding: '9.35px' }}>
                            <p style={{ color: '#FFF', fontFamily: '"Space Grotesk", sans-serif', fontSize: '21.505px', fontWeight: 400, textAlign: 'center' }}>
                            The MPL PH Watch Fest is an event where students come together to experience the thrilling action of MLBB Tournaments.
                            </p>
                        </div>
                        </div>
                    </div> 
                </div>
                </section>
            </main>
        </AuthenticatedLayout>
        </>
    );
}

export default Events;