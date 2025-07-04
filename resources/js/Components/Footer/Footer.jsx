import styles from './Footer.module.scss';
import { Link } from '@inertiajs/react';
import { Facebook, Instagram } from 'lucide-react';
import ThemeToggleButton from '../ThemeToggleButton.jsx';

const navSections = [
    {
        title: 'Explore',
        links: [
            { label: 'Events', href: '/events' },
            { label: 'News', href: '/news' },
            { label: 'Program', href: '/program' },
            { label: 'Resources', href: '/resources' }
        ]
    },
    // {
    //     title: 'About Us',
    //     links: [
    //         { label: 'Our Story', href: '/our-story' },
    //         { label: 'Team', href: '/team' },
    //         { label: 'Partnerships', href: '/partnerships' },
    //         { label: 'News & Updates', href: '/updates' }
    //     ]
    // },
    // {
    //     title: 'Join Us',
    //     links: [
    //         { label: 'SL Apply', href: '/apply' },
    //         { label: 'MCC Registration', href: '/mcc-registration' },
    //         { label: 'Network', href: '/network' }
    //     ]
    // },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms of Use', href: '/terms' }
        ]
    }
];

const Footer = () => {
    return (
        <footer className={styles.footer + ' text-white'}>
            <div className={styles.footerTop}>
                <div className={styles.footerInfo}>
                    <div className={styles.logo}>
                        <Link href="/">
                            <img src="/msl-logo.png" alt="MSL Logo" />
                        </Link>
                    </div>
                    <p>
                        This website is under the use of Moonton Student Leaders Philippines supervised and monitored by
                        the SERP Department. For inquiries and website concerns, send it to us using this link or you
                        may contact us through contact@moontonslph.org
                    </p>
                </div>
                <div className={styles.navGrid}>
                    {navSections.map((section, index) => (
                        <div key={index} className={styles.navs}>
                            <div className={styles.categoryTitle}>{section.title}</div>
                            <ul>
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.dividerWrapper}>
                <div className={styles.divider}>
                </div>
            </div>

            <div className={styles.partnered}>
                <div className={styles.partneredLogo}>
                    <Link href="/">
                        <img src="/mlbb-logo.png" alt="MSL Logo" />
                    </Link>
                </div>
                <div className={styles.partneredLogo}>
                    <Link href="/">
                        <img src="/moonton-logo.png" alt="MSL Logo" />
                    </Link>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className={styles.footerCopyright}>© 2025 — Moonton Student Leaders Philippines</div>
                <div className={styles.socials}>
                    <ThemeToggleButton />
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <Instagram size={20} />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <Facebook size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
