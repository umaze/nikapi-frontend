import Layout from "@/components/Layout";
import {parseCookies} from "@/helpers/index";
import {API_URL} from "@/config/index";
import {toast} from "react-toastify";
import ActivityItem from "@/components/ActivityItem";

export default function MyActivitiesPage({activities}) {
    return (
        <Layout title="Einsätze">
            <h1 className="heading-primary">Meine Eins&auml;tze</h1>

            {(!activities || activities.length === 0) && <p className="info-no-data">Es sind keine Eins&auml;tze vorhanden.</p>}
            {activities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
            ))}
        </Layout>
    )
}

export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req);
    // Fetch orders
    const activitiesRes = await fetch(`${API_URL}/api/activities/me?populate=demand&populate=rollen.rolle&populate=rollen.availability.benutzer&populate=orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });
    const activities = await activitiesRes.json();

    if (!activitiesRes.ok) {
        if (activitiesRes.status === 403 || activitiesRes.status === 401) {
            toast.error('Unauthorized');
            return;
        }
        toast.error('Something Went Wrong');
    }

    return {
        props: {
            activities: activities.data,
            token
        }
    };
}