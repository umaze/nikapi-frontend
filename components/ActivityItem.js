import Link from "next/link";
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";
import {formatDate, formatTime} from "@/helpers/index";
import styles from "@/styles/ActivityItem.module.scss";

export default function ActivityItem({activity}) {
    const attributes = activity.attributes;
    const {user} = useContext(AuthContext);
    const myAvailabilities = attributes.rollen.filter(r => r.availability.data.attributes.benutzer.data.id === user?.id);
    const myRoles = myAvailabilities.map(r => r.rolle?.name);

    return (
        <div className={styles.activity}>
            <div className={styles.info}>
                <div className={styles.infoTop}>
                    <div>{attributes.bezeichnung}</div>
                    <div>{attributes.status}</div>
                </div>
                <div className={styles.details}>
                    <div className={styles.einsatztyp}>{myRoles}</div>
                    <div>
                        {attributes.demand.data?.attributes.datum ?
                            <strong>{formatDate(attributes.demand.data?.attributes.datum)}</strong> :
                            'keine Veranstaltung zugewiesen'
                        }&nbsp;
                        {formatTime(attributes.demand.data?.attributes.zeitVon)}
                        {attributes.demand.data?.attributes.zeitVon && ' - '}
                        {formatTime(attributes.demand.data?.attributes.zeitBis)}
                    </div>
                </div>
            </div>

            <div className={styles.link}>
                <Link href={`/activities/${activity.id}`} legacyBehavior>
                    <a className="btn-secondary">Details</a>
                </Link>
            </div>
        </div>
    );
}
