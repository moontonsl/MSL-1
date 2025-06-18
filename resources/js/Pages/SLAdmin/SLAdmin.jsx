import MainLayout from "@/Layouts/MainLayout.jsx";
import styles from "./SLAdmin.module.scss";
import { BadgeCheck } from 'lucide-react';

import profilePic from "./assets/42ca9ea53c9f0acd1d273d2864b58719215b59f4.png"

const SLAdmin = () => {
    return (
            <MainLayout>
                <div className={styles.slAdmin}>


                    <div className={`container mx-auto px-4`}>

                        {/* profile pic */}
                        <div>
                            <img src={profilePic} alt=""/>
                        </div>

                        <div>
                            Rei Takahashi
                        </div>

                        <div className={`flex gap-1`}>
                            username <BadgeCheck />
                        </div>




                    </div>





                    <div>


                    </div>



                </div>
            </MainLayout>
    )
}

export default SLAdmin;
