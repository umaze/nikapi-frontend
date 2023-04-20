import {useContext, useEffect} from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {selectActivatedNavMenu, setActivatedNavMenu} from "@/store/applicationSlice";
import {MAIN_MENU, MAIN_MENU_HILFE} from "@/config/index";
import {checkRouteHilfe, checkRouteMeinBereich, checkRoutePlanung} from "@/helpers/index";
import {IconLogin, IconLogout} from "@tabler/icons-react";
import styles from '@/styles/Header.module.scss';

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
                        <li className={`${checkRouteHilfe(currentRoute) ? styles.active : styles.nonActive}`}>
                            <Link
                                href={MAIN_MENU_HILFE.href}
                                className={styles.help}
                                onClick={() => handleSelectMenu(MAIN_MENU_HILFE.id)}>
                                {MAIN_MENU_HILFE.icon}
                            </Link>
                        </li>
                        <li>
                            <Link href="#" onClick={() => logout()} className="btn btn-cta btn-icon">
                                <IconLogout />  Logout
                            </Link>
                        </li>
                    </> : <>
                        <li>
                            <Link className="btn btn-cta btn-icon" href='/account/login'>
                                <IconLogin /> Login
                            </Link>
                        </li>
                    </>}

                </ul>
            </nav>
        </header>
    )
}
