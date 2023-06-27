import Head from 'next/head';
import {useRouter} from 'next/router';
import SkipLinks from "@/components/Skiplinks";
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import Einsatzplanung from "@/components/Einsatzplanung";
import Sidebar from "@/components/Sidebar";
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";
import styles from '@/styles/Layout.module.scss';

export default function Layout({title, keywords, description, children}) {
    const {user} = useContext(AuthContext);
    const router = useRouter();
    const publicRoutes = ['/account/help', '/account/login', '/account/register', '/datenschutz', '/impressum'];

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description}/>
                <meta name="keywords" content={keywords}/>
            </Head>

            <SkipLinks/>
            <Header/>

            {(router.pathname === '/' && !user) &&
                <>
                    <Hero/>
                    <Einsatzplanung/>
                </>
            }
            {((user || publicRoutes.includes(router.pathname) && !user)) &&
                <div className={styles.container}>
                    <Sidebar/>
                    <div className={`${styles.mainContent} main-content-flex-1`}>
                        {children}
                    </div>
                </div>
            }

            <Footer/>
        </>
    )
}

Layout.defaultProps = {
    title: 'Samichlaus | St.Nikolaus-Gesellschaft',
    description: 'St.Nikolaus-Gesellschaft Dietlikon, Br&uuml;ttisellen',
    keywords: 'samichlaus, dietlikon, br&uuml;ttisellen, st.nikolaus, gesellschaft'
}