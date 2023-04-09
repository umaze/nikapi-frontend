import Head from 'next/head';
import {useRouter} from 'next/router';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import Sidebar from "@/components/Sidebar";
import {IconCheckbox, IconClipboardList} from '@tabler/icons-react';
import styles from '@/styles/Layout.module.scss';
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";

export default function Layout({title, keywords, description, children}) {
    const {user} = useContext(AuthContext);
    const router = useRouter();

    const testSubMenu = [
        {
            href: '/availabilities',
            label: 'Verfügbarkeiten',
            icon: <IconCheckbox/>
        },
        {
            href: '/activities',
            label: 'Einsätze',
            icon: <IconClipboardList/>
        }
    ];

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description}/>
                <meta name="keywords" content={keywords}/>
            </Head>

            <Header/>

            {router.pathname === '/' && <Hero/>}

            <div className={styles.container}>
                {user && <Sidebar listSubMenu={testSubMenu}/> }
                <div className={styles.mainContent}>
                    {children}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

Layout.defaultProps = {
    title: 'Samichlaus | St.Nikolaus-Gesellschaft',
    description: 'St.Nikolaus-Gesellschaft Dietlikon, Br&uuml;ttisellen',
    keywords: 'samichlaus, dietlikon, br&uuml;ttisellen, st.nikolaus, gesellschaft'
}