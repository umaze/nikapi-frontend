import Layout from "@/components/Layout";
import styles from "@/styles/Impressum.module.scss";

export default function ImpressumPage() {
    return (
        <Layout>
            <h1 className="heading-primary">Impressum</h1>

            <div className={styles.impressumTextBox}>
                <div className={styles.impressumLocation}>
                    <div className={styles.impressumInfo}>
                        <p className={styles.impressumInfoTitle}>St.Nikolaus-Gesellschaft Dietlikon &amp; Wangen-Br&uuml;ttisellen</p>
                        <p className={styles.impressumInfoAddress}>
                            Postfach 301<br/>
                            8305 Dietlikon
                        </p>
                        <p className={styles.impressumContact}>
                            Webauftritt: http://www.samichlaus-dietlikon.ch
                        </p>
                    </div>
                </div>
                <div className={styles.impressumRealization}>
                    <div className={styles.impressumInfo}>
                        <p className={styles.impressumInfoTitle}>Realisierung</p>
                        <p className={styles.impressumInfoConsulting}>Beratung, technisches Konzept, Design, Programmierung
                            und Hosting dieser Website:</p>
                        <p className={styles.impressumConsultant}>
                            Urs Mazenauer<br/>
                            Klotenerstrasse 29<br/>
                            8305 Dietlikon
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
