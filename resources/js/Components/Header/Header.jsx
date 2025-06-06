import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import styles from './Header.module.scss';
import { MdAccountCircle } from "react-icons/md";

// Navigation links array (only main nav links)
const navLinks = [
    { name: 'Events', href: '/events' },
    { name: 'Program', href: '/program' },
    { name: 'Resources', href: '/resources' },
    { name: 'News', href: '/news' },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <header className={styles.header}>
            <div className={styles.container}>

                <div className={styles.menuButtons}>
                    <button
                        className={styles.menuButton}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className={styles.logo}>
                        <Link href="/">
                            <img src="/msl-logo.png" alt="MSL Logo" />
                        </Link>
                    </div>
                </div>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
                    <ul className={`${styles.navList} uppercase sm:text-sm`}>
                        {navLinks.map(({ name, href }) => (
                            <li key={name}>
                                <Link href={href} onClick={() => setIsMenuOpen(false)}>
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.authButtons}>
                        <Link
                            href="/login"
                            className={styles.signInBtn}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <MdAccountCircle size={40} />
                        </Link>
                        {/*<Link*/}
                        {/*    href="/register"*/}
                        {/*    className={styles.registerBtn}*/}
                        {/*    onClick={() => setIsMenuOpen(false)}*/}
                        {/*>*/}
                        {/*    Register*/}
                        {/*</Link>*/}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
