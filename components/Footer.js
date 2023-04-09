import Link from 'next/link';
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";
import {IconSleigh} from '@tabler/icons-react';
import styles from '@/styles/Footer.module.scss';
import ScrollLink from "@/components/ScrollLink";

export default function Footer() {
    const { user, logout } = useContext(AuthContext);
    return (
        <footer className={styles.footer}>
            <div className="container grid grid--3-cols">
                <div className={styles.logoCol}>
                    <Link href='/' className={styles.footerLogo}>
                        <IconSleigh/>Samichlaus
                    </Link>

                    <p className={styles.copyright}>Copyright &copy; 2023 by St.Nikolaus-Gesellschaft Dietlikon &amp; Wangen-Br&uuml;ttisellen.<br/>All rights reserved.</p>
                    <ul className={styles.footerNav}>
                        <li>
                            <Link className={styles.footerLink} data-item-title="Impressum" href="#">Impressum</Link>
                        </li>
                        <li>
                            <Link className={styles.footerLink} data-item-title="Datenschutzbestimmungen" href="#">Datenschutz</Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.openingHoursCol}>
                    <p className={styles.footerHeading}>Kontakt</p>
                    <div className={styles.openingHours}>
                        <div>
                            Di - Fr:
                        </div>
                        <div>
                            <time dateTime="09:00">09:00</time>
                            -
                            <time dateTime="18:30">18:30</time>
                        </div>
                        <div>
                            Sa:
                        </div>
                        <div>
                            <time dateTime="09:00">09:00</time>
                            -
                            <time dateTime="15:00">15:00</time>
                        </div>
                        <div>
                            Mo:
                        </div>
                        <div>
                            geschlossen
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
                                <ScrollLink className={styles.footerLink} href="#einsatzplanung">Einsatzplanung</ScrollLink>
                            </li>
                            <li><Link className={styles.footerLink} href='/account/login'>Login</Link></li>
                        </>}
                    </ul>
                </nav>
            </div>
        </footer>
    )
}
