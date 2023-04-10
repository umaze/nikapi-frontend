import {toast, ToastContainer} from "react-toastify";
import Layout from "@/components/Layout";
import styles from "@/styles/Demands.module.scss";
import OrderRow from "@/components/OrderRow";
import {parseCookies} from "@/helpers/index";
import {API_URL} from "@/config/index";

export default function OrdersPage({orders}) {
    return (
        <Layout>
            <h1 className="heading-primary">Bestellungen</h1>
            <ToastContainer />
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
            toast.error('Unauthorized');
            return;
        }
        toast.error('Something Went Wrong');
    }

    return {
        props: {
            orders: orders.data,
            token
        }
    };
}
