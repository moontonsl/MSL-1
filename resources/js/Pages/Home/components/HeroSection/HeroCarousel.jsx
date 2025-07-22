// Components/HeroCarousel.tsx
import styles from "./HeroSection.module.scss";
import EmblaCarousel from "@/Components/EmblaCarousel/EmblaCarousel.jsx";

const HeroCarousel = () => {
    const OPTIONS = {loop: true}

    const SLIDES = [
        "https://scontent-mnl1-1.xx.fbcdn.net/v/t39.30808-6/518311050_122158853816393655_806533536874734010_n.png?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGm5SR3-wXDwV0nz22Fvmz-nQAP49fCPzGdAA_j18I_MdMAc7hnsH-m1tlcGuObO6Yrwr3dVnd84_1gy9pDX7JH&_nc_ohc=DJOj87imiuwQ7kNvwEJquFO&_nc_oc=AdmNWlXfV8qrHfgKrHojrydeNn2YX-Xof8dvi5Gb8xC-4qXcJLoycPmfaxg3It1UOtc&_nc_zt=23&_nc_ht=scontent-mnl1-1.xx&_nc_gid=Mp4bUB2GTF4BV9_uUu_sdw&oh=00_AfTn3y7o2I0s3hGBodYia8imaoObVlR4YTVhjm_ZZo758A&oe=688448AC",
        "https://scontent-mnl3-2.xx.fbcdn.net/v/t39.30808-6/517130948_1133128745510560_7992420462840618850_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHsDxe4zawohC-Aj4SoPwPwTpqvd4PM6JZOmq93g8zoljtNYng0SFSDsX9ikpWoDRJZenRL2Uzz5DxxCM6d5oXK&_nc_ohc=IjT4T10cj6sQ7kNvwGNRuXW&_nc_oc=Adln9TjGdXyFtCf0HzRj75VHtt92GkZ7VLgVgtJJz4GtiH_pHxpeH0Em2FV0Vxgd8rA&_nc_zt=23&_nc_ht=scontent-mnl3-2.xx&_nc_gid=jGmXOAj9IA6grfLQxACM_g&oh=00_AfQsOXtn-WQEhCNio6ybcvh77qY88XyMidG8lBIATjptQA&oe=68842C55",
        "https://scontent-mnl1-2.xx.fbcdn.net/v/t39.30808-6/491928506_1167419708732795_7231761326537739022_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGcteWp1TI6lsu2aN5sUccX7zAc1-i8fYbvMBzX6Lx9htWv9bace21rbvCFc8xhScS9mjiAt2nGZi9YlXaj1zZK&_nc_ohc=7cHuC8ciMtMQ7kNvwE_FYga&_nc_oc=AdmuZFGQQEjSD_d5Ve1EtPVMxDq-sV5qZxXLt3V7FeSaMB_5g22Yk3TIcSNJffiMWkI&_nc_zt=23&_nc_ht=scontent-mnl1-2.xx&_nc_gid=qH3BI7l85Dn_SZMkVQrnog&oh=00_AfSTOQoB1j5qpxbtxppawPjl1PcRYxSAlWHt2PT7775ymQ&oe=68843B06"
        
                    
    ]


    return (
        <EmblaCarousel slides={SLIDES} options={OPTIONS}/>
    );
};

export default HeroCarousel;
