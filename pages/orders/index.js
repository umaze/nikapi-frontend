import {toast} from "react-toastify";
import Layout from "@/components/Layout";
import OrderRow from "@/components/OrderRow";
import {configRequest, handleErrorMessage, isEinsatzplaner, parseCookies} from "@/helpers/index";
import {API_URL, FILTER_TYPE} from "@/config/index";
import Link from "next/link";
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import Modal from "@/components/Modal";
import Deletion from "@/components/Deletion";
import {useRouter} from "next/router";
import _ from "lodash";
import Filter from "@/components/Filter";
import styles from "@/styles/Demands.module.scss";
import {IconFilter} from "@tabler/icons-react";

export default function OrdersPage({orders, token}) {
    const {user} = useContext(AuthContext);
    const [filteredOrders, setFilteredOrders] = useState(_.cloneDeep(orders));
    const [filterExpanded, setFilterExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});
    const router = useRouter();

    const listEinsatztyp = orders?.length > 0 ?
        [...new Set(orders.flatMap(order => order.attributes.einsatztyp?.typ))] :
        [];

    const listStatus = orders?.length > 0 ?
        [...new Set(orders.flatMap(order => order.attributes.status))] :
        [];

    const handleDelete = order => {
        setSelectedOrder(order);
        setShowModal(true);
    }

    const postDeletion = async () => {
        await router.replace(router.asPath);
        setShowModal(false);
    };

    const handleFilter = data => {
        let filtered = _.cloneDeep(orders);
        if (Object.keys(data).length !== 0) {
            if (data.bezeichnung) {
                filtered = filtered.filter(order => order.attributes.bezeichnung.toLowerCase().includes(data.bezeichnung.toLowerCase()));
            }
            if (data.adresse) {
                filtered = filtered.filter(order => order.attributes.adresse.toLowerCase().includes(data.adresse.toLowerCase()));
            }
            if (data.datum) {
                filtered = filtered.filter(order => order.attributes.datum === data.datum);
            }
            if (data.selectStatus) {
                filtered = filtered.filter(order => order.attributes.status === data.selectStatus);
            }
            if (data.selectEinsatztyp) {
                filtered = filtered.filter(order => order.attributes.einsatztyp?.typ === data.selectEinsatztyp);
            }
        }
        setFilteredOrders(filtered);
    };

    const handleToggle = flag => setFilterExpanded(flag);

    return (
        <Layout>
            <h1 className="heading-primary">Bestellungen</h1>
            {isEinsatzplaner(user) &&
                <div className={styles.btnGroup}>
                    <Link className="btn" href={`/orders/add`}>Bestellung hinzuf&uuml;gen</Link>
                    {!filterExpanded && <button type="button"
                                                className={`btn btn-icon ${styles.btnIconSecondary}`}
                                                onClick={() => handleToggle(true)}>
                        <IconFilter/>
                        Filter anzeigen
                    </button>}
                </div>
            }

            <Filter
                type={FILTER_TYPE[2]}
                listEinsatztyp={listEinsatztyp}
                listStatus={listStatus}
                doFilter={(data) => handleFilter(data)}
                isExpanded={filterExpanded}
                doCollapse={() => handleToggle(false)}/>

            {filteredOrders?.length === 0 && <p className="info-no-data">Es sind keine Bestellungen vorhanden.</p>}
            <ul className={styles.list}>
                {filteredOrders?.map(order => (
                    <li key={order.id}>
                        <OrderRow key={order.id} order={order} onDelete={() => handleDelete(order)}/>
                    </li>
                ))}
            </ul>

            <Modal show={showModal} onClose={() => setShowModal(false)} title="Bestellung entfernen">
                <Deletion
                    id={selectedOrder.id}
                    token={token}
                    endpoint="orders"
                    onCancel={() => setShowModal(false)}
                    onDone={postDeletion}>
                    <p>Bestellung wirklich entfernen?</p>
                    <ul>
                        <li><em>{selectedOrder.attributes?.bezeichnung}</em></li>
                        <li><em>{selectedOrder.attributes?.adresse}</em></li>
                    </ul>
                </Deletion>
            </Modal>
        </Layout>
    );
}

export async function getServerSideProps({req}) {
    const {token} = parseCookies(req);
    // Fetch orders
    const ordersRes = await fetch(`${API_URL}/api/orders?populate=einsatztyp&populate=activity&sort=datum:asc`, configRequest('GET', token));
    const orders = await ordersRes.json();
    handleErrorMessage(ordersRes, toast);

    return {
        props: {
            orders: orders.data,
            token
        }
    };
}
