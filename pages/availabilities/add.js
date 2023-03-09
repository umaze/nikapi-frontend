import {
    parseCookies,
    groupSelectedRolesByDemandId,
    getMatchingSelectionsWithUpdates,
    getDifferentSelections,
    handleErrorMessage,
    configRequest
} from '@/helpers/index';
import DemandGroupItem from "@/components/DemandGroupItem";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from 'next/router';
import {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectAvailabilities, updateAvailability} from '@/store/availabilitySlice';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {API_URL} from '@/config/index';
import styles from '@/styles/FormAvailability.module.scss';

export default function AddAvailabilityPage({token, demandGroups, persistedSelection}) {
    const [availabilities, setAvailabilities] = useState([]);

    const selected = useSelector(selectAvailabilities);
    const dispatch = useDispatch();
    const router = useRouter();
    let formRef = useRef();

    const initAvailabilityData = (bemerkung, availability) => {
        return {
            data: {
                bemerkung,
                rollen: availability.rollen.map(rolle => {
                    return {
                        "name": rolle
                    }
                }),
                demand: +availability.demandId
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // demands with selected roles
        const groupedSelection = groupSelectedRolesByDemandId(availabilities);

        const inserts = getDifferentSelections(groupedSelection, persistedSelection);
        const deletions = getDifferentSelections(persistedSelection, groupedSelection);
        const updates = getMatchingSelectionsWithUpdates(groupedSelection, persistedSelection);
        // console.log(`DELETE: ${JSON.stringify(deletions.map(item => {
        //     return {
        //         id: item.id,
        //         groupId: item.groupId,
        //         demandId: item.demandId
        //     };
        // }))}`);
        // console.log(`POST: ${JSON.stringify(inserts.map(item => {
        //     return {
        //         id: item.id,
        //         groupId: item.groupId,
        //         demandId: item.demandId
        //     };
        // }))}`);
        // console.log(`PUT: ${JSON.stringify(updates.map(item => {
        //     return {
        //         id: item.id,
        //         groupId: item.groupId,
        //         demandId: item.demandId
        //     };
        // }))}`);

        inserts.forEach(item => {
            const data = initAvailabilityData('Neue Verfügbarkeit', item);
            fetch(`${API_URL}/api/availabilities`, configRequest('POST', token, JSON.stringify(data)))
                .then(res => handleErrorMessage(res));
        });
        updates.forEach(item => {
            const data = initAvailabilityData('Verfügbarkeit bearbeitet', item);
            fetch(`${API_URL}/api/availabilities/${item.id}`, configRequest('PUT', token, JSON.stringify(data)))
                .then(res => handleErrorMessage(res));
        });
        deletions.forEach(item => {
            fetch(`${API_URL}/api/availabilities/${item.id}`, configRequest('DELETE', token))
                .then(res => handleErrorMessage(res));
        });

        // else {
        //     const availability = await res.json();
        //     router.push(`/availabilities/${availability.data.attributes.slug}`);
        // }
    };

    useEffect(() => {
        setAvailabilities([
                ...selected
            ]
        );
    }, [selected]);

    useEffect(() => {
        persistedSelection.forEach(item => item.rollen.forEach(rolle => {
            dispatch(
                updateAvailability({
                    id: item.id,
                    groupId: item.groupId,
                    demandId: `${item.demandId}`,
                    name: rolle.name,
                    checked: true
                })
            );
        }));
    }, []);

    return (
        <Layout title="Verfügbarkeiten verwalten">
            <Link className="link--back" href="/availabilities">Zur&uuml;ck zu Verf&uuml;gbarkeiten</Link>
            <h1 className="heading-primary">Verf&uuml;gbarkeiten verwalten</h1>
            <ToastContainer/>

            <form
                onSubmit={handleSubmit}
                className={styles.form}
                ref={(el) => formRef = el}>
                {demandGroups?.length === 0 && <h3 className="heading-tertiary">No groups to show</h3>}
                <ul className={styles.list}>
                    {demandGroups?.map(group => (
                        <li key={group.id}>
                            <DemandGroupItem key={group.id} group={group}/>
                        </li>
                    ))}
                </ul>

                <input type="submit" value="Add Availability" className="btn"/>
            </form>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const {token} = parseCookies(req);

    // Fetch demands
    const demandGroupsRes = await fetch(`${API_URL}/api/demand-groups?populate=demands.einsatztyp&populate=rollen`, configRequest('GET', token));
    const demandGroups = await demandGroupsRes.json();
    handleErrorMessage(demandGroupsRes);

    // Fetch availabilities
    const availabilitiesRes = await fetch(`${API_URL}/api/availabilities/me?populate=rollen&populate=demand&populate=demand.gruppe`, configRequest('GET', token));
    const myAvailabilities = await availabilitiesRes.json();
    handleErrorMessage(availabilitiesRes);

    const persistedSelection = myAvailabilities.data.map((item) => {
        return {
            id: item.id,
            groupId: item.attributes.demand.data.attributes.gruppe.data.id,
            demandId: item.attributes.demand.data.id,
            rollen: item.attributes.rollen
        }
    });

    return {
        props: {
            demandGroups: demandGroups.data,
            persistedSelection,
            token
        }
    };
}
