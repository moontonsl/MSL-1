// components/HeroCarousel.tsx
import styles from "./HeroSection.module.scss";
import EmblaCarousel from "@/components/EmblaCarousel/EmblaCarousel.jsx";

const HeroCarousel = () => {
    const OPTIONS = {loop: true}

    const SLIDES = [
        "https://preview.redd.it/neo-beast-and-beyond-the-clouds-artwork-cr-abyssal-min-v0-eracdde1fqfb1.jpg?width=1080&crop=smart&auto=webp&s=8dd0a4ee5a6664deb1b96fd642757f3355a07ad3",
        "https://gamingonphone.com/wp-content/uploads/2025/01/Mobile-Legends-February-Kishin-Densetsu-Event-Skins-Cover-Image.jpg",
        "https://club.jollymax.com/wp-content/uploads/2025/03/tmb-mlbb-151-1024x512.webp",
        "https://en.moonton.com/upload/image/20250225/b8ee96141a725827df2096076d00ce4b.png",
    ]


    return (
        <EmblaCarousel slides={SLIDES} options={OPTIONS}/>
    );
};

export default HeroCarousel;
