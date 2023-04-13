import {toast, ToastContainer} from "react-toastify";
import Layout from "@/components/Layout";
import styles from "@/styles/Demands.module.scss";
import OrderRow from "@/components/OrderRow";
import {isEinsatzplaner, parseCookies} from "@/helpers/index";
import {API_URL} from "@/config/index";
import Link from "next/link";
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";

export default function OrdersPage({orders}) {
    const {user} = useContext(AuthContext);
    return (
        <Layout>
            <h1 className="heading-primary">Bestellungen</h1>
            {isEinsatzplaner(user) && <Link className="btn" href={`/orders/add`}>Bestellung hinzuf&uuml;gen</Link>}
            {orders?.length === 0 && <p className="info-no-data">Es sind keine Bestellungen vorhanden.</p>}
            <ul className={styles.list}>
                {orders?.map(order => (
                    <li key={order.id}>
                        <OrderRow key={order.id} order={order} />
                    </li>
                ))}
            </ul>
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
