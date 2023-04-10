import {FaSignInAlt, FaSignOutAlt} from 'react-icons/fa';
import {useContext} from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import styles from '@/styles/Header.module.scss';
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {setActivatedNavMenu} from "@/store/applicationSlice";
import {MAIN_MENU} from "@/config/index";

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const dispatch = useDispatch();
    const router = useRouter();
    const currentRoute = router.pathname;

    const checkActivatedRoute = routes => {
        return routes.some(route => currentRoute.endsWith(route));
    };

    const handleSelectMenu = menu => {
        dispatch(setActivatedNavMenu(menu));
    }

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
                        <li className={`${checkActivatedRoute(['/me']) ? styles.active : styles.nonActive}`}>
                            <Link
                                href='/availabilities/me'
                                className={styles.mainNavLink}
                                onClick={() => handleSelectMenu(MAIN_MENU[0].id)}>
                                Mein Bereich
                            </Link>
                        </li>
                        <li className={`${checkActivatedRoute(['/activities', '/availabilities', 'demands']) ? styles.active : styles.nonActive}`}>
                            <Link
                                href='/activities'
                                className={styles.mainNavLink}
                                onClick={() => handleSelectMenu(MAIN_MENU[1].id)}>
                                Planung
                            </Link>
                        </li>
                        <li>
                            <Link href="#" onClick={() => logout()} className="btn btn-cta btn-icon">
                                <FaSignOutAlt />  Logout
                            </Link>
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
