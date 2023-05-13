import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import {IconChevronsLeft, IconChevronsRight} from '@tabler/icons-react';
import {useSelector} from "react-redux";
import {selectActivatedNavMenu} from "@/store/applicationSlice";
import {isEinsatzplaner} from "@/helpers/index";
import {SUB_MENU} from "@/config/index";
import SubNavList from "@/components/SubNavList";
import styles from '@/styles/Sidebar.module.scss';

export default function Sidebar() {
    const {user} = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);
    const selectedNavMenu = useSelector(selectActivatedNavMenu);

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
                        <SubNavList
                            selectedMainNav={selectedNavMenu}
                            isAdmin={isEinsatzplaner(user)}
                            expanded={expanded} />
                    </div>
                </div>
            }
        </>
    );
}
