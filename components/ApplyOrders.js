import Step from "@/components/Step";
import {useSelector} from "react-redux";
import {selectCurrentDemand, selectMatchingOrders} from "@/store/activitySlice";
import { FaTrashAlt } from 'react-icons/fa';
import {useState} from "react";
import {useDrop} from "react-dnd";
import DragFile from "@/components/DragFile";
import styles from "@/styles/ApplyOrders.module.scss";
import OrderItem from "@/components/OrderItem";

export default function ApplyOrders({currentStep, stepsSize, register, errors}) {
    const activityDemand = useSelector(selectCurrentDemand);
    const activitySelectableOrders = useSelector(selectMatchingOrders);
    const einsatztyp = activityDemand.attributes.einsatztyp.typ;

    const auftragRequired = Array.of('Abend', 'Schulbesuch').some(t => t === einsatztyp);

    const [basket, setBasket] = useState([]);
    const [filteredData, setFilteredData] = useState([...activitySelectableOrders]);
    const [{isOver}, dropRef] = useDrop({
        accept: "language",
        drop: (item) => {
            const {order} = item;
            setFilteredData([...filteredData.filter(x => x.id !== order.id)]);
            setBasket((basket) => !basket.some(x => x.id === order.id) ? [...basket, order] : basket)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const handleDeleteItem = (item, e) => {
        e.preventDefault();
        setFilteredData([...filteredData, item]);
        setBasket((basket) => [...basket.filter(x => x.id !== item.id)])
    }

    return (
        <Step title="Aufträge zuweisen" current={currentStep} size={stepsSize}>
            {activityDemand.attributes &&
                <>
                    <div className={styles.infos}>
                        <p>Datum: <strong>{new Date(activityDemand.attributes.datum).toLocaleDateString('de-CH')}</strong></p>
                        <p>Einsatztyp: <strong>{einsatztyp}</strong></p>
                        {!auftragRequired &&
                            <p>Auftr&auml;ge für Typ '{einsatztyp}' <strong>nicht erforderlich</strong></p>}
                    </div>

                    <div className={styles.dragAndDrop}>
                        <DragFile orders={filteredData}/>
                        <div className={styles.dragAndDropBasket} ref={dropRef}>
                            <div className={styles.dragAndDropMargin}>
                                <div>
                                    <p className={styles.dragAndDropTitle}>Zugewiesene Auftr&auml;ge</p>
                                </div>
                                {basket.map((order, i) => (
                                    <OrderItem key={i} order={order} onDeleteItem={(item, event) => handleDeleteItem(item, event)} />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            }
        </Step>
    )
}
