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

            <nav className={styles.mainNav}>
                <ul className={styles.mainNavList}>
                    {user ? <>
                        <li className={`${currentRoute.includes('/availabilities') ? styles.active : styles.nonActive}`}>
                            <Link href='/availabilities' className={styles.mainNavLink}>
                                Mein Bereich
                            </Link>
                        </li>
                        <li className={`${currentRoute.includes('/activities') ? styles.active : styles.nonActive}`}>
                            <Link href='/activities' className={styles.mainNavLink}>
                                Planung
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => logout()} className="btn btn-cta btn-icon">
                                <FaSignOutAlt />  Logout
                            </button>
                        </li>
                    </> : <>
                        <li>
                            <Link className="btn btn-cta btn-icon" href='/account/login'>
                                <FaSignInAlt /> Login
                            </Link>
                        </li>
                    </>}

                </ul>
            </nav>
        </header>
    )
}
