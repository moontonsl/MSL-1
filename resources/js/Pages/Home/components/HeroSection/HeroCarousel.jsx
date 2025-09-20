// Components/HeroCarousel.tsx
import styles from "./HeroSection.module.scss";
import EmblaCarousel from "@/Components/EmblaCarousel/EmblaCarousel.jsx";

const HeroCarousel = () => {
    const OPTIONS = {loop: true}

    const SLIDES = [
        "/images/Carousel/N1.jpg",
        "/images/Carousel/N2.jpg",
        "/images/Carousel/N3.jpg",
    ]


    return (
        <EmblaCarousel slides={SLIDES} options={OPTIONS}/>
    );
};

export default HeroCarousel;
