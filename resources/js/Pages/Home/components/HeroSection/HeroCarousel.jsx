// Components/HeroCarousel.tsx
import styles from "./HeroSection.module.scss";
import EmblaCarousel from "@/Components/EmblaCarousel/EmblaCarousel.jsx";

const HeroCarousel = () => {
    const OPTIONS = {loop: true}

    const SLIDES = [
        "https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/506016802_122154481406393655_1738823295892246501_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=wNVdydZ3UhUQ7kNvwH9BPIm&_nc_oc=Adlm9MSNSkZI2ApLOuULqBbyfBMqd0GMDLVjlOWlvw-ihV2FTvNWXtFIr0KWymfMkcg&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=eylLfNqhmanL05cTacKw9g&oh=00_AfNszallxFh1-WCL4wNzkUppt1w_Jo0Sb4iDb6xXmgVOZw&oe=685F6636",
        "https://scontent.fmnl4-6.fna.fbcdn.net/v/t39.30808-6/508952910_122155417934393655_5307998770228806113_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=Dg4OwP_WRO4Q7kNvwFhWv1Y&_nc_oc=AdnicvhmP84mE1Cis3ynG8J9Lz95zoj0loNJbgNNRBqDT2bCRqLEPdmVofRXcivz1Rg&_nc_zt=23&_nc_ht=scontent.fmnl4-6.fna&_nc_gid=oViYMVpu3i9aNpGgeHwd7g&oh=00_AfOR8FKMw9YMCL2VLWn-xvYb4IDW-JJM_3l2yyu54t1t5A&oe=685F4800",
        "https://scontent.fmnl4-1.fna.fbcdn.net/v/t39.30808-6/510564769_122155967066393655_6905404791905543798_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=8LY9C2_jLF8Q7kNvwEb8wMo&_nc_oc=Adk7y9Acohkopvg1eJZF_KVWzo2r29ELopwaS_zi2nNORUWhwVM51VSmNAAEeQQ5yMo&_nc_zt=23&_nc_ht=scontent.fmnl4-1.fna&_nc_gid=LtzfPw-OuQnvq2cqYSrYQA&oh=00_AfOO3trNA-CUbmDaczq6fME-Ke7yeIRTQyjVU6H6pb-_PQ&oe=685F6428",
        "https://scontent.fmnl4-4.fna.fbcdn.net/v/t39.30808-6/509429882_122155931540393655_6974629591403881574_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=LWV7yXEgkA8Q7kNvwHH_j2D&_nc_oc=Admr9_BoUcqNfecRn39Y-hQcLyf7vhrNjyD2v1DE9Rfki8CYpkzkihk_q6MVDCpzrSs&_nc_zt=23&_nc_ht=scontent.fmnl4-4.fna&_nc_gid=J78PRH_MpF3CyTz_KcDt-Q&oh=00_AfOoC9kj4jvs6Gni9HfO-6CswOgx94C0n--AJoKAQifGPQ&oe=685F55AF",
        
                    
    ]


    return (
        <EmblaCarousel slides={SLIDES} options={OPTIONS}/>
    );
};

export default HeroCarousel;
