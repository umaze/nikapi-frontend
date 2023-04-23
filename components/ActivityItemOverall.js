import styles from "@/styles/ActivityItem.module.scss";
import Link from "next/link";
import {formatTime, isEinsatzplaner} from "@/helpers/index";
import {IconEdit} from "@tabler/icons-react";
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";

export default function ActivityItemOverall({activity}) {
    const {user} = useContext(AuthContext);
    const attributes = activity.attributes;
    const roles = attributes.rollen.map(r => `${r.rolle?.name} [${r.availability.data.attributes.benutzer.data.attributes.username}]`);
    const orders = attributes.orders.data.map(o => `${o.attributes.bezeichnung} [${o.attributes.adresse}]`);

    const summaryRoles = roles => {
        if (roles?.length === 1) {
            return '1 Rolle zugewiesen'
        } else if (roles?.length > 1) {
            return `${roles.length} Rollen zugewiesen`
        } else {
            return 'Keine Rollen zugewiesen'
        }
    };

    const summaryOrders = orders => {
        if (orders?.length === 1) {
            return '1 Bestellung zugewiesen'
        } else if (orders?.length > 1) {
            return `${orders.length} Bestellungen zugewiesen`
        } else {
            return 'Keine Bestellung zugewiesen'
        }
    };

    return (
        <div className={`${styles.activity} ${styles[attributes.status]}`}>
            <div className={styles.info}>
                <div className={styles.infoTop}>
                    <div>
                        {attributes.demand.data?.attributes.datum ?
                            <strong>{new Date(attributes.demand.data?.attributes.datum).toLocaleDateString('de-CH')}</strong> :
                            'keine Veranstaltung zugewiesen'
                        }&nbsp;
                        {formatTime(attributes.demand.data?.attributes.zeitVon)}
                        {attributes.demand.data?.attributes.zeitVon && ' - '}
                        {formatTime(attributes.demand.data?.attributes.zeitBis)}
                    </div>
                    <div>{attributes.bezeichnung} | <span
                        className={`${styles[`${attributes.status}-bottom`]}`}>{attributes.status}</span></div>
                </div>
                <div className={styles.details}>
                    <div className={styles.einsatztyp}>{attributes.demand.data.attributes.einsatztyp?.typ}</div>
                    <div className={styles.listings}>
                        <div className={styles.rollen}>{summaryRoles(roles)}</div>
                        <div className={styles.bestellungen}>{summaryOrders(orders)}</div>
                    </div>
                </div>
                <div className={styles.additionals}>
                    <div></div>
                    <div className={styles.listings}>
                        <div className={styles.rollen}>
                            <ul>
                                {roles && roles.length > 0 ?
                                    roles.map((role, i) => (
                                        <li key={i}>
                                            {role}
                                        </li>
                                    )) :
                                    <li key={1}>&ndash;</li>
                                }
                            </ul>
                        </div>
                        <div className={styles.bestellungen}>
                            <ul>
                                {orders && orders.length > 0 ?
                                    orders.map((order, i) => (
                                        <li key={i}>
                                            {order}
                                        </li>
                                    )) :
                                    <li key={1}>&ndash;</li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {isEinsatzplaner(user) && <div className={styles.link}>
                <Link href={`/activities/edit/${activity.id}`}
                      className="btn btn-secondary btn-secondary--small btn-icon">
                    <IconEdit/>
                </Link>
            </div>}
        </div>
    );
}
