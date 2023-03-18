import Link from 'next/link';
import {FaTrashAlt, FaSearchPlus} from "react-icons/fa";
import styles from '@/styles/OrderItem.module.scss';

export default function OrderItem({order, onDeleteItem}) {
    const {attributes} = order;
    return (
        <div className={styles.order}>
            <div className={styles.info}>
                <div className={styles.details}>{attributes.bezeichnung}</div>
                <div className={styles.address}>{attributes.adresse}</div>
            </div>

            <div className={styles.link}>
                <Link className="btn btn-icon" href={`/orders/${order.id}`}>
                    <FaSearchPlus/>
                </Link>
                {onDeleteItem &&
                    <button className="btn btn-icon" onClick={(event) => onDeleteItem(order, event)}>
                        <FaTrashAlt/>
                    </button>}
            </div>
        </div>
    )
}
