import {DragCard} from "../pages/DragCard";
import styles from "@/styles/DragFile.module.scss";

export default function DragFile({orders}) {
    return (
        <div className={styles.dragBox}>
            <div className={styles.dragBoxContent}>
                <div>
                    <p className={styles.dragBoxTitle}>Offene Auftr&auml;ge</p>
                </div>
                {orders.map(order => (
                    <DragCard key={order.id} draggable order={order}/>
                ))}
            </div>
        </div>
    );
}
