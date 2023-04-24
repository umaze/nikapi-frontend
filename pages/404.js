import {IconAlertTriangle} from "@tabler/icons-react";
import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/404.module.scss';

export default function NotFoundPage() {
    return (
        <Layout title='Seite nicht gefunden'>
            <div className={styles.error}>
                <h1 className="heading-primary">
                    <IconAlertTriangle /> 404
                </h1>
                <p className={styles.description}>Leider wurde die Seite nicht gefunden</p>
                <p className={styles.link}>
                    <Link href='/'>Zur&uuml;ck zur Startseite</Link>
                </p>
            </div>
        </Layout>
    )
}
