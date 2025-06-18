import MainLayout from "@/Layouts/MainLayout.jsx";
import styles from "./SLAdmin.module.scss";
import {BadgeCheck} from 'lucide-react';

import profilePic from "./assets/42ca9ea53c9f0acd1d273d2864b58719215b59f4.png"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

const SLAdmin = () => {
    return (
        <AuthenticatedLayout>
            <div className={`${styles.slAdmin}`}>

                {/* top shit */}
                <div className={`container mx-auto px-4 pt-4`}>
                    <div className={`${styles.topCard} px-4 py-6`}>
                        {/* Profile Section */}
                        <section className="flex flex-col items-center text-center mb-6">
                            <img
                                src={profilePic}
                                alt="Profile of Rei Takahashi"
                                className={`${styles.profPic} w-40 h-40 rounded-full object-cover mb-4`}
                            />
                            <h1 className="text-2xl font-semibold">Rei Takahashi</h1>
                            <div className="flex items-center gap-2 text-sm mt-1">
                                <span>username</span>
                                <BadgeCheck className={`text-[var(--border-brand-default)]`}/>
                            </div>
                        </section>

                        {/* Details Section */}
                        <section className="grid gap-1 mb-6">
                            <div>
                                <span className="opacity-50">Role:</span>
                                <span className="ml-2 font-medium">Super Admin</span>
                            </div>
                            <div>
                                <span className="opacity-50">Area:</span>
                                <span className="ml-2 font-medium">Mindanao</span>
                            </div>
                            <div>
                                <span className="opacity-50">YR. LVL:</span>
                                <span className="ml-2 font-medium">Masters</span>
                            </div>
                            <div>
                                <span className="opacity-50">Region:</span>
                                <span className="ml-2 font-medium">Celestial Five</span>
                            </div>
                        </section>

                        {/* Institution */}
                        <section className="mb-6">
                            <p className="opacity-50">Your School/Institution:</p>
                            <p className="lg:ml-2 font-medium">Central Mindanao University</p>
                        </section>

                        {/* Stats Section */}
                        <section className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="opacity-50">Verified</p>
                                <p className="text-[24px] font-semibold">12,255</p>
                            </div>
                            <div>
                                <p className="opacity-50">New</p>
                                <p className="text-[24px] font-semibold">1,000</p>
                            </div>
                            <div>
                                <p className="opacity-50">Blocked</p>
                                <p className="text-[24px] font-semibold">43</p>
                            </div>
                        </section>
                    </div>


                    {/* bottom shit */}
                    <div>


                    </div>


                </div>

            </div>
        </AuthenticatedLayout>
    )
}

export default SLAdmin;
