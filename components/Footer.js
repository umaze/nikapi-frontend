import Link from 'next/link';
import styles from '@/styles/Footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p>Copyright &copy; Samichlaus Dietlikon Br&uuml;ttisellen 2023</p>
            <p>
                <Link href="/about">About This Project</Link>
            </p>
        </footer>
    )
}
