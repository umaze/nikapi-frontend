import {
    addSelectable,
    initSelectables,
    setAvailabilities,
    setDemand,
    setMatchingOrders,
    setRole
} from "@/store/activitySlice";
import {API_URL} from "@/config/index";
import {configRequest, formatTime, handleErrorMessage} from "@/helpers/index";
import {toast} from "react-toastify";
import Step from "@/components/Step";
import styles from "@/styles/Activities.module.scss";
import SelectWrapper from "@/components/SelectWrapper";
import ApplyRoles from "@/components/ApplyRoles";
import ApplyOrders from "@/components/ApplyOrders";
import Confirmation from "@/components/Confirmation";
import {FaArrowLeft, FaArrowRight, FaSave} from "react-icons/fa";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";

export default function ActivityForm({
                                         activity,
                                         demands,
                                         persistedAvailabilities,
                                         token,
                                         register,
                                         errors,
                                         reset,
                                         isValid,
                                         setValue
                                     }) {
    const [step, setStep] = useState(0);
    const [selectedDatum, setSelectedDatum] = useState('');
    const [selectedEinsatztyp, setSelectedEinsatztyp] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (activity) {
            const demand = activity.demand.data;
            if (demand) {
                initialize(demand);
            }
            const selectsRollen = initRoles(activity.rollen);
            setValue('activity', {
                bezeichnung: activity.bezeichnung,
                bemerkung: activity.bemerkung,
                selectStatus: activity.status,
                selectDemand: demand?.id,
                orders: activity.orders,
                ...selectsRollen
            });
        }
        dispatch(setAvailabilities([...persistedAvailabilities]
        ));
    }, []);

    const handleChange = async event => {
        reset({
            activity: {
                selectDemand: event.target.value
            }
        });
        const selectedDemand = demands.find(demand => +demand.id === +event.target.value);
        await initialize(selectedDemand);
    };

    const initRoles = rollen => {
        const props = {};
        rollen.forEach((item, i) => {
            const state = {};
            const prop = `${item.rolle.name.toLowerCase()}_${i}`;
            const value = `${item.availability.data.id}`;
            state[prop] = value;
            props[`select${prop}`] = value;
            dispatch(setRole(state));
            dispatch(addSelectable(state));
        });
        return props;
    };

    const initialize = async selectedDemand => {
        setSelectedDatum(selectedDemand.attributes.datum);
        setSelectedEinsatztyp(selectedDemand.attributes.einsatztyp.typ);
        dispatch(
            setDemand({
                ...selectedDemand
            })
        );
        dispatch(initSelectables());
        const matchingOrders = await fetchMatchingOrders(selectedDemand);
        const orders = matchingOrders.length > 0 ? [...matchingOrders] : [];
        dispatch(
            setMatchingOrders(
                orders
            )
        );
    };

    const fetchMatchingOrders = async demand => {
        // Fetch relevant orders (matching einsatztyp and datum)
        const ordersRes = await fetch(`${API_URL}/api/orders?populate=einsatztyp&filters[einsatztyp][typ][$eq]=${demand.attributes.einsatztyp.typ}&filters[datum][$eq]=${demand.attributes.datum}`, configRequest('GET', token));
        const matchingOrders = await ordersRes.json();
        handleErrorMessage(ordersRes, toast);
        return matchingOrders.data;
    }

    const getOptionLabel = demand => {
        const typ = demand.attributes.einsatztyp?.typ;
        const datum = new Date(demand.attributes.datum).toLocaleDateString('de-CH')
        const zeit = `${formatTime(demand.attributes.zeitVon)} - ${formatTime(demand.attributes.zeitBis)}`;
        const gruppe = demand.attributes.gruppe.data.attributes.name;
        if (demand.attributes.zeitVon) {
            return `${datum} | ${zeit} | ${typ} [${gruppe}]`;
        } else {
            return `${datum} | keine Zeit | ${typ} [${gruppe}]`;
        }
    };

    const demandOptions = options => (
        <>
            <option value="" hidden>Wähle eine Veranstaltung...</option>
            {options && options.map((option, i) => (
                <option key={i} value={option.id}>{getOptionLabel(option)}</option>
            ))}
        </>
    );

    const DemandFields = () => (
        <Step title="Veranstaltung" info="Eine Veranstaltung auswählen" current={step + 1} size={fieldGroups.length}>
            <div className={styles.infos}>
                <p>Datum: <strong>{selectedDatum ? new Date(selectedDatum).toLocaleDateString('de-CH') : '-'}</strong>
                </p>
                <p>Einsatztyp: <strong>{selectedEinsatztyp || '-'}</strong></p>
            </div>
            <SelectWrapper
                label="Veranstaltung"
                required
                disabled={!!activity && !!activity.demand.data}
                id="activity.selectDemand"
                options={demandOptions(demands)}
                register={register}
                handleChange={e => handleChange(e)}
                errors={errors}/>
        </Step>
    );

    const ApplyRolesFields = () => (
        <ApplyRoles
            currentStep={step + 1}
            stepsSize={fieldGroups.length}
            register={register}
            errors={errors}/>
    );

    const ApplyOrdersFields = () => (
        <ApplyOrders
            currentStep={step + 1}
            stepsSize={fieldGroups.length}
            register={register}
            errors={errors}/>
    );

    const ConfirmationFields = () => (
        <Confirmation
            currentStep={step + 1}
            stepsSize={fieldGroups.length}
            register={register}
            errors={errors}/>
    )

    /** Navigation between steps */
    const Navigation = () => (
        <section className={styles.navigationControls}>
            {
                step === fieldGroups.length - 1 &&
                <button type="submit" disabled={!isValid}
                        className="btn btn-icon">
                    <FaSave/>Speichern
                </button>
            }
            {
                step < fieldGroups.length - 1 &&
                <button type="button" onClick={() => setStep(step + 1)} disabled={!isValid}
                        className="btn-secondary btn-icon btn-icon--right">
                    Weiter<FaArrowRight/>
                </button>
            }
            {
                step > 0 &&
                <button type="button" onClick={() => setStep(step - 1)}
                        className="btn-secondary btn-icon">
                    <FaArrowLeft/>Zur&uuml;ck
                </button>
            }
            {
                step === 0 &&
                <Link className="btn-secondary" href={`/activities`}>Abbrechen</Link>
            }
        </section>
    )

    const fieldGroups = [
        <DemandFields/>,
        <ApplyRolesFields/>,
        <ApplyOrdersFields/>,
        <ConfirmationFields/>
    ];

    return (
        <>
            {fieldGroups[step]}
            <Navigation/>
        </>
    );
}
