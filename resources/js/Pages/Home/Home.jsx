import HeroSection from './components/HeroSection/HeroSection.jsx';
import ExperienceSection from './components/ExperienceSection.jsx';
import InfoSection from './components/InfoSection.jsx';
import NewsSection from './components/NewsSection.jsx';
import NetworkSection from './components/NetworkSection.jsx';
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
