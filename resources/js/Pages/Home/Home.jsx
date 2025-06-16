import HeroSection from './Components/HeroSection/HeroSection.jsx';
import ExperienceSection from './Components/ExperienceSection.jsx';
import InfoSection from './Components/InfoSection.jsx';
import NewsSection from './Components/NewsSection.jsx';
import NetworkSection from './Components/NetworkSection.jsx';
import MainLayout from '@/Layouts/MainLayout.jsx';
import { Head, Link } from '@inertiajs/react';

const Home = () => {
    return (
        <MainLayout>
            <Head title="Home" />
            <div className={`pb-16`}>
                <HeroSection />
                <InfoSection />
                <NetworkSection />
                <ExperienceSection />
                <NewsSection />
            </div>
        </MainLayout>
    );
};

export default Home;
