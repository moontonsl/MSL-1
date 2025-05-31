import { useEffect, useRef } from 'react';
import styles from "./NetworkSection.module.scss"

import Logo1 from "../assets/network/362272378_6573424279387299_5112645492191823321_n.png";
import Logo2 from "../assets/network/Copy of Rektikano White.png";
import Logo3 from "../assets/network/DESIGN 1 PNG.png";
import Logo4 from "../assets/network/FINAL.png";
import Logo5 from "../assets/network/WA Logo Official (ESPORTS USE).png";

const logos = [Logo1, Logo2, Logo3, Logo4, Logo5];

const NetworkSection = () => {
    const slideRef = useRef(null);

    useEffect(() => {
        if (slideRef.current) {
            const copy = slideRef.current.cloneNode(true);
            slideRef.current.parentNode.appendChild(copy);
        }
    }, []);

    return (
        <section className={`py-16 relative ${styles.networkSection}`}>
            {/* Top gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent z-0 pointer-events-none" />

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-0 pointer-events-none" />

            <div className={`mx-auto grid gap-10 md:gap-14 z-10`}>
                <h2 className="text-4xl text-center font-bold z-10">MSL NETWORK ORGANIZATIONS</h2>

                <div className={styles.logoSlider}>
                    <div className={styles.logosSlide} ref={slideRef}>
                        {logos.map((src, index) => (
                            <div key={index} className={styles.networkLogos}>
                                <img src={src} alt={`Logo ${index + 1}`}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NetworkSection;
