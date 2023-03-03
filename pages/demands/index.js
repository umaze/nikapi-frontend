import Layout from "@/components/Layout";
import DemandGroupItem from "@/components/DemandGroupItem";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parseCookies } from '@/helpers/index';
import { API_URL } from "@/config/index";
import styles from '@/styles/Demands.module.scss';

export default function DemandsPage({ demandGroups }) {
    return (
        <Layout>
            <h1>Demands</h1>
            <ToastContainer />
            {demandGroups?.length === 0 && <h3>No groups to show</h3>}
            <ul className={styles.list}>
                {demandGroups?.map(group => (
                    <li key={group.id}>
                        <DemandGroupItem key={group.id} group={group.attributes} />
                    </li>
                ))}
            </ul>
        </Layout >
    )
}

export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req);
    // Fetch demands
    const demandGroupsRes = await fetch(`${API_URL}/api/demand-groups?populate=demands.einsatztyp&populate=rollen`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });
    const demandGroups = await demandGroupsRes.json();

    if (!demandGroupsRes.ok) {
        if (res.status === 403 || res.status === 401) {
            toast.error('Unauthorized');
            return;
        }
        toast.error('Something Went Wrong');
    }

    return {
        props: {
            demandGroups: demandGroups.data,
            token
        }
    };
}
