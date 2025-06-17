// Components/HeroCarousel.tsx
import styles from "./HeroSection.module.scss";
import EmblaCarousel from "@/Components/EmblaCarousel/EmblaCarousel.jsx";

const HeroCarousel = () => {
    const OPTIONS = {loop: true}

    const SLIDES = [
        "https://scontent-mnl1-1.xx.fbcdn.net/v/t39.30808-6/506016802_122154481406393655_1738823295892246501_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeFzdevj4MHyshEMpZtZESHbTxDGP9CDi99PEMY_0IOL3-sr_46w2beEGd5F3f6ZqUKxoOQ2vt9V011lervg20OI&_nc_ohc=EN_IrJBpKn4Q7kNvwH_mCSg&_nc_oc=Admo2jCAbwvRFRZLt1ILUbas450VHGe5wHQSib2t_gRhRx7_an9H80nE37CwmzgEmIs&_nc_zt=23&_nc_ht=scontent-mnl1-1.xx&_nc_gid=bsLW7rpVadL_MXpxWemwzA&oh=00_AfPh-QFpdM14LbjBLRyHWqRAtBCUzOYY4S00a0mQjpX-IA&oe=68577D36",
        "https://scontent-mnl1-2.xx.fbcdn.net/v/t39.30808-6/506715225_122154905444393655_7576718058029348242_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHC5DbZq7cEnap7ZApwJVaWEWjnyMReCZYRaOfIxF4Jlibjtj2iKHUG6mzg_ailwZu-C7QWKpfRnoaAzwdGBmBK&_nc_ohc=V99zGtF04UEQ7kNvwFqcDXv&_nc_oc=AdmMjqBa7xLRUvacSu65-IL676XFOvuITa4nTcy3u2ikHtdGrktgpfA0q-4VRfpg7rw&_nc_zt=23&_nc_ht=scontent-mnl1-2.xx&_nc_gid=qzAPJb7OtjwAvtsbYoo3dQ&oh=00_AfPN7eLGM-bAZak_hCn2M7FPRQNymFAKsp3VNq5_cVx1jw&oe=6857777B",
        "https://scontent-mnl1-1.xx.fbcdn.net/v/t39.30808-6/506851911_122154919472393655_3733182115298788243_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGJ0yOgKIR541j_hb034f61_Ws4B_rHm7_9azgH-sebv30Z3Ph1_cvs_wOKRrUtK0Uh3TucERQYLGjIYFcS6_Pj&_nc_ohc=sWx2d4jbs54Q7kNvwHUe5Oa&_nc_oc=AdmFRRVGxddQBJwA0HFSjv1dZlXYDdKiy7kO2dGh4HI7oXys01E5bhdlHwIrW8McpKg&_nc_zt=23&_nc_ht=scontent-mnl1-1.xx&_nc_gid=6-PW0pqk_qgBqmUiX-WQWg&oh=00_AfNtwy_QkdtFJzdweMfUBsHp3xAegF3beM4-33lwNTWJvQ&oe=68575E08",
                    
    ]


    return (
        <EmblaCarousel slides={SLIDES} options={OPTIONS}/>
    );
};

export default HeroCarousel;
