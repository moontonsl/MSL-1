import { useState, useEffect } from 'react';
import styles from './InfoSection.module.scss';
import picture1 from '../assets/picture1.png';
import picture2 from '../assets/picture2.png';
import picture3 from '../assets/picture3.png';
import sunImage from '../assets/Effect-copy-3.png';

const stats = [
    { value: '8,000', label: 'STUDENT PLAYERS' },
    { value: '201', label: 'STUDENT LEADERS' },
    { value: '74', label: 'UNIVERSITY COMMUNITIES' },
    { value: '35', label: 'PARTNERED SCHOOL ORGS' }
];

const imageTextPairs = [
    { image: picture1, text: 'CREATE' },
    { image: picture2, text: 'SUPPORT' },
    { image: picture3, text: 'LEAD' }
];

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === imageTextPairs.length - 1 ? 0 : prevIndex + 1
            );
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={`${styles.infoSection}`}>

            <div className="relative overflow-hidden pt-16 lg:pt-40">

                {/* Top gradient overlay */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent z-0 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-[40rem] bg-gradient-to-t from-[#0a0a0a] to-transparent z-0 pointer-events-none" />
                {/* Bottom gradient overlay */}

                <div className={`${styles.infoSun} absolute opacity-10 w-full`}>
                    <img src={sunImage} alt="Sun Image" className="w-full object-contain" />
                </div>


                <div className="container mx-auto px-4 gap-16 grid mb-20 scale">
                    <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold text-center w-full z-10 leading-tight">
                        MOONTON STUDENT LEADER <br className="hidden lg:block" />PHILIPPINES
                    </h1>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full gap-6 sm:gap-8 z-10">
                        {stats.map(({ value, label }, index) => (
                            <div key={index} className="text-center grid gap-2 sm:gap-4">
                                <div className={`text-4xl sm:text-5xl md:text-6xl font-bold ${styles.infoHead}`}>
                                    {value}
                                </div>
                                <div className="text-lg sm:text-xl font-semibold scale">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>


            <div className={`${styles.infoAbout}`}>
                <div className="grid xl:grid-cols-2 mx-auto min-h-[564px]">
                    <div className={`${styles.infoImageWrapper} aspect-[16/9] xl:aspect-auto`}>
                        <img
                            src={imageTextPairs[currentIndex].image}
                            alt="Moonton Student Leader"
                            className={`${styles.infoImage}`}
                        />
                    </div>
                    <div className="p-4 lg:p-10 xl:p-24 flex flex-col gap-4 justify-center">
                        <h2 className={`text-[clamp(2rem,6vw,3rem)] font-bold leading-tight`}>
                            HERE AT <br className={`hidden xl:block`} />
                            MOONTON STUDENT LEADER <br className={`hidden md:block`} />
                            PHILIPPINES we <span
                            className={`${styles.infoHighlight} text-brand`}>
                                {imageTextPairs[currentIndex].text}
                            </span>
                        </h2>

                        <p className="text-lg">
                            Moonton Student Leaders (MSL) Philippines is an organization of student-gamers from
                            different colleges and universities all over the country. Under the supervision of Moonton
                            Technologies Philippines, Inc., the program was developed to promote the growth of Mobile
                            Legends: Bang Bang communities in schools while advocating for academic excellence.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
