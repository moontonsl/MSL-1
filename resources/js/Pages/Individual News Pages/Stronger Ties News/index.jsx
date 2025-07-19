import React from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "../../../Layouts/MainLayout";
import MCCNewsIndividualPageColumnDescription from "./description";
import NewsArticleSidebar from "../../../Components/NewsArticleSidebar";

export default function StrongerTiesNewsIndex() {
    return (
        <MainLayout>
            <Head>
                <title>Stronger Ties: Moonton Philippines, UMAK Seals Partnership</title>
                <meta name="description" content="Renewed and empowered – linkage has been created as University of Makati (UMaK) and Moonton Philippines Technologies, Inc. ties close connection" />
            </Head>
            
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
                                <MCCNewsIndividualPageColumnDescription />
                            </div>
                            
                            {/* Sidebar */}
                            <div className="lg:w-1/3 px-1">
                                <NewsArticleSidebar currentSlug="stronger-ties-moonton-umak" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
