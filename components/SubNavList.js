import Link from "next/link";
import {useRouter} from "next/router";
import {SUB_MENU} from "@/config/index";
import {checkActivatedRoute} from "@/helpers/index";

export default function SubNavList({selectedMainNav, isAdmin, expanded = false, isMobile = false}) {
    const router = useRouter();
    const currentRoute = router.pathname;

    const routes = item => {
        if (item.additionals && item.additionals.length > 0) {
            return [item.href, ...item.additionals.map(a => item.href + a)];
        }
        return [item.href]
    };

    const getLabel = label => {
        return `${selectedMainNav.startsWith('mein') ? 'Meine ' : ''}${label}`;
    }

    return (
        <ul className={`sub-nav-list ${isMobile ? 'sub-nav-list--visible' : ''}`}>
            {SUB_MENU[selectedMainNav]?.map((item, i) => (
                (item.restricted && isAdmin || !item.restricted) &&
                <li key={i}>
                    <Link
                        className={`sub-nav-link ${checkActivatedRoute(currentRoute, routes(item)) ? 'active' : 'non-active'}`}
                        href={item.href}>
                        <div className="link-icon">{item.icon}</div>
                        {expanded && <div className="link-icon">{getLabel(item.label)}</div>}
                    </Link>
                </li>
            ))}
        </ul>
    )
}