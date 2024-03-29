import {useContext, useEffect, useState} from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {selectActivatedNavMenu, setActivatedNavMenu} from "@/store/applicationSlice";
import {MAIN_MENU, MAIN_MENU_HILFE} from "@/config/index";
import {
    checkRouteAdmin,
    checkRouteEinsaetze,
    checkRouteHilfe,
    checkRouteMeinBereich,
    isEinsatzplaner
} from "@/helpers/index";
import {
    IconChevronDown,
    IconChevronUp,
    IconLogin,
    IconLogout,
    IconMenu2,
    IconSleigh,
    IconUserCircle,
    IconX
} from "@tabler/icons-react";
import SubNavList from "@/components/SubNavList";

export default function Header() {
    const {user, logout} = useContext(AuthContext);
    const [listExpanded, setListExpanded] = useState({});
    const [userInfoVisible, setUserInfoVisible] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
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

    const updateListExpanded = menuId => {
        const item = {...listExpanded};
        item[menuId] = !item[menuId];
        setListExpanded(item);
    };

    const handleClick = (menuId, e) => {
        e.preventDefault();
        updateListExpanded(menuId);
    };

    const isCollapsable = (menuId) => {
        return !!listExpanded[menuId];
    };

    const containsNavOpen = target => {
        return target && target.closest('.header')?.classList.contains('nav-open');
    };

    const removeNavOpen = target => {
        return target && target.closest('.header').classList.remove('nav-open');
    };

    const menuToggle = (classname, event) => {
        event.currentTarget.closest('.header')?.classList.toggle(classname);
        setMenuOpen(!menuOpen);
    };

    const userInfoToggle = e => {
        e.preventDefault();
        setUserInfoVisible(!userInfoVisible);
    };

    /***
     * Show MainNav items (admin-item only when user is einsatzplaner).
     * @param i
     * @param item
     * @param obj
     * @returns {*|boolean|JSX.Element}
     */
    const menuItem = (i, item, obj) => {
        const {fn: fnCheckActivation, link} = obj;
        return (
            (((item.id === MAIN_MENU[2].id && isEinsatzplaner(user)) || item.id !== MAIN_MENU[2].id) &&
                <li key={i} className={fnCheckActivation(currentRoute) ? 'active' : 'non-active'}>
                    <div className="main-nav-link--expandable"
                         onClick={(e) => handleClick(item.id, e)}>
                        {isCollapsable(item.id) ? <IconChevronUp/> : <IconChevronDown/>}
                        {item.label}
                    </div>
                    <Link
                        href={link}
                        className="main-nav-link"
                        onClick={(e) => handleSelectMenu(item.id, e)}>
                        {item.label}
                    </Link>
                    {isCollapsable(item.id) &&
                        <SubNavList
                            selectedMainNav={item.id}
                            isAdmin={isEinsatzplaner(user)}
                            expanded={true}
                            isMobile={true}/>
                    }
                </li>)
        );
    };

    const listFnLink = [
        {fn: (actRoute) => checkRouteMeinBereich(actRoute), link: '/availabilities/me'},
        {fn: (actRoute) => checkRouteEinsaetze(actRoute), link: '/activities'},
        {fn: (actRoute) => checkRouteAdmin(actRoute), link: '/availabilities'}
    ];

    useEffect(() => {
        if (checkRouteMeinBereich(currentRoute)) {
            updateListExpanded(MAIN_MENU[0].id);
            if (!selectedNavMenu) {
                dispatch(setActivatedNavMenu(MAIN_MENU[0].id));
            }
        } else if (checkRouteEinsaetze(currentRoute)) {
            updateListExpanded(MAIN_MENU[1].id);
            if (!selectedNavMenu) {
                dispatch(setActivatedNavMenu(MAIN_MENU[1].id));
            }
        } else if (checkRouteAdmin(currentRoute)) {
            updateListExpanded(MAIN_MENU[2].id);
            if (!selectedNavMenu) {
                dispatch(setActivatedNavMenu(MAIN_MENU[2].id));
            }
        }
    }, []);

    return (
        <header>
            <div className="overlay"></div>
            <div className="header">
                <div className="logo">
                    <Link href='/' legacyBehavior>
                        <a><IconSleigh/>
                            <div className="logo-text">Samichlaus</div>
                        </a>
                    </Link>
                </div>

                {user &&
                    <div className="username-mobile">{user.username}
                        <span className="username-mobile-role">{user.role ? user.role.name : 'Mitglied'}</span>
                    </div>
                }

                <nav className="main-nav">
                    <ul className="main-nav-list">
                        {user ? <>
                            {MAIN_MENU.map((item, i) => (
                                menuItem(i, item, listFnLink[i])
                            ))}
                            <li className={checkRouteHilfe(currentRoute) ? 'active' : 'non-active'}>
                                <Link
                                    href={MAIN_MENU_HILFE.href}
                                    className="help"
                                    onClick={(e) => handleSelectMenu(MAIN_MENU_HILFE.id, e)}>
                                    {MAIN_MENU_HILFE.icon}<span>Q&A</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" onClick={() => logout()} className="btn btn-cta btn-icon">
                                    <IconLogout/> Logout
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="user" onClick={e => userInfoToggle(e)}>
                                    <IconUserCircle/>
                                </Link>
                                {userInfoVisible && <>
                                    <div className="square"></div>
                                    <div className="userinfo">
                                        <ul>
                                            <li className="username">{user.username}</li>
                                            <li className="userinfo-role">{user.role ? user.role.name : 'Mitglied'}</li>
                                        </ul>
                                        <Link href="#" onClick={() => logout()} className="btn btn-cta btn-icon">
                                            <IconLogout/> Logout
                                        </Link>
                                    </div>
                                </>}
                            </li>
                        </> : <>
                            <li className={checkRouteHilfe(currentRoute) ? 'active' : 'non-active'}>
                                <Link
                                    href={MAIN_MENU_HILFE.href}
                                    className="help"
                                    onClick={(e) => handleSelectMenu(MAIN_MENU_HILFE.id, e)}>
                                    {MAIN_MENU_HILFE.icon}<span>Q&A</span>
                                </Link>
                            </li>
                            <li>
                                <Link className="btn btn-cta btn-icon" href='/account/login'>
                                    <IconLogin/> Login
                                </Link>
                            </li>
                        </>}

                    </ul>
                </nav>

                <button
                    className="btn-mobile-nav"
                    onClick={(e) => menuToggle('nav-open', e)}
                    aria-label={`Hauptmenu ${menuOpen ? 'schliessen' : 'öffnen'}`}>
                    <IconMenu2 className="icon-mobile-nav" id="icon-menu-outline"/>
                    <IconX className="icon-mobile-nav" id="icon-close-outline"/>
                </button>
            </div>
        </header>
    )
}
