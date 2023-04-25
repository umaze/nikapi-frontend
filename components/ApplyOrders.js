import Step from "@/components/Step";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentDemand, selectMatchingNotConnectedOrders, updateSteps} from "@/store/activitySlice";
import {useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import DragFile from "@/components/DragFile";
import OrderItem from "@/components/OrderItem";
import styles from "@/styles/ApplyOrders.module.scss";

export default function ApplyOrders({orders, currentStep, stepsSize, setValue, readOnly}) {
    const activityDemand = useSelector(selectCurrentDemand);
    const activitySelectableOrders = useSelector(selectMatchingNotConnectedOrders);
    const filteredOrders = activitySelectableOrders.filter(s => !orders?.some(o => o.id === s.id));
    const einsatztyp = activityDemand.attributes.einsatztyp.typ;

    const auftragRequired = Array.of('Abend', 'Schulbesuch').some(t => t === einsatztyp);

    const [basket, setBasket] = useState(orders ? [...orders] : []);
    const [filteredData, setFilteredData] = useState([...filteredOrders]);
    const [{isOver}, dropRef] = useDrop({
        accept: "language",
        drop: (item) => {
            const {order} = item;
            setFilteredData([...filteredData.filter(x => x.id !== order.id)]);
            setBasket((basket) => {
                const value = !basket.some(x => x.id === order.id) ? [...basket, order] : basket;
                setValue('activity.orders.data', value.map(o => {
                    return {id: o.id}
                }));
                return value;
            });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const dispatch = useDispatch();

    const handleDeleteItem = (item, e) => {
        e.preventDefault();
        setFilteredData([...filteredData, item]);
        setBasket((basket) => {
            const value = [...basket.filter(x => x.id !== item.id)];
            setValue('activity.orders.data', value.map(o => {
                return {id: o.id}
            }));
            return value;
        })
    };

    useEffect(() => {
        let stepsChecked = {};
        stepsChecked['3'] = auftragRequired && basket.length > 0 || !auftragRequired;
        dispatch(updateSteps(stepsChecked));
    }, [basket]);

    return (
        <Step title="Bestellungen" info="Zuweisen mit Drag&Drop" current={currentStep} size={stepsSize}>
            {activityDemand.attributes &&
                <>
                    <div className={styles.infos}>
                        <p>Datum: <strong>{new Date(activityDemand.attributes.datum).toLocaleDateString('de-CH')}</strong>
                        </p>
                        <p>Einsatztyp: <strong>{einsatztyp}</strong></p>
                    </div>
                    {!auftragRequired &&
                        <p>Bestellungen sind für Typ '{einsatztyp}' <strong>nicht erforderlich</strong>.</p>}

                    {auftragRequired &&
                        <div className={styles.dragAndDrop}>
                            <DragFile orders={filteredData}/>
                            <div className={styles.dragAndDropBasket} ref={dropRef}>
                                <div className={styles.dragAndDropMargin}>
                                    <div>
                                        <p className={styles.dragAndDropTitle}>Zugewiesene Auftr&auml;ge</p>
                                    </div>
                                    {basket.map((order, i) => (
                                        <OrderItem key={i} order={order}
                                                   onDeleteItem={(item, event) => handleDeleteItem(item, event)}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                </>
            }
        </Step>
    )
}
