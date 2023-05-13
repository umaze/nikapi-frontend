import Layout from "@/components/Layout";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {configRequest, formatDate, handleErrorMessage, isEinsatzplaner, parseCookies} from '@/helpers/index';
import {API_URL, FILTER_TYPE} from "@/config/index";
import DemandItem from "@/components/DemandItem";
import Link from "next/link";
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import {useRouter} from "next/router";
import Modal from "@/components/Modal";
import Deletion from "@/components/Deletion";
import Filter from "@/components/Filter";
import _ from "lodash";
import {IconFilter} from "@tabler/icons-react";
import styles from '@/styles/Demands.module.scss';

export default function DemandsPage({ demands, demandGroups, token }) {
    const [filteredDemands, setFilteredDemands] = useState(_.cloneDeep(demands));
    const [filterExpanded, setFilterExpanded] = useState(false);
    const {user} = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedDemand, setSelectedDemand] = useState({});
    const router = useRouter();

    const listEinsatztyp = demands?.length > 0 ?
        [...new Set(demands.flatMap(demand => demand.attributes.einsatztyp?.typ))] :
        [];

    const listRolle = demandGroups?.length > 0 ?
        [...new Set(demandGroups.flatMap(group => group.attributes.rollen?.map(rolle => rolle.name)))] :
        [];

    const handleFilter = data => {
        let filtered = _.cloneDeep(demands);
        if (Object.keys(data).length !== 0) {
            if (data.selectDemandGroup) {
                filtered = filtered.filter(demand => demand.attributes.gruppe.data.id === +data.selectDemandGroup);
            }
            if (data.datum) {
                filtered = filtered.filter(demand => demand.attributes.datum === data.datum);
            }
            if (data.selectRolle) {
                filtered = filtered.filter(demand => demand.attributes.gruppe.data.attributes.rollen?.some(rolle => rolle.name === data.selectRolle));
            }
            if (data.selectEinsatztyp) {
                filtered = filtered.filter(demand => demand.attributes.einsatztyp?.typ === data.selectEinsatztyp);
            }
        }
        setFilteredDemands(filtered);
    };

    const handleDelete = demand => {
        setSelectedDemand(demand);
        setShowModal(true);
    }

    const postDeletion = async () => {
        await router.replace(router.asPath);
        setShowModal(false);
    };

    const handleToggle = flag => setFilterExpanded(flag);

    return (
        <Layout>
            <h1 className="heading-primary">Ver&shy;anstaltungen</h1>
            {isEinsatzplaner(user) &&
                <div className={styles.btnGroup}>
                    <Link className="btn" href={`/demands/add`}>Veranstaltung hinzuf&uuml;gen</Link>
                    {!filterExpanded && <button type="button"
                                                className={`btn btn-icon ${styles.btnIconSecondary}`}
                                                onClick={() => handleToggle(true)}>
                        <IconFilter/>
                        Filter anzeigen
                    </button>}
                </div>
            }

            <Filter
                type={FILTER_TYPE[0]}
                demandGroups={demandGroups}
                listEinsatztyp={listEinsatztyp}
                listRolle={listRolle}
                doFilter={(data) => handleFilter(data)}
                isExpanded={filterExpanded}
                doCollapse={() => handleToggle(false)}/>

            {filteredDemands?.length === 0 && <p className="info-no-data">Es sind keine Veranstaltungen vorhanden.</p>}
            <ul className={styles.list}>
                {filteredDemands?.map(demand => (
                    <li key={demand.id}>
                        <DemandItem key={demand.id} demand={demand} onDelete={() => handleDelete(demand)} token={token} />
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
                        <li><em>{formatDate(selectedDemand.attributes?.datum)}</em></li>
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
    const demandsRes = await fetch(`${API_URL}/api/demands?populate=einsatztyp&populate=gruppe.rollen&populate=activities&sort=datum:asc`, configRequest('GET', token));
    const demands = await demandsRes.json();
    handleErrorMessage(demandsRes, toast);

    // Fetch demand groups
    const demandGroupsRes = await fetch(`${API_URL}/api/demand-groups?populate=rollen`, configRequest('GET', token));
    const demandGroups = await demandGroupsRes.json();
    handleErrorMessage(demandGroupsRes, toast);

    return {
        props: {
            demands: demands.data,
            demandGroups: demandGroups.data,
            token
        }
    };
}
