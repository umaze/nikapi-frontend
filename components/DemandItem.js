import {formatTime} from '@/helpers/index';
import styles from '@/styles/DemandItem.module.scss';
import Link from "next/link";

export default function DemandItem({ demand }) {
    const attributes = demand.attributes;
    const group = attributes.gruppe.data.attributes;

    return (
        <div className={styles.demand}>
            <div className={styles.info}>
                <div className={styles.infoTop}>
                    <div>
                        <strong>{new Date(attributes.datum).toLocaleDateString('de-CH')}</strong>&nbsp;
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
                <Link href={`/demands/${demand.id}`} legacyBehavior>
                    <a className="btn-secondary">Bearbeiten</a>
                </Link>
            </div>
        </div>
    )
}
