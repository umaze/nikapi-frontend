import {
    parseCookies,
    groupSelectedRolesByDemandId,
    getMatchingSelectionsWithUpdates,
    getDifferentSelections,
    handleErrorMessage,
    configRequest
} from '@/helpers/index';
import DemandGroupItem from "@/components/DemandGroupItem";
import {toast} from 'react-toastify';
import {useRouter} from 'next/router';
import {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {initAvailability, selectAvailabilities, updateAvailability} from '@/store/availabilitySlice';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {API_URL} from '@/config/index';
import {IconArrowLeft} from "@tabler/icons-react";
import styles from '@/styles/FormAvailability.module.scss';

export default function ManageAvailabilityPage({token, demandGroups, persistedSelection}) {
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
        let countFaults = 0;

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
        //

        await Promise.all(inserts.map(async item => {
            const data = initAvailabilityData('Verfügbarkeit hinzugefügt', item);
            const res = await fetch(`${API_URL}/api/availabilities`, configRequest('POST', token, JSON.stringify(data)));
            !res.ok && countFaults++;
            handleErrorMessage(res, toast, 'custom-id-inserts');
        }));
        await Promise.all(updates.map(async item => {
            const data = initAvailabilityData('Verfügbarkeit bearbeitet', item);
            const res = await fetch(`${API_URL}/api/availabilities/${item.id}`, configRequest('PUT', token, JSON.stringify(data)));
            !res.ok && countFaults++;
            handleErrorMessage(res, toast, 'custom-id-updates');
        }));
        await Promise.all(deletions.map(async item => {
            const res = await fetch(`${API_URL}/api/availabilities/${item.id}`, configRequest('DELETE', token));
            !res.ok && countFaults++;
            handleErrorMessage(res, toast, 'custom-id-deletions');
        }));

        if (countFaults > 0) {
            toast.warning('Änderungen nicht vollständig gespeichert', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-warning'
            });
        } else {
            toast.success('Verfügbarkeiten erfolgreich geändert', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            });
        }

        await router.replace(router.asPath);
    };

    const initFormData = () => {
        dispatch(initAvailability());
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
    };

    useEffect(() => {
        setAvailabilities([
                ...selected
            ]
        );
    }, [selected]);

    useEffect(() => {
        initFormData();
    }, [persistedSelection]);

    return (
        <Layout title="Verfügbarkeiten verwalten">
            <Link className="link--back" href="/availabilities/me"><IconArrowLeft/>Zur&uuml;ck zu Meine Verf&uuml;gbarkeiten</Link>
            <h1 className="heading-primary">Verf&uuml;gbarkeiten verwalten</h1>

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

                <button type="submit" className="btn">&Auml;nderung speichern</button>
                <Link className="link--back link--back-bottom" href="/availabilities/me"><IconArrowLeft/>Zur&uuml;ck zu Meine Verf&uuml;gbarkeiten</Link>
            </form>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const {token} = parseCookies(req);

    // Fetch demands
    const demandGroupsRes = await fetch(`${API_URL}/api/demand-groups?populate=demands.einsatztyp&populate=rollen`, configRequest('GET', token));
    const demandGroups = await demandGroupsRes.json();
    handleErrorMessage(demandGroupsRes, toast);

    // Fetch availabilities
    const availabilitiesRes = await fetch(`${API_URL}/api/availabilities/me?populate=rollen&populate=demand&populate=demand.gruppe`, configRequest('GET', token));
    const myAvailabilities = await availabilitiesRes.json();
    handleErrorMessage(availabilitiesRes, toast);

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
