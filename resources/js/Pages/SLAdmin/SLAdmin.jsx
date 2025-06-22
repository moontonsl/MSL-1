import styles from "./SLAdmin.module.scss";
import {BadgeCheck, ArrowDownAZ, Funnel} from 'lucide-react';

import profilePic from "./assets/42ca9ea53c9f0acd1d273d2864b58719215b59f4.png"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TableComponent from "@/Pages/SLAdmin/components/TableComponent.jsx";
import { Head } from '@inertiajs/react';

const SLAdmin = () => {
    return (
        <AuthenticatedLayout>

            {/*Title Page*/}
            <Head title="SL Admin" />
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

                                <h1 className="text-2xl font-semibold text-[clamp(1.75rem,3vw+1rem,4rem)] leading-[clamp(2rem,4vw+1rem,4.25rem)]">Rei Takahashi</h1>
                                <div className="flex items-center gap-2 xl:text-[32px] xl:leading-[32px] mt-1">
                                    <span>username</span>
                                    <BadgeCheck className={`text-[var(--border-brand-default)] w-[16px] xl:w-[32px]`}/>
                                </div>
                            </div>

                            {/* details section */}
                            <div className="grid gap-1 lg:gap-2 mb-6 md:mb-0 lg:grid-cols-2">
                                <div className="flex lg:flex-col">
                                    <div className="mr-2 opacity-50">Role:</div>
                                    <div className="font-medium xl:text-2xl">Super Admin</div>
                                </div>
                                <div className="flex lg:flex-col">
                                    <div className="mr-2 opacity-50">Area:</div>
                                    <div className="font-medium xl:text-2xl">Mindanao</div>
                                </div>
                                <div className="flex lg:flex-col">
                                    <div className="mr-2 opacity-50">YR. LVL:</div>
                                    <div className="font-medium xl:text-2xl">Masters</div>
                                </div>
                                <div className="flex lg:flex-col">
                                    <div className="mr-2 opacity-50">Region:</div>
                                    <div className="font-medium xl:text-2xl">Celestial Five</div>
                                </div>
                            </div>
                        </div>


                        {/* institution */}
                        <div className="w-full flex flex-col justify-center">
                            <p className="opacity-50 mr-2">Your School/Institution:</p>
                            <p className="font-medium xl:text-2xl">Central Mindanao University</p>


                            {/* stats */}
                            <div className="grid grid-cols-3 gap-4 text-center md:text-left mt-6 xl:mt-[48px]">
                                <div>
                                    <p className="opacity-50">Verified</p>
                                    <p className="text-2xl xl:text-5xl font-semibold">12,255</p>
                                </div>
                                <div>
                                    <p className="opacity-50">New</p>
                                    <p className="text-2xl xl:text-5xl font-semibold">1,000</p>
                                </div>
                                <div>
                                    <p className="opacity-50">Blocked</p>
                                    <p className="text-2xl xl:text-5xl font-semibold">43</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* bottom shit */}
                    <div className="mt-4 grid gap-[10px]">
                        <div className={`${styles.tableHeader} py-[12px] gap-[12px] md:gap-0 grid md:grid-cols-[50%_50%] lg:grid-cols-[60%_40%] xl:grid-cols-[70%_30%] items-center`}>
                            <div className="w-[90vw] sm:w-full overflow-x-auto custom-scrollbar">
                                <div className="flex space-x-4 py-2 whitespace-nowrap">
                                    <span className="cursor-pointer">Student Approval</span>
                                    <span className="opacity-50 cursor-pointer">Create Tournament</span>
                                    <span className="opacity-50 cursor-pointer">Tournament Bracket</span>
                                </div>
                            </div>

                            <div className="flex gap-[20px] items-center w-full justify-center md:justify-end">
                                <input
                                    className={`${styles.slInput} w-full md:max-w-[214px]`}
                                    type="text"
                                    placeholder="Search students..."
                                />

                                <div className="flex gap-[12px]">
                                    <ArrowDownAZ className="cursor-pointer"/>
                                    <Funnel className="cursor-pointer"/>
                                </div>
                            </div>
                        </div>
                        <TableComponent/>

                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    )
}

export default SLAdmin;
