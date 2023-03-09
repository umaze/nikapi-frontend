import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useContext } from 'react';
import Link from 'next/link';
import Search from './Search';
import AuthContext from '@/context/AuthContext';
import styles from '@/styles/Header.module.scss';

export default function Header() {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link href='/' legacyBehavior>
                    <a>Samichlaus</a>
                </Link>
            </div>

            <Search />

            <nav className={styles.mainNav}>
                <ul className={styles.mainNavList}>
                    {user ? <>
                        <li>
                            <Link className={styles.mainNavLink} href='/availabilities'>
                                Verf&uuml;gbarkeiten
                            </Link>
                        </li>
                        <li>
                            <Link className={styles.mainNavLink} href='/demands'>
                                Veranstaltungen
                            </Link>
                        </li>
                        <li>
                            <Link className={styles.mainNavLink} href='/activities'>
                                Eins&auml;tze
                            </Link>
                        </li>
                        <li>
                            <Link className={styles.mainNavLink} href='/account/dashboard'>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => logout()} className="btn-secondary btn-icon">
                                <FaSignOutAlt />  Logout
                            </button>
                        </li>
                    </> : <>
                        <li>
                            <Link className="btn-secondary btn-icon" href='/account/login'>
                                <FaSignInAlt /> Login
                            </Link>
                        </li>
                    </>}

                </ul>
            </nav>
        </header>
    )
}
