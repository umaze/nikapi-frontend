import Link from 'next/link';
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import {IconChevronsLeft, IconChevronsRight} from '@tabler/icons-react';
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {selectActivatedNavMenu} from "@/store/applicationSlice";
import {checkActivatedRoute, isEinsatzplaner} from "@/helpers/index";
import {SUB_MENU} from "@/config/index";
import styles from '@/styles/Sidebar.module.scss';

export default function Sidebar() {
    const {user} = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);
    const selectedNavMenu = useSelector(selectActivatedNavMenu);
    const router = useRouter();
    const currentRoute = router.pathname;

    const routes = item => {
        if (item.additionals && item.additionals.length > 0) {
            return [item.href, ...item.additionals.map(a => item.href + a)];
        }
        return [item.href]
    };

    const handleToggleCollapse = () => setExpanded(prevState => !prevState);

    return (
        <>
            {user && selectedNavMenu && SUB_MENU[selectedNavMenu]?.length > 0 &&
                <div className={`${styles.sidebar} sidebar ${expanded ? 'expanded' : ''}`}>
                    <div className={`${styles.sidebarInner} ${expanded ? 'expanded-inner' : ''}`}>
                        <button
                            onClick={handleToggleCollapse}
                            className={!expanded ? styles.centered : ''}>
                            {expanded ? <IconChevronsLeft/> : <IconChevronsRight/>}
                        </button>
                        <ul className={styles.subNavList}>
                            {SUB_MENU[selectedNavMenu]?.map((item, i) => (
                                (item.restricted && isEinsatzplaner(user) || !item.restricted) &&
                                <li key={i}>
                                    <Link
                                        className={`${styles.subNavLink} ${checkActivatedRoute(currentRoute, routes(item)) ? styles.active : styles.nonActive}`}
                                        href={item.href}>
                                        <div className={styles.linkIcon}>{item.icon}</div>
                                        {expanded && <div className={styles.linkIcon}>{item.label}</div>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            }
        </>
    );
}
