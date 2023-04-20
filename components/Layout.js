import Head from 'next/head';
import {useRouter} from 'next/router';
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

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description}/>
                <meta name="keywords" content={keywords}/>
            </Head>

            <Header/>

            {(router.pathname === '/' && !user) ?
                <>
                    <Hero/>
                    <Einsatzplanung/>
                </> :
                <div className={styles.container}>
                    <Sidebar/>
                    <div className={styles.mainContent}>
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