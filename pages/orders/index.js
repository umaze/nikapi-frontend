import {toast} from "react-toastify";
import Layout from "@/components/Layout";
import styles from "@/styles/Demands.module.scss";
import OrderRow from "@/components/OrderRow";
import {isEinsatzplaner, parseCookies} from "@/helpers/index";
import {API_URL} from "@/config/index";
import Link from "next/link";
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import Modal from "@/components/Modal";
import Deletion from "@/components/Deletion";
import {useRouter} from "next/router";

export default function OrdersPage({orders, token}) {
    const {user} = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});
    const router = useRouter();

    const handleDelete = order => {
        setSelectedOrder(order);
        console.log(`Selected: ${JSON.stringify(order)}`);
        setShowModal(true);
    }

    const postDeletion = async () => {
        await router.replace(router.asPath);
        setShowModal(false);
    };

    return (
        <Layout>
            <h1 className="heading-primary">Bestellungen</h1>
            {isEinsatzplaner(user) && <Link className="btn" href={`/orders/add`}>Bestellung hinzuf&uuml;gen</Link>}
            {orders?.length === 0 && <p className="info-no-data">Es sind keine Bestellungen vorhanden.</p>}
            <ul className={styles.list}>
                {orders?.map(order => (
                    <li key={order.id}>
                        <OrderRow key={order.id} order={order} onDelete={() => handleDelete(order)} />
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
            </Modal >
        </Layout>
    );
}

export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req);
    // Fetch orders
    const ordersRes = await fetch(`${API_URL}/api/orders?populate=einsatztyp&populate=activity&sort=datum:asc`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });
    const orders = await ordersRes.json();

    if (!ordersRes.ok) {
        if (ordersRes.status === 403 || ordersRes.status === 401) {
            toast.error('Nicht authorisiert', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-error'
            });
            return;
        }
        toast.error('Ein Fehler ist aufgetreten', {
            position: toast.POSITION.TOP_CENTER,
            className: 'toast-error'
        });
    }

    return {
        props: {
            orders: orders.data,
            token
        }
    };
}
