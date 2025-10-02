import styles from "./SLAdmin.module.scss";
import {BadgeCheck} from 'lucide-react';

import profilePic from "./assets/42ca9ea53c9f0acd1d273d2864b58719215b59f4.png";
import rankPIC from "./assets/MythicIcon.png";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, usePage } from '@inertiajs/react';
import { useState } from "react";

import EditProfileModal from "./EditProfileModal.jsx"; 



const SLStudent = () => {
    const { user, verified, new: newUsers, blocked } = usePage().props;

    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(user);

    
    return (
        <AuthenticatedLayout>

            {/*Title Page*/}
            <Head title="Student Portal" />

            <div className={`${styles.slAdmin}`}>
                <div className={`px-4 pt-4 pb-8 container mx-auto max-w-[1536px]`}>
                    {/* top shit */}
                    <div className={`${styles.topCard} px-4 py-6 md:py-10 grid md:grid-cols-[25%_40%_35%] xl:min-h-[365px]`}>
                        {/* profile section */}
                        <div className="flex justify-center items-center">
                                <div className="bg-gradient-to-tr from-[#D4AF37] to-[#FFFACD] p-[8px] rounded-full">
                                    <div className="bg-neutral-900 rounded-full">
                                        <img
                                            src={profilePic}
                                            alt="Profile"
                                            className="w-[clamp(10rem,12vw,15rem)] h-[clamp(10rem,12vw,15rem)] rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                        </div>

                        <div className="w-full flex flex-col justify-center gap-6 xl:gap-[32px]">
                            <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">

                                <h1 className="text-2xl font-semibold text-[clamp(1.75rem,3vw+1rem,4rem)] leading-[clamp(2rem,4vw+1rem,4.25rem)]">
                                    {user.name} {user.surname}
                                </h1>
                                <div className="flex items-center gap-2 xl:text-[32px] xl:leading-[32px] mt-1">
                                    <span>{user.username}</span>
                                    <BadgeCheck className={`text-[var(--border-brand-default)] w-[16px] xl:w-[32px]`}/>
                                </div>
                            </div>

                            {/* details section */}
                            <div className="grid gap-1 lg:gap-2 mb-6 md:mb-0 lg:grid-cols-2">
                                <div className="flex lg:flex-col">
                                    <div className="mr-2 opacity-50">ROLE:</div>
                                    <div className="font-medium xl:text-2xl">
                                        {user.role}
                                    </div>
                                </div>
                                <div className="flex lg:flex-col">
                                    <div className="mr-2 opacity-50">AREA:</div>
                                    <div className="font-medium xl:text-2xl">
                                        {user.island}
                                    </div>
                                </div>
                                <div className="flex lg:flex-col">
                                    <div className="mr-2 opacity-50">YR. LVL:</div>
                                    <div className="font-medium xl:text-2xl">Masters</div>
                                </div>
                                <div className="flex lg:flex-col">
                                    <div className="mr-2 opacity-50">REGION:</div>
                                    <div className="font-medium xl:text-2xl">
                                        {user.region}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                
            </div>

            {/* ✅ Render modal when true */}
            {showEditProfileModal && (
                <EditProfileModal
                user={selectedUser}
                onClose={() => setShowEditProfileModal(false)}
                />
            )}

        </AuthenticatedLayout>
    )
}
export default SLStudent;