import {formatDate, formatTime} from '@/helpers/index';
import Link from "next/link";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import styles from '@/styles/DemandItem.module.scss';

export default function DemandItem({demand, onDelete, token}) {
    const attributes = demand.attributes;
    const group = attributes.gruppe.data.attributes;

    return (
        <div className={styles.demand}>
            <div className={styles.main}>
                <div className={styles.info}>
                    <div className={styles.infoTop}>
                        <div>
                            <strong>{formatDate(attributes.datum)}</strong>&nbsp;
                            {formatTime(attributes.zeitVon)}
                            {attributes.zeitVon && ' - '}
                            {formatTime(attributes.zeitBis)}
                        </div>
                        <div>{group.name}</div>
                    </div>
                    <div className={styles.details}>
                        <div className={styles.einsatztyp}>{attributes.einsatztyp?.typ}</div>
                        <div>{group.rollen?.map(rolle => rolle.name).join(', ')}</div>
                    </div>
                </div>

                <div className={styles.link}>
                    <Link href={`/demands/edit/${demand.id}`}
                          className="btn btn-secondary btn-secondary--small btn-icon">
                        <IconEdit/>Veranstaltung {`${attributes.datum} ${attributes.zeitVon} ${attributes.einsatztyp?.typ}`} bearbeiten
                    </Link>
                    {demand.attributes.activities.data.length === 0 &&
                        <button className="btn btn-secondary btn-secondary--small btn-icon" onClick={onDelete}>
                            <IconTrash/>Veranstaltung {`${attributes.datum} ${attributes.zeitVon} ${attributes.einsatztyp?.typ}`} entfernen
                        </button>}
                </div>
            </div>
        </div>
    )
}
