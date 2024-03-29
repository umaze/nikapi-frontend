import Link from "next/link";
import {formatDate, formatTime, isEinsatzplaner} from "@/helpers/index";
import {IconEdit, IconChevronUp, IconChevronDown} from "@tabler/icons-react";
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/ActivityItem.module.scss";

export default function ActivityItemOverall({activity, fitted = false}) {
    const {user} = useContext(AuthContext);
    const attributes = activity.attributes;
    const roles = attributes.rollen.map(r => `${r.rolle?.name} [${r.availability.data.attributes.benutzer.data.attributes.username}]`);
    const orders = attributes.orders.data.map(o => `${o.attributes.bezeichnung} [${o.attributes.adresse}]`);
    const [expanded, setExpanded] = useState(false);

    const summaryZugewiesen = items => {
        if (items?.length > 0) {
            return `${items.length} zugewiesen`
        } else {
            return 'Keine zugewiesen'
        }
    };

    const handleToggle = () => setExpanded(!expanded);

    return (
        <div className={`${styles.activity} ${styles[attributes.status]}`}>
            <div className={`no-padding-bottom ${styles.main} ${fitted ? styles.mainFitted : ''}`}>
                <div className={styles.info}>
                    <div className={styles.infoTop}>
                        <div>
                            {attributes.demand.data?.attributes.datum ?
                                <strong>{formatDate(attributes.demand.data?.attributes.datum)}</strong> :
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
                        <div className={`${styles.listings} ${fitted ? styles.listingsFitted : ''}`}>
                            <div className={styles.rollen}><span>Rollen</span>: {!expanded && summaryZugewiesen(roles)}</div>
                            <div className={`${styles.rollen} ${styles.listFitted} ${expanded ? '' : styles.hidden}`}>
                                <ul>
                                    {roles && roles.length > 0 ?
                                        roles.map((role, i) => (
                                            <li key={i} className={styles.bullet}>
                                                {role}
                                            </li>
                                        )) :
                                        <li key={1}>&ndash;</li>
                                    }
                                </ul>
                            </div>
                            <div className={styles.bestellungen}><span>Bestellungen</span>: {!expanded && summaryZugewiesen(orders)}</div>
                            <div className={`${styles.bestellungen} ${styles.listFitted} ${expanded ? '' : styles.hidden}`}>
                                <ul>
                                    {orders && orders.length > 0 ?
                                        orders.map((order, i) => (
                                            <li key={i} className={styles.bullet}>
                                                {order}
                                            </li>
                                        )) :
                                        <li key={1}>&ndash;</li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.additionals} ${expanded ? '' : styles.hidden}`}>
                        <div></div>
                        <div className={`${styles.listings} ${fitted ? styles.listingsFitted : ''}`}>
                            <div className={styles.rollen}>
                                <ul>
                                    {roles && roles.length > 0 ?
                                        roles.map((role, i) => (
                                            <li key={i} className={styles.bullet}>
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
                                            <li key={i} className={styles.bullet}>
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
                        <IconEdit/>Einsatz {`${attributes.datum} ${attributes.zeitVon} ${attributes.einsatztyp?.typ}`} bearbeiten
                    </Link>
                </div>}
            </div>

            <button className={`btn ${styles.btnIcon} ${styles.btnNoText}`} onClick={handleToggle}>
                {expanded ? <IconChevronUp/> : <IconChevronDown/>}{`Rollen und Bestellungen ${expanded ? 'zuklappen' : 'aufklappen'}`}
            </button>
        </div>
    );
}
