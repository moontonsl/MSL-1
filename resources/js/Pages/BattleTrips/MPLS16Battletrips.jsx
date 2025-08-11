import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBattleTrips.jsx";
import { Helmet } from 'react-helmet';

const MPL16Battletrips = () => {
    return (
        <AuthenticatedLayout>
            <Helmet>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>
            <Head title="MPLS16 Battle Trips" />
        </AuthenticatedLayout>
    );
};

export default MPL16Battletrips;

