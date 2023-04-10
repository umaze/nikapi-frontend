import Link from 'next/link';
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import {IconChevronsLeft, IconChevronsRight} from '@tabler/icons-react';
import styles from '@/styles/Sidebar.module.scss';
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {selectActivatedNavMenu} from "@/store/applicationSlice";
import {isEinsatzplaner} from "@/helpers/index";

export default function Sidebar({listSubMenu}) {
    const {user} = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);
    const selectedNavMenu = useSelector(selectActivatedNavMenu);
    const router = useRouter();
    const currentRoute = router.pathname;

    const checkActivatedRoute = (routes) => {
        return routes.some(route => currentRoute.endsWith(route));
    };

    const handleToggleCollapse = () => setExpanded(prevState => !prevState);

    return (
        <>
            {user && selectedNavMenu && listSubMenu[selectedNavMenu]?.length > 0 &&
                <div className={`${styles.sidebar} ${expanded ? 'expanded' : ''}`}>
                    <button
                        onClick={handleToggleCollapse}
                        className={!expanded ? styles.centered : ''}>
                        {expanded ? <IconChevronsLeft/> : <IconChevronsRight/>}
                    </button>
                    <ul className={styles.subNavList}>
                        {listSubMenu[selectedNavMenu]?.map((item, i) => (
                            (item.restricted && isEinsatzplaner(user) || !item.restricted) &&
                            <li key={i}>
                                <Link
                                    className={`${styles.subNavLink} ${checkActivatedRoute([item.href]) ? styles.active : styles.nonActive}`}
                                    href={item.href}>
                                    <div className={styles.linkIcon}>{item.icon}</div>
                                    {expanded && <div className={styles.linkIcon}>{item.label}</div>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </>
    );
}
