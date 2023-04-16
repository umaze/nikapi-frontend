import styles from "@/styles/ActivityItem.module.scss";
import Link from "next/link";
import {formatTime} from "@/helpers/index";
import {IconEdit} from "@tabler/icons-react";

export default function ActivityItemOverall({activity}) {
    const attributes = activity.attributes;
    const roles = attributes.rollen.map(r => `${r.rolle?.name} [${r.availability.data.attributes.benutzer.data.attributes.username}]`);

    return (
        <div className={`${styles.activity} ${styles[attributes.status]}`}>
            <div className={styles.info}>
                <div className={styles.infoTop}>
                    <div>{attributes.bezeichnung}</div>
                    <div>{attributes.status}</div>
                </div>
                <div className={styles.details}>
                    <div className={styles.rollen}>
                        <ul>
                            {roles && roles.length > 0 ?
                                roles.map((role, i) => (
                                    <li className={styles.einsatztyp} key={i}>
                                        {role}
                                    </li>
                                )) :
                                <li className={styles.einsatztyp} key={1}>&ndash;</li>
                            }
                        </ul>
                    </div>
                    <div>
                        {attributes.demand.data?.attributes.datum ?
                            <strong>{new Date(attributes.demand.data?.attributes.datum).toLocaleDateString('de-CH')}</strong> :
                            'keine Veranstaltung zugewiesen'
                        }&nbsp;
                        {formatTime(attributes.demand.data?.attributes.zeitVon)}
                        {attributes.demand.data?.attributes.zeitVon && ' - '}
                        {formatTime(attributes.demand.data?.attributes.zeitBis)}
                    </div>
                </div>
            </div>

            <div className={styles.link}>
                <Link href={`/activities/edit/${activity.id}`} className="btn btn-secondary btn-secondary--small btn-icon">
                    <IconEdit />
                </Link>
            </div>
        </div>
    );
}
