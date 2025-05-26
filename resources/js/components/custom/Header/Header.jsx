import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import styles from './Header.module.scss';

// Navigation links array (only main nav links)
const navLinks = [
    { name: 'Events', path: '/events' },
    { name: 'News', path: '/news' },
    { name: 'Program', path: '/program' },
    { name: 'Resources', path: '/resources' },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        <Link to="/">
                            <img src="/msl-logo.png" alt="MSL Logo" />
                        </Link>
                    </div>
                </div>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
                    <ul className={styles.navList}>
                        {navLinks.map(({ name, path }) => (
                            <li key={name}>
                                <Link to={path} onClick={() => setIsMenuOpen(false)}>
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.authButtons}>
                        <Link
                            to="/login"
                            className={styles.signInBtn}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className={styles.registerBtn}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Register
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;