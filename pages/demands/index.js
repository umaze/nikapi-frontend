import Layout from "@/components/Layout";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {isEinsatzplaner, parseCookies} from '@/helpers/index';
import {API_URL} from "@/config/index";
import styles from '@/styles/Demands.module.scss';
import DemandItem from "@/components/DemandItem";
import Link from "next/link";
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";

export default function DemandsPage({ demands }) {
    const {user} = useContext(AuthContext);
    return (
        <Layout>
            <h1 className="heading-primary">Veranstaltungen</h1>
            {isEinsatzplaner(user) && <Link className="btn" href={`/demands/add`}>Veranstaltung hinzuf&uuml;gen</Link>}
            {demands?.length === 0 && <p className="info-no-data">Es sind keine Veranstaltungen vorhanden.</p>}
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
            demands: demands.data,
            token
        }
    };
}
