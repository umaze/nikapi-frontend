import Link from 'next/link';
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";
import {IconSleigh} from '@tabler/icons-react';
import styles from '@/styles/Footer.module.scss';
import ScrollLink from "@/components/ScrollLink";

export default function Footer() {
    const {user, logout} = useContext(AuthContext);
    return (
        <footer className={styles.footer}>
            <div className="container grid grid--3-cols">
                <div className={styles.logoCol}>
                    <Link href='/' className={styles.footerLogo}>
                        <IconSleigh/>Samichlaus
                    </Link>

                    <p className={styles.copyright}>Copyright &copy; 2023 by St.Nikolaus-Gesellschaft
                        Dietlikon &amp; Wangen-Br&uuml;ttisellen.<br/>All rights reserved.</p>
                    <ul className={styles.footerNav}>
                        <li>
                            <Link className={styles.footerLink} data-item-title="Impressum" href="#">Impressum</Link>
                        </li>
                        <li>
                            <Link className={styles.footerLink} data-item-title="Datenschutzbestimmungen"
                                  href="#">Datenschutz</Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.contactCol}>
                    <p className={styles.footerHeading}>Kontakt</p>
                    <div className={styles.contact}>
                        <div>St.Nikolaus-Gesellschaft<br/>
                            Dietlikon &amp; Wangen-Br&uuml;ttisellen<br/>
                            Postfach 301<br/>
                            8305 <strong>Dietlikon</strong>
                        </div>
                        <div>
                            <Link href="https://samichlaus-dietlikon.ch" target="_blank">
                                Link Webseite
                            </Link>
                        </div>
                    </div>
                </div>
                <nav className={styles.navCol}>
                    <p className={styles.footerHeading}>Samichlaus Einsatzplanung</p>
                    <ul className={styles.footerNav}>
                        {user ? <>
                            <li><Link className={styles.footerLink} href='/availabilities'>Mein Bereich</Link></li>
                            <li><Link className={styles.footerLink} href='/activities'>Planung</Link></li>
                            <li><Link className={styles.footerLink} href='#' onClick={() => logout()}>Logout</Link></li>
                        </> : <>
                            <li>
                                <ScrollLink className={styles.footerLink}
                                            href="#einsatzplanung">Einsatzplanung</ScrollLink>
                            </li>
                            <li><Link className={styles.footerLink} href='/account/login'>Login</Link></li>
                        </>}
                    </ul>
                </nav>
            </div>
        </footer>
    )
}
