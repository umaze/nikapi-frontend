import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from './Header';
import Showcase from './Showcase';
import Footer from './Footer';
import styles from '@/styles/Layout.module.scss';

export default function Layout({ title, keywords, description, children }) {
    const router = useRouter();

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
                {children}
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