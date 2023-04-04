import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useContext } from 'react';
import Link from 'next/link';
import Search from './Search';
import AuthContext from '@/context/AuthContext';
import styles from '@/styles/Header.module.scss';
import {useRouter} from "next/router";

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();
    const currentRoute = router.pathname;

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
                            <Link href='/availabilities' className={`${styles.mainNavLink} ${currentRoute.endsWith('/availabilities') ? styles.active : styles.nonActive}`}>
                                Mein Bereich
                            </Link>
                        </li>
                        <li>
                            <Link href='/activities' className={`${styles.mainNavLink} ${currentRoute.endsWith('/activities') ? styles.active : styles.nonActive}`}>
                                Planung
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
