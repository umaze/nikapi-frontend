import {FaSignInAlt, FaSignOutAlt} from 'react-icons/fa';
import {useContext, useEffect} from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import styles from '@/styles/Header.module.scss';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {selectActivatedNavMenu, setActivatedNavMenu} from "@/store/applicationSlice";
import {MAIN_MENU} from "@/config/index";
import {checkRouteMeinBereich, checkRoutePlanung} from "@/helpers/index";

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const dispatch = useDispatch();
    const selectedNavMenu = useSelector(selectActivatedNavMenu);
    const router = useRouter();
    const currentRoute = router.pathname;

    const handleSelectMenu = menu => {
        dispatch(setActivatedNavMenu(menu));
    }

    useEffect(() => {
        if (!selectedNavMenu) {
            if (checkRouteMeinBereich(currentRoute)) {
                dispatch(setActivatedNavMenu(MAIN_MENU[0].id));
            } else if (checkRoutePlanung(currentRoute)) {
                dispatch(setActivatedNavMenu(MAIN_MENU[1].id));
            }
        }
    }, []);

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
                        <li className={`${checkRouteMeinBereich(currentRoute) ? styles.active : styles.nonActive}`}>
                            <Link
                                href='/availabilities/me'
                                className={styles.mainNavLink}
                                onClick={() => handleSelectMenu(MAIN_MENU[0].id)}>
                                Mein Bereich
                            </Link>
                        </li>
                        <li className={`${checkRoutePlanung(currentRoute) ? styles.active : styles.nonActive}`}>
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
