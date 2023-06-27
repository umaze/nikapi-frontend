import {useContext} from "react";
import Link from "next/link";
import AuthContext from "@/context/AuthContext";
import {isEinsatzplaner} from "@/helpers/index";
import {SUB_MENU} from "@/config/index";
import ScrollLink from "@/components/ScrollLink";
import styles from '@/styles/SkipLinks.module.scss';

export default function SkipLinks() {
    const {user} = useContext(AuthContext);
    return (
        <div id="kopf">
            <div className={styles.skipLink}>
                <ul>
                    {!user &&
                        <>
                            <li><Link href="/account/login" className={styles.skipLinkTab}>Login</Link></li>
                            <li><ScrollLink href="#einsatzplanung" className={styles.skipLinkTab}>Einsatzplanung?</ScrollLink></li>
                        </>
                    }
                    {user &&
                        <>
                            <li><Link href="/" className={styles.skipLinkTab}>&Uuml;bersicht Einsatzplanung</Link></li>
                            <li><Link href={SUB_MENU.meinBereich[1].href} className={styles.skipLinkTab}>Meine Verf&uuml;gbarkeiten</Link></li>
                            <li><Link href={SUB_MENU.einsaetze[0].href} className={styles.skipLinkTab}>Alle Eins&auml;tze</Link></li>
                            {user && isEinsatzplaner(user) &&
                                <>
                                    <li><Link href={SUB_MENU.admin[0].href} className={styles.skipLinkTab}>Alle Verf&uuml;gbarkeiten</Link></li>
                                </>
                            }
                        </>
                    }
                </ul>
            </div>
        </div>
    );
}
