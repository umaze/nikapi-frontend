import Layout from "@/components/Layout";
import contentData from '../../json/content.json' assert {type: 'json'};
import styles from "@/styles/Datenschutz.module.scss";

export default function DatenschutzPage() {
    const datenschutz = contentData.data.filter(item => item.section === 'datenschutz')[0];
    return (
        <Layout>
            <h1 className="heading-primary">Datenschutz</h1>

            <div className={styles.datenschutzTextBox}>
                <div className={styles.datenschutzKapitel}>
                    <div className={styles.datenschutzKapitelContent}>
                        <p className={styles.datenschutzParagraph}>
                            {datenschutz.content.prolog}
                        </p>
                    </div>
                </div>
                {
                    datenschutz.content.chapters.map((chapter, i) => (
                        <div key={i} className={styles.datenschutzKapitel}>
                            <div className={styles.datenschutzKapitelContent}>
                                <p className={styles.datenschutzTitle}>{chapter.title}</p>
                                {
                                    chapter.content.map((item, i) => (
                                        <div key={i}>
                                            {
                                                item.subtitle &&
                                                <p key={i} className={styles.datenschutzSubtitle}>{item.subtitle}</p>
                                            }
                                            {
                                                item.paragraphs.map((pg, i) => (
                                                    <p key={i} className={styles.datenschutzParagraph}>{pg}</p>))
                                            }
                                            <ul>
                                                {
                                                    item.links && item.links.map((link, i) => (
                                                        <li key={i}>{link.anbieter}: <a href={link.link} target="_blank">{link.link}</a>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    ))}
                            </div>
                        </div>)
                    )
                }
                <div className={styles.datenschutzKapitel}>
                    <div className={styles.datenschutzKapitelContent}>
                        <p className={styles.datenschutzParagraph}>
                            {datenschutz.content.jurisdiction}
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
