import {formatTime} from '@/helpers/index';
import styles from '@/styles/OrderRow.module.scss';
import Link from "next/link";
import {IconEdit, IconTrash} from '@tabler/icons-react';

export default function OrderRow({ order, onDelete }) {
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
                    <div>{attributes.bezeichnung} | <span className={`${styles[`${attributes.status}-bottom`]}`}>{attributes.status}</span></div>
                </div>
                <div className={styles.details}>
                    <div className={styles.einsatztyp}>{attributes.einsatztyp?.typ}</div>
                    <div>{attributes.adresse}</div>
                </div>
            </div>

            <div className={styles.link}>
                <Link href={`/orders/edit/${order.id}`} className="btn btn-secondary btn-secondary--small btn-icon">
                    <IconEdit />
                </Link>
                {!order.activity?.data && <button className="btn btn-secondary btn-secondary--small btn-icon" onClick={onDelete}>
                    <IconTrash/>
                </button>}
            </div>
        </div>
    )
}
