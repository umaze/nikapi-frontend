import styles from '@/styles/Hero.module.scss';
import Link from "next/link";
import ScrollLink from "@/components/ScrollLink";

export default function Hero() {
    return (
        <section className={styles.sectionHero}>
            <div className={styles.hero}>
                <div className="hero-text-box">
                    <h1 className="heading-primary">Einsatz&shy;planung Samichlaus</h1>
                    <p className={styles.heroDescription}>Die St.Nikolaus Gesellschaft Dietlikon &amp; Br&uuml;ttisellen plant und koordiniert die Eins&auml;tze seiner Mitglieder anhand derer Verf&uuml;gbarkeiten. Denn Eins&auml;tze wollen koordiniert und gut geplant sein.</p>
                    <p className={styles.heroDescription}>Sei Teil der Freiwilligen und unterst&uuml;tze uns!</p>
                    <Link href='/account/login' className="btn btn--full margin-right-sm">
                        Teilnehmen
                    </Link>
                    <ScrollLink className="btn btn--outline" href="#einsatzplanung">
                        Mehr erfahren &darr;
                    </ScrollLink>
                </div>
                <div className="hero-img-box">
                </div>
            </div>
        </section>
    )
}
