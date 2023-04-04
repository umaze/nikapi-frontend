import Link from 'next/link';
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import {IconChevronsLeft, IconChevronsRight} from '@tabler/icons-react';
import styles from '@/styles/Sidebar.module.scss';
import {useRouter} from "next/router";

export default function Sidebar({listSubMenu}) {
    const {user} = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();
    const currentRoute = router.pathname;

    const handleToggleCollapse = () => setExpanded(prevState => !prevState);

    return (
        <>
            {user && listSubMenu?.length > 0 &&
                <div className={`${styles.sidebar} ${expanded ? styles.sidebarExpanded : ''}`}>
                    <button
                        onClick={handleToggleCollapse}
                        className={!expanded ? styles.centered : ''}>
                        {expanded ? <IconChevronsLeft/> : <IconChevronsRight/>}
                    </button>
                    <ul className={styles.subNavList}>
                        {listSubMenu?.map((item, i) => (
                            <li key={i}>
                                <Link className={`${styles.subNavLink} ${currentRoute.endsWith(item.href) ? styles.active : styles.nonActive}`} href={item.href}>
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
