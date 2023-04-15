import Layout from "@/components/Layout";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {configRequest, handleErrorMessage, isEinsatzplaner, parseCookies} from '@/helpers/index';
import {API_URL} from "@/config/index";
import styles from '@/styles/Demands.module.scss';
import DemandItem from "@/components/DemandItem";
import Link from "next/link";
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import {useRouter} from "next/router";
import Modal from "@/components/Modal";
import Deletion from "@/components/Deletion";

export default function DemandsPage({ demands, token }) {
    const {user} = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedDemand, setSelectedDemand] = useState({});
    const router = useRouter();

    const handleDelete = demand => {
        setSelectedDemand(demand);
        setShowModal(true);
    }

    const postDeletion = async () => {
        await router.replace(router.asPath);
        setShowModal(false);
    };

    return (
        <Layout>
            <h1 className="heading-primary">Veranstaltungen</h1>
            {isEinsatzplaner(user) && <Link className="btn" href={`/demands/add`}>Veranstaltung hinzuf&uuml;gen</Link>}
            {demands?.length === 0 && <p className="info-no-data">Es sind keine Veranstaltungen vorhanden.</p>}
            <ul className={styles.list}>
                {demands?.map(demand => (
                    <li key={demand.id}>
                        <DemandItem key={demand.id} demand={demand} onDelete={() => handleDelete(demand)} />
                    </li>
                ))}
            </ul>

            <Modal show={showModal} onClose={() => setShowModal(false)} title="Veranstaltung entfernen">
                <Deletion
                    id={selectedDemand.id}
                    token={token}
                    endpoint="demands"
                    onCancel={() => setShowModal(false)}
                    onDone={postDeletion}>
                    <p>Veranstaltung wirklich entfernen?</p>
                    <ul>
                        <li><em>{selectedDemand.attributes?.gruppe.data.attributes.name}</em></li>
                        <li><em>{new Date(selectedDemand.attributes?.datum).toLocaleDateString('de-CH')}</em></li>
                        <li><em>{selectedDemand.attributes?.einsatztyp?.typ}</em></li>
                    </ul>
                </Deletion>
            </Modal >
        </Layout >
    )
}

export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req);
    // Fetch demands
    const demandsRes = await fetch(`${API_URL}/api/demands?populate=einsatztyp&populate=gruppe.rollen&sort=datum:asc`, configRequest('GET', token));
    const demands = await demandsRes.json();
    handleErrorMessage(demandsRes, toast);

    return {
        props: {
            demands: demands.data,
            token
        }
    };
}
