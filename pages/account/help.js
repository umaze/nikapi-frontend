import Layout from "@/components/Layout";
import styles from "@/styles/Help.module.scss";

export default function HelpPage() {
    return (
        <Layout title="Hilfe">
            <div className={styles.help}>
                <h1 className="heading-primary">
                    Q&amp;A &ndash; Fragen und Antworten
                </h1>
            </div>
        </Layout>
    );
}
