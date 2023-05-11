import Layout from "@/components/Layout";
import Link from "next/link";
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import {configRequest, handleErrorMessage, isEinsatzplaner, parseCookies} from "@/helpers/index";
import {API_URL, FILTER_TYPE} from "@/config/index";
import {toast} from "react-toastify";
import ActivityItemOverall from "@/components/ActivityItemOverall";
import _ from "lodash";
import Filter from "@/components/Filter";
import styles from "@/styles/Activities.module.scss";
import {IconFilter} from "@tabler/icons-react";

export default function ActivitiesPage({activities}) {
    const {user} = useContext(AuthContext);
    const [filteredActivities, setFilteredActivities] = useState(_.cloneDeep(activities));
    const [filterExpanded, setFilterExpanded] = useState(false);

    const listEinsatztyp = activities?.length > 0 ?
        [...new Set(activities.flatMap(activity => activity.attributes.demand.data.attributes.einsatztyp?.typ))] :
        [];

    const listRolle = activities?.length > 0 ?
        [...new Set(activities.flatMap(activity => activity.attributes.rollen?.map(rolle => rolle.name)))] :
        [];

    const listStatus = activities?.length > 0 ?
        [...new Set(activities.flatMap(activity => activity.attributes.status))] :
        [];

    const handleFilter = data => {
        let filtered = _.cloneDeep(activities);
        if (Object.keys(data).length !== 0) {
            if (data.bezeichnung) {
                filtered = filtered.filter(order => order.attributes.bezeichnung.toLowerCase().includes(data.bezeichnung.toLowerCase()));
            }
            if (data.benutzer) {
                filtered = filtered.filter(activity => activity.attributes.benutzer.data.attributes.username.toLowerCase().includes(data.benutzer.toLowerCase()));
            }
            if (data.datum) {
                filtered = filtered.filter(activity => activity.attributes.demand.data.attributes.datum === data.datum);
            }
            if (data.selectStatus) {
                filtered = filtered.filter(activity => activity.attributes.status === data.selectStatus);
            }
            if (data.selectRolle) {
                filtered = filtered.filter(activity => activity.attributes.rollen?.some(rolle => rolle.name === data.selectRolle));
            }
            if (data.selectEinsatztyp) {
                filtered = filtered.filter(activity => activity.attributes.demand.data.attributes.einsatztyp?.typ === data.selectEinsatztyp);
            }
            if (data.bestellung) {
                filtered = filtered.filter(activity => activity.attributes.orders.data?.some(order => order.attributes.bezeichnung.toLowerCase().includes(data.bestellung.toLowerCase())));
            }
            if (data.adresse) {
                filtered = filtered.filter(activity => activity.attributes.orders.data?.some(order => order.attributes.adresse.toLowerCase().includes(data.adresse.toLowerCase())));
            }
        }
        setFilteredActivities(filtered);
    };

    const handleToggle = flag => setFilterExpanded(flag);

    return (
        <Layout title="Einsätze">
            <h1 className="heading-primary">Alle Eins&auml;tze</h1>
            {isEinsatzplaner(user) &&
                <div className={styles.btnGroup}>
                    <Link className="btn" href={`/activities/add`}>Einsatz hinzuf&uuml;gen</Link>
                    {!filterExpanded && <button type="button"
                                                className={`btn btn-icon ${styles.btnIconSecondary}`}
                                                onClick={() => handleToggle(true)}>
                        <IconFilter/>
                        Filter anzeigen
                    </button>}
                </div>
            }

            <Filter
                type={FILTER_TYPE[3]}
                listEinsatztyp={listEinsatztyp}
                listRolle={listRolle}
                listStatus={listStatus}
                doFilter={(data) => handleFilter(data)}
                isExpanded={filterExpanded}
                doCollapse={() => handleToggle(false)}/>

            {(!filteredActivities || filteredActivities.length === 0) &&
                <p className="info-no-data">Es sind keine Eins&auml;tze vorhanden.</p>}
            <ul className={styles.list}>
                {filteredActivities?.map(activity => (
                    <li key={activity.id}>
                        <ActivityItemOverall key={activity.id} activity={activity}/>
                    </li>
                ))}
            </ul>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const {token} = parseCookies(req);
    // Fetch orders
    const activitiesRes = await fetch(`${API_URL}/api/activities?populate=demand&populate=demand.einsatztyp&populate=rollen.rolle&populate=rollen.availability.benutzer&populate=orders`, configRequest('GET', token));
    const activities = await activitiesRes.json();
    handleErrorMessage(activitiesRes, toast);

    return {
        props: {
            activities: activities.data,
            token
        }
    };
}
