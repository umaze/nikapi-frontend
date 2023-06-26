import {listDescriptionEinsatzplanung} from "@/config/description";
import styles from "@/styles/Einsatzplanung.module.scss";

export default function Einsatzplanung() {
    return (
        <section className={styles.sectionEinsatzplanung} id="einsatzplanung">
            <div className="container">
                <span className="subheading">Einsatzplanung?</span>
                <h2 className="heading-secondary">Veranstaltungen, Verfügbarkeiten und Einsätze</h2>
            </div>

            <div className="container grid grid--3-cols">
                {listDescriptionEinsatzplanung.map((item, i) => (
                    <div key={i} className={styles.einsatzplanung}>
                        <div className={styles.einsatzplanungContent}>
                            <h3 className={styles.einsatzplanungTitle}>{item.topic.name}</h3>
                            {item.topic.list.map((block, ind) => (
                                <p key={ind} className={styles.einsatzplanungDescription}>{block.text}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
