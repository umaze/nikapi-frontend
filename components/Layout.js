import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from './Header';
import Showcase from './Showcase';
import Footer from './Footer';
import Sidebar from "@/components/Sidebar";
import {IconCheckbox, IconClipboardList} from '@tabler/icons-react';
import styles from '@/styles/Layout.module.scss';

export default function Layout({ title, keywords, description, children }) {
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
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
            </Head>

            <Header />

            {router.pathname === '/' && <Showcase />}

            <div className={styles.container}>
                <aside>
                    <Sidebar listSubMenu={testSubMenu} />
                </aside>
                <div className={styles.mainContent}>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

Layout.defaultProps = {
    title: 'Samichlaus | St.Nikolaus-Gesellschaft',
    description: 'St.Nikolaus-Gesellschaft Dietlikon, Br&uuml;ttisellen',
    keywords: 'samichlaus, dietlikon, br&uuml;ttisellen, st.nikolaus, gesellschaft'
}