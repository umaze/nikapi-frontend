import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from '@/styles/Home.module.scss';

export default function HomePage({ availabilities }) {
  return (
    <Layout>
      <main>
      <section className="section-einsatzplanung" id="einsatzplanung">
        <div className="container">
          <span className="subheading">Einsatzplanung?</span>
          <h2 className="heading-secondary">Veranstaltungen, Verfügbarkeiten und Einsätze</h2>
        </div>

        <div className="container grid grid--3-cols">
          <div className={styles.einsatzplanung}>
            <div className={styles.einsatzplanungContent}>
              <p className={styles.einsatzplanungTitle}>Veranstaltungen</p>
              <p className={styles.einsatzplanungDescription}>Während der Samichlaus Zeit gilt es, die grosse Nachfrage einzuteilen, um den Überblick zu behalten. Die Einsätze sind in verschiedene Veranstaltungen unterteilt, für welche jeweils ein definierter Bedarf an Rollen vorliegt.</p>
            </div>
          </div>
          <div className={styles.einsatzplanung}>
            <div className={styles.einsatzplanungContent}>
              <p className={styles.einsatzplanungTitle}>Verfügbarkeiten</p>
              <p className={styles.einsatzplanungDescription}>Die Mitglieder geben ihre Verfügbarkeiten zu den aufgelisteten Veranstaltungen an. Die Verfügbarkeiten bilden die Basis für die eigentliche Einsatzplanung. Je nach Einsatztyp der Veranstaltung plant der Einsatzplaner oder die Einsatzplanerin die mit den Verfügbarkeiten die benötigten Rollen.</p>
            </div>
          </div>
          <div className={styles.einsatzplanung}>
            <div className={styles.einsatzplanungContent}>
              <p className={styles.einsatzplanungTitle}>Einsätze</p>
              <p className={styles.einsatzplanungDescription}>Die Mitglieder wird eine Übersicht ihrer Einsätze angezeigt. Hat der Benutzer eine Übereinstimmung seiner Verfügbarkeit mit einem Einsatz, wird dieser angezeigt.</p>
            </div>
          </div>
        </div>
      </section>
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  const availabilitiesRes = await fetch(`${API_URL}/api/availabilities?populate=*&_sort=bemerkung:ASC&_limit=3`);
  const availabilities = await availabilitiesRes.json();

  return {
    props: { availabilities: availabilities.data },
    revalidate: 1
  };
}
