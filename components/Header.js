import {useContext, useEffect} from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {selectActivatedNavMenu, setActivatedNavMenu} from "@/store/applicationSlice";
import {MAIN_MENU, MAIN_MENU_HILFE} from "@/config/index";
import {checkRouteHilfe, checkRouteMeinBereich, checkRoutePlanung, isEinsatzplaner} from "@/helpers/index";
import {IconLogin, IconLogout, IconMenu2, IconSleigh, IconX} from "@tabler/icons-react";
import SubNavList from "@/components/SubNavList";

export default function Header() {
    const {user, logout} = useContext(AuthContext);
    const dispatch = useDispatch();
    const selectedNavMenu = useSelector(selectActivatedNavMenu);
    const router = useRouter();
    const currentRoute = router.pathname;

    const handleSelectMenu = (menu, event) => {
        dispatch(setActivatedNavMenu(menu));
        if (containsNavOpen(event.currentTarget)) {
            removeNavOpen(event.currentTarget);
        } else if (containsNavOpen(event.target)) {
            removeNavOpen(event.target);
        }
    }

    const containsNavOpen = target => {
        return target && target.closest('.header')?.classList.contains('nav-open');
    };

    const removeNavOpen = target => {
        return target && target.closest('.header').classList.remove('nav-open');
    };

    const menuToggle = (classname, event) => {
        event.currentTarget.closest('.header')?.classList.toggle(classname);
    };

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
        <header>
            <div className="header">
                <div className="logo">
                    <Link href='/' legacyBehavior>
                        <a><IconSleigh/><div className="logo-text">Samichlaus</div></a>
                    </Link>
                </div>

                <nav className="main-nav">
                    <ul className="main-nav-list">
                        {user ? <>
                            <li className={checkRouteMeinBereich(currentRoute) ? 'active' : 'non-active'}>
                                <Link
                                    href='/availabilities/me'
                                    className="main-nav-link"
                                    onClick={(e) => handleSelectMenu(MAIN_MENU[0].id, e)}>
                                    Mein Bereich
                                </Link>
                                <SubNavList
                                    selectedMainNav={MAIN_MENU[0].id}
                                    isAdmin={isEinsatzplaner(user)}
                                    expanded={true}
                                    isMobile={true}/>
                            </li>
                            <li className={checkRoutePlanung(currentRoute) ? 'active' : 'non-active'}>
                                <Link
                                    href='/activities'
                                    className="main-nav-link"
                                    onClick={(e) => handleSelectMenu(MAIN_MENU[1].id, e)}>
                                    Planung
                                </Link>
                                <SubNavList
                                    selectedMainNav={MAIN_MENU[1].id}
                                    isAdmin={isEinsatzplaner(user)}
                                    expanded={true}
                                    isMobile={true}/>
                            </li>
                            <li className={checkRouteHilfe(currentRoute) ? 'active' : 'non-active'}>
                                <Link
                                    href={MAIN_MENU_HILFE.href}
                                    className="help"
                                    onClick={(e) => handleSelectMenu(MAIN_MENU_HILFE.id, e)}>
                                    {MAIN_MENU_HILFE.icon}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" onClick={() => logout()} className="btn btn-cta btn-icon">
                                    <IconLogout/> Logout
                                </Link>
                            </li>
                        </> : <>
                            <li>
                                <Link className="btn btn-cta btn-icon" href='/account/login'>
                                    <IconLogin/> Login
                                </Link>
                            </li>
                        </>}

                    </ul>
                </nav>

                <button className="btn-mobile-nav" onClick={(e) => menuToggle('nav-open', e)}>
                    <IconMenu2 className="icon-mobile-nav" id="icon-menu-outline"/>
                    <IconX className="icon-mobile-nav" id="icon-close-outline"/>
                </button>
            </div>
        </header>
    )
}
