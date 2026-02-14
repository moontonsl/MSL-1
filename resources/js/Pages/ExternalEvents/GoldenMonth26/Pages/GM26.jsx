import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";

// Background (optional — remove if not needed)
import BG from "../Assets/Images/BG.png";

// Placeholder Images
import GMImage1 from "../Assets/Images/FFBattleEmote.png";
import GMImage2 from "../Assets/Images/FFFreedomWall.png";
import GMLogo from "../Assets/Images/FF2xMSL_logo.png";

export default function GM26() {
    return (
        <AuthenticatedLayout>
            <Head title="GM26 Page" />
            <Helmet>
                <title>GM26</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            <div className=" relative z-50 min-h-screen flex flex-col items-center justify-start text-white p-4 pt-12 sm:pt-20 font-['Montserrat'] bg-cover bg-center bg-no-repeat " style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed", }} >
                {/* Logo */}
                <div className="text-center mb-2 sm:mb-16">
                    <Link href="/GM26">
                        <img
                            src={GMLogo}
                            alt="GM26 Logo"
                            className="w-56 sm:w-64 lg:w-72 mx-auto drop-shadow-lg cursor-pointer"
                        />
                    </Link>
                </div>

                {/* 2 Image Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 place-items-center w-full max-w-4xl">
                    <Link href="/GM26Comm">
                        <img
                            src={GMImage1}
                            alt="Battle Emote"
                            className="w-56 sm:w-64 lg:w-72 hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                    </Link>

                    <Link href="/GM26Network">
                        <img
                            src={GMImage2}
                            alt="Freedom Wall"
                            className="w-56 sm:w-64 lg:w-72 hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
