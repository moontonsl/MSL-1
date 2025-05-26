import { useNavigate } from "react-router-dom";
import styles from "./HeroSection.module.scss";
import HeroCarousel from "./HeroCarousel.jsx";

import minImg from "@/pages/Home/assets/hero/minsi.png";
import laylaImg from "@/pages/Home/assets/hero/layla.png";
import badingImg from "@/pages/Home/assets/hero/bada.png";

const HeroSection = () => {
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
    };

    const heroBoxes = [
        {
            path: "/network",
            title: "Network",
            img: minImg,
            imgPosition: "object-center",
        },
        {
            path: "/buff-&-support",
            title: (
                <>
                    Buffs <br className="hidden xl:block" /> & Supports
                </>
            ),
            img: laylaImg,
            imgPosition: "object-center",
        },
        {
            path: "/student-leader",
            title: "STUDENT LEADER",
            img: badingImg,
            imgPosition: "object-center",
        },
    ];


    return (
        <div className={styles.heroSection}>
            <div className={styles.heroWrapper}>
                <div className={`${styles.heroGrid} overflow-hidden`}>
                    <HeroCarousel />

                    <div className={styles.bentoBox}>
                        {heroBoxes.map((box, index) => (
                            <div
                                key={index}
                                onClick={() => handleClick(box.path)}
                                className={`${styles.box} group relative flex items-center lg:items-end overflow-hidden cursor-pointer`}
                            >
                                <div className="absolute p-4 lg:p-8 uppercase text-md md:text-2xl lg:text-5xl font-bold italic z-10 text-white">
                                    {box.title}
                                </div>
                                <div className="h-full w-full relative z-0">
                                    <img
                                        src={box.img}
                                        alt=""
                                        className={`aspect-video hidden lg:block h-[500px] w-full object-cover absolute transition-transform duration-500 group-hover:scale-110 ${box.imgPosition}`}
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HeroSection;
