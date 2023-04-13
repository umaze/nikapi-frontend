import {formatTime} from '@/helpers/index';
import styles from '@/styles/OrderRow.module.scss';
import Link from "next/link";

export default function OrderRow({ order }) {
    const attributes = order.attributes;

    return (
        <div className={`${styles.order} ${styles[attributes.status]}`}>
            <div className={styles.info}>
                <div className={styles.infoTop}>
                    <div>
                        <strong>{new Date(attributes.datum).toLocaleDateString('de-CH')}</strong>&nbsp;
                        {formatTime(attributes.zeitVon)}
                        {attributes.zeitVon && ' - '}
                        {formatTime(attributes.zeitBis)}
                    </div>
                    <div>{attributes.status}</div>
                </div>
                <div className={styles.details}>
                    <div className={styles.einsatztyp}>{attributes.einsatztyp?.typ}</div>
                    <div></div>
                </div>
            </div>

            <div className={styles.link}>
                <Link href={`/orders/edit/${order.id}`} legacyBehavior>
                    <a className="btn-secondary">Bearbeiten</a>
                </Link>
            </div>
        </div>
    )
}
