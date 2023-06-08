import Layout from "@/components/Layout";
import AvailabilityItem from "@/components/AvailabilityItem";
import {API_URL, FILTER_TYPE} from "@/config/index";
import {configRequest, parseCookies} from "@/helpers/index";
import {useState} from "react";
import _ from "lodash";
import Filter from "@/components/Filter";
import {IconFilter} from "@tabler/icons-react";
import styles from "@/styles/Demands.module.scss";

export default function AvailabilitiesPage({availabilities}) {
    const [filteredAvailabilities, setFilteredAvailabilities] = useState(_.cloneDeep(availabilities));
    const [filterExpanded, setFilterExpanded] = useState(false);

    const listEinsatztyp = availabilities?.length > 0 ?
        [...new Set(availabilities.flatMap(availability => availability.attributes.demand.data.attributes.einsatztyp?.typ))] :
        [];
    const listRolle = availabilities?.length > 0 ?
        [...new Set(availabilities.flatMap(availability => availability.attributes.rollen?.map(rolle => rolle.name)))] :
        [];

    const handleFilter = data => {
        let filtered = _.cloneDeep(availabilities);
        if (Object.keys(data).length !== 0) {
            if (data.benutzer) {
                filtered = filtered.filter(availability => availability.attributes.benutzer.data.attributes.username.toLowerCase().includes(data.benutzer.toLowerCase()));
            }
            if (data.datum) {
                filtered = filtered.filter(availability => availability.attributes.demand.data.attributes.datum === data.datum);
            }
            if (data.selectRolle) {
                filtered = filtered.filter(availability => availability.attributes.rollen?.some(rolle => rolle.name === data.selectRolle));
            }
            if (data.selectEinsatztyp) {
                filtered = filtered.filter(availability => availability.attributes.demand.data.attributes.einsatztyp?.typ === data.selectEinsatztyp);
            }
        }
        setFilteredAvailabilities(filtered);
    };

    const handleToggle = flag => setFilterExpanded(flag);

    return (
        <Layout>
            <h1 className="heading-primary">Verf&uuml;gbar&shy;keiten</h1>
            <div className={styles.btnGroup}>
                {!filterExpanded && <button type="button"
                                            className={`btn btn-icon ${styles.btnIconSecondary}`}
                                            onClick={() => handleToggle(true)}>
                    <IconFilter/>
                    Filter anzeigen
                </button>}
            </div>

            <Filter
                type={FILTER_TYPE[1]}
                listEinsatztyp={listEinsatztyp}
                listRolle={listRolle}
                doFilter={(data) => handleFilter(data)}
                isExpanded={filterExpanded}
                doCollapse={() => handleToggle(false)}/>

            {filteredAvailabilities.length === 0 &&
                <p className="info-no-data">Es sind keine Verf&uuml;gbarkeiten vorhanden.</p>}
            <ul className={styles.list}>
                {filteredAvailabilities.map(availability => (
                    <li key={availability.id}>
                        <AvailabilityItem key={availability.id} availability={availability.attributes}/>
                    </li>
                ))}
            </ul>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const {token} = parseCookies(req);

    // Fetch availabilities
    const availabilitiesRes = await fetch(`${API_URL}/api/availabilities?populate=rollen&populate=demand.einsatztyp&populate=benutzer&sort=bemerkung:asc`, configRequest('GET', token));
    const availabilities = await availabilitiesRes.json();

    return {
        props: {
            availabilities: availabilities.data
        }
    };
}
