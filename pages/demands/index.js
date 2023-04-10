import Layout from "@/components/Layout";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {parseCookies} from '@/helpers/index';
import {API_URL} from "@/config/index";
import styles from '@/styles/Demands.module.scss';
import DemandItem from "@/components/DemandItem";

export default function DemandsPage({ demands }) {
    return (
        <Layout>
            <h1 className="heading-primary">Veranstaltungen</h1>
            <ToastContainer />
            {demands?.length === 0 && <h3>Keine Veranstaltungen vorhanden</h3>}
            <ul className={styles.list}>
                {demands?.map(demand => (
                    <li key={demand.id}>
                        <DemandItem key={demand.id} demand={demand} />
                    </li>
                ))}
            </ul>
        </Layout >
    )
}

export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req);
    // Fetch demands
    const demandsRes = await fetch(`${API_URL}/api/demands?populate=einsatztyp&populate=gruppe.rollen&sort=datum:asc`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });
    const demands = await demandsRes.json();

    if (!demandsRes.ok) {
        if (demandsRes.status === 403 || demandsRes.status === 401) {
            toast.error('Unauthorized');
            return;
        }
        toast.error('Something Went Wrong');
    }

    return {
        props: {
            demands: demands.data,
            token
        }
    };
}
