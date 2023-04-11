import Layout from "@/components/Layout";
import Link from "next/link";
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";
import {isEinsatzplaner, parseCookies} from "@/helpers/index";
import {API_URL} from "@/config/index";
import {toast} from "react-toastify";
import ActivityItemOverall from "@/components/ActivityItemOverall";

export default function ActivitiesPage({activities}) {
    const {user} = useContext(AuthContext);
    return (
        <Layout title="Einsätze">
            <h1 className="heading-primary">Eins&auml;tze</h1>
            {isEinsatzplaner(user) && <Link className="btn" href={`/activities/add`}>Einsatz hinzuf&uuml;gen</Link>}

            {(!activities || activities.length === 0) && <p className="info-no-data">Es sind keine Eins&auml;tze vorhanden.</p>}
            {activities?.map(activity => (
                <ActivityItemOverall key={activity.id} activity={activity} />
            ))}
        </Layout>
    )
}

export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req);
    // Fetch orders
    const activitiesRes = await fetch(`${API_URL}/api/activities?populate=demand&populate=rollen.rolle&populate=rollen.availability.benutzer&populate=orders`, {
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
