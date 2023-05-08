import Link from "next/link";
import {useContext} from "react";
import Layout from "@/components/Layout";
import AuthContext from "@/context/AuthContext";
import {SUB_MENU} from "@/config/index";
import {isEinsatzplaner} from "@/helpers/index";
import styles from '@/styles/Home.module.scss';

export default function HomePage() {
    const {user} = useContext(AuthContext);

    return (
        <Layout>
            <main>
                <div className="container">
                    <h1 className="heading-primary">&Uuml;bersicht Einsatzplanung</h1>
                </div>

                <section className={styles.sectionDashboard} id="dashboard">
                    <div className="container grid grid--3-cols">
                        {SUB_MENU.meinBereich && SUB_MENU.meinBereich.map((item, i) => (
                            <div key={i} className={styles.card}>
                                <Link href={item.href}>
                                    <div className={styles.cardContent}>
                                        {item.icon}
                                        <div className={styles.cardTitle}><span>Meine</span><br/>{item.label}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        {SUB_MENU.einsaetze && SUB_MENU.einsaetze.map((item, i) => (
                            <div key={i} className={styles.card}>
                                <Link href={item.href}>
                                    <div className={styles.cardContent}>
                                        {item.icon}
                                        <div className={styles.cardTitle}>{`${item.label}`}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        {SUB_MENU.admin && SUB_MENU.admin.map((item, i) => (
                            (item.restricted && isEinsatzplaner(user) || !item.restricted) &&
                            <div key={i} className={styles.card}>
                                <Link href={item.href}>
                                    <div className={styles.cardContent}>
                                        {item.icon}
                                        <div className={styles.cardTitle}>{`${item.label}`}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </Layout>
    )
}
