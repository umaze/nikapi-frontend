import Link from "next/link";
import Image from "next/image";
import picschmutzli from '../img/hero-schmutzli.png';
import ScrollLink from "@/components/ScrollLink";
import styles from '@/styles/Hero.module.scss';

export default function Hero() {
    return (
        <section className={styles.sectionHero}>
            <div className={styles.hero}>
                <div className="hero-text-box">
                    <h1 className="heading-primary">Einsatz&shy;planung Samichlaus</h1>
                    <p className={styles.heroDescription}>Die St.Nikolaus Gesellschaft Dietlikon &amp; Br&uuml;ttisellen plant und koordiniert die Eins&auml;tze seiner Mitglieder anhand derer Verf&uuml;gbarkeiten. Denn Eins&auml;tze wollen koordiniert und gut geplant sein.</p>
                    <p className={styles.heroDescription}>Unterst&uuml;tze den Schmutzli und melde dich an!</p>
                    <Link href='/account/login' className="btn btn--full margin-right-sm">
                        Login
                    </Link>
                    <ScrollLink className="btn btn--outline" href="#einsatzplanung">
                        Mehr erfahren &darr;
                    </ScrollLink>
                </div>
                <div className={styles.heroImgBox}>
                    <Image src={picschmutzli} alt="Bild Schmutzli" className={styles.heroImg}/>
                </div>
            </div>
        </section>
    )
}
