// Components/HeroCarousel.tsx
import styles from "./HeroSection.module.scss";
import EmblaCarousel from "@/Components/EmblaCarousel/EmblaCarousel.jsx";

const HeroCarousel = () => {
    const OPTIONS = {loop: true}

    const SLIDES = [
        "https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/506016802_122154481406393655_1738823295892246501_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=1M5PR81QHfgQ7kNvwGMRWiM&_nc_oc=Adl-phOREquYps65DUOQUFE1H3ZYcgpTtJSc0c61LSKdKLE_hcwBgr-Gl_gxVNTbTXg&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=nOo7M-MJGD9ac0kvrHxnOg&oh=00_AfPFtlh0R44FGfpAhKKnHCiPwUs_ogO44_P9A4PMho2xZA&oe=6865FDB6",
        "https://scontent.fmnl4-6.fna.fbcdn.net/v/t39.30808-6/512731666_122156594300393655_7853465551848230950_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=rALdenDqtpQQ7kNvwHy_vTE&_nc_oc=Adk4oTTRfys8Xp8vI6eem2bYrne7iys0bOaGQ-uZTmDK-6egNzC4RmtOve8zIb7BhZ8&_nc_zt=23&_nc_ht=scontent.fmnl4-6.fna&_nc_gid=s2T9cCfGwEhQb3607l7eFA&oh=00_AfN70dtFWZpSJaF038nDnn_5HGjjST5k8tLigFCC7_LD2g&oe=6865EDBA",
        "https://scontent.fmnl4-6.fna.fbcdn.net/v/t39.30808-6/512731666_122156594300393655_7853465551848230950_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=rALdenDqtpQQ7kNvwHy_vTE&_nc_oc=Adk4oTTRfys8Xp8vI6eem2bYrne7iys0bOaGQ-uZTmDK-6egNzC4RmtOve8zIb7BhZ8&_nc_zt=23&_nc_ht=scontent.fmnl4-6.fna&_nc_gid=s2T9cCfGwEhQb3607l7eFA&oh=00_AfN70dtFWZpSJaF038nDnn_5HGjjST5k8tLigFCC7_LD2g&oe=6865EDBA",
        
        
                    
    ]


    return (
        <EmblaCarousel slides={SLIDES} options={OPTIONS}/>
    );
};

export default HeroCarousel;
