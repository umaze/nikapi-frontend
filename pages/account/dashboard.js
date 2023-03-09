import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parseCookies } from "@/helpers/index";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import DashboardAvailability from "@/components/DashboardAvailability";
import { API_URL } from "@/config/index";
import styles from "@/styles/Dashboard.module.scss";

export default function DashboardPage({ availabilities, token }) {
    const router = useRouter();

    const deleteAvailability = async (id) => {
        if (confirm('Are you sure?')) {
            const res = await fetch(`${API_URL}/api/availabilities/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = res.json();

            if (!res.ok) {
                toast.error(data.message);
            } else {
                router.reload();
            }
        }
    };

    return (
        <Layout title="User Dashboard">
            <div className={styles.dash}>
                <h1 className="heading-primary">Dashboard</h1>
                <h3 className="heading-tertiary">Meine Verf&uuml;gbarkeiten</h3>
                <ToastContainer />

                {availabilities && availabilities.map((availability) => (
                    <DashboardAvailability key={availability.id} availability={availability} handleDelete={deleteAvailability} />
                ))}
            </div>
        </Layout>
    )
}

export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req);

    const res = await fetch(`${API_URL}/api/availabilities/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const availabilities = await res.json();

    return {
        props: {
            availabilities: availabilities.data,
            token
        }
    }
}
